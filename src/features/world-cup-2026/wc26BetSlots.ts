import { parseUtcDate } from '../../shared/utcDate';
import type { ExternalMatch } from '../match-results/types/ExternalMatch';
import { WC26_SCHEDULE, type Wc26Match } from './wc26Schedule';
import { WC26_TEAMS, type Wc26TeamId } from './wc26Teams';
import {
	berlinKickoffToUtcMs,
	formatBerlinDateFromIsoDate,
	getBerlinUtcOffsetLabel,
} from './wc26Time';

const BERLIN_GROUP_SLOT = /^([123]) \[(\d+)\]$/;

/** Playoff betting slots → wc26 schedule ids (mirrors backend WcTournamentSlots). */
const PLAYOFF_SLOT_SCHEDULE_IDS: Record<string, number[]> = {
	'1/16 [1]': [73, 74, 75, 76],
	'1/16 [2]': [77, 78, 79],
	'1/16 [3]': [80, 81, 82],
	'1/16 [4]': [83, 84, 85],
	'1/16 [5]': [86, 87, 88],
	'1/8 [1]': [89, 90, 91, 92],
	'1/8 [2]': [93, 94, 95, 96],
	'1/4': [97, 98, 99, 100],
	'1/2': [101, 102],
	third_place: [103],
	final: [104],
};

const KICKOFF_MATCH_WINDOW_MS = 180 * 60 * 1000;

/** odds-api / 4score names per FIFA code — mirrors backend Wc26TeamCatalog. */
const API_NAMES_BY_FIFA: Record<Wc26TeamId, string[]> = {
	MEX: ['Mexico', 'Мексика'],
	RSA: ['South Africa', 'SouthAfrica', 'ЮАР', 'Южная Африка'],
	KOR: ['Korea Republic', 'South Korea', 'KoreaRepublic', 'SouthKorea', 'Корея', 'Южная Корея'],
	CZE: ['Czechia', 'Czech Republic', 'CzechRepublic', 'Чехия'],
	CAN: ['Canada'],
	SUI: ['Switzerland'],
	QAT: ['Qatar'],
	BIH: ['Bosnia and Herzegovina', 'Bosnia', 'BosniaHerzegovina'],
	BRA: ['Brazil'],
	MAR: ['Morocco'],
	HAI: ['Haiti'],
	SCO: ['Scotland'],
	USA: ['USA', 'United States', 'UnitedStates'],
	PAR: ['Paraguay'],
	AUS: ['Australia'],
	TUR: ['Türkiye', 'Turkey'],
	GER: ['Germany'],
	CUW: ['Curaçao', 'Curacao'],
	CIV: ["Côte d'Ivoire", 'Ivory Coast', 'IvoryCoast'],
	ECU: ['Ecuador'],
	NED: ['Netherlands'],
	JPN: ['Japan'],
	TUN: ['Tunisia'],
	SWE: ['Sweden'],
	KSA: ['Saudi Arabia', 'SaudiArabia'],
	URU: ['Uruguay'],
	ESP: ['Spain'],
	CPV: ['Cabo Verde', 'Cape Verde', 'Cape Verde Islands', 'CaboVerde'],
	IRN: ['IR Iran', 'Iran'],
	NZL: ['New Zealand'],
	BEL: ['Belgium'],
	EGY: ['Egypt'],
	FRA: ['France'],
	SEN: ['Senegal'],
	IRQ: ['Iraq'],
	NOR: ['Norway'],
	ARG: ['Argentina'],
	ALG: ['Algeria'],
	AUT: ['Austria'],
	JOR: ['Jordan'],
	ENG: ['England'],
	CRO: ['Croatia'],
	GHA: ['Ghana'],
	PAN: ['Panama'],
	POR: ['Portugal'],
	UZB: ['Uzbekistan'],
	COL: ['Colombia'],
	COD: ['Congo DR', 'DR Congo', 'DRCongo'],
};

function normalizeCompact(value: string | null | undefined): string {
	return (value ?? '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

export function isBerlinGroupSlot(slotId: string): boolean {
	return BERLIN_GROUP_SLOT.test(slotId);
}

export function isWcBettingSlot(slotId: string): boolean {
	return isBerlinGroupSlot(slotId) || slotId in PLAYOFF_SLOT_SCHEDULE_IDS;
}

export function isPlayoffSlot(slotId: string): boolean {
	return isWcBettingSlot(slotId) && !isBerlinGroupSlot(slotId);
}

function belongsToAnotherPlayoffSlot(slotId: string, scheduleId: number): boolean {
	for (const [otherSlotId, ids] of Object.entries(PLAYOFF_SLOT_SCHEDULE_IDS)) {
		if (otherSlotId === slotId) {
			continue;
		}
		if (ids.includes(scheduleId)) {
			return true;
		}
	}
	return false;
}

export function externalMatchBelongsToWcSlot(match: ExternalMatch, slotId: string): boolean {
	if (!isWcBettingSlot(slotId)) {
		return true;
	}
	const slotIds = scheduleIdsForSlot(slotId);
	const slotIdSet = new Set(slotIds);
	const scheduleId = match.wc26ScheduleId;
	if (isPlayoffSlot(slotId)) {
		return scheduleId != null && slotIdSet.has(scheduleId);
	}
	if (scheduleId != null) {
		if (slotIdSet.has(scheduleId)) {
			return true;
		}
		if (belongsToAnotherPlayoffSlot(slotId, scheduleId)) {
			return false;
		}
	}
	const expected = getWc26MatchesForSlot(slotId).filter((m) => m.home && m.away);
	if (expected.length > 0) {
		if (
			expected.some(
				(scheduled) =>
					scheduled.home &&
					scheduled.away &&
					externalMatchesPair(match, scheduled.home, scheduled.away)
			)
		) {
			return true;
		}
	}
	if (kickoffMatchesSlotSchedule(match, slotId)) {
		return true;
	}
	return false;
}

export function parseBerlinSlotId(slotId: string): { round: number; index: number } | null {
	const match = BERLIN_GROUP_SLOT.exec(slotId);
	if (!match) {
		return null;
	}
	return { round: Number(match[1]), index: Number(match[2]) };
}

export function scheduleIdsForSlot(slotId: string): number[] {
	const playoff = PLAYOFF_SLOT_SCHEDULE_IDS[slotId.trim()];
	if (playoff) {
		return [...playoff];
	}
	const parsed = parseBerlinSlotId(slotId);
	if (!parsed) {
		return [];
	}
	const matchesPerSlot = parsed.round === 3 ? 6 : 4;
	const startId = (parsed.round - 1) * 24 + (parsed.index - 1) * matchesPerSlot + 1;
	return Array.from({ length: matchesPerSlot }, (_, i) => startId + i);
}

export function betsRequiredForSlot(slotId: string): number {
	const parsed = parseBerlinSlotId(slotId);
	if (!parsed) {
		return 1;
	}
	if (parsed.round === 3) {
		return 3;
	}
	if (parsed.round === 1 || parsed.round === 2) {
		return 2;
	}
	return 1;
}

export function matchesPerSlot(slotId: string): number {
	return scheduleIdsForSlot(slotId).length;
}

export function getWc26MatchesForSlot(slotId: string): Wc26Match[] {
	const ids = new Set(scheduleIdsForSlot(slotId));
	return WC26_SCHEDULE.filter((m) => ids.has(m.id));
}

export function getWc26ScheduleById(scheduleId: number | null | undefined): Wc26Match | undefined {
	if (scheduleId == null) {
		return undefined;
	}
	return WC26_SCHEDULE.find((m) => m.id === scheduleId);
}

function nameMatchesFifa(name: string | null | undefined, fifa: Wc26TeamId): boolean {
	const compact = normalizeCompact(name);
	if (!compact) {
		return false;
	}
	if (compact === fifa.toLowerCase()) {
		return true;
	}
	return API_NAMES_BY_FIFA[fifa].some(
		(candidate) => normalizeCompact(candidate) === compact
	);
}

function sideNameCandidates(
	match: ExternalMatch,
	side: 'home' | 'away'
): Array<string | null | undefined> {
	const displayNames =
		side === 'home' ? match.homeTeamDisplayNames : match.awayTeamDisplayNames;
	const country = side === 'home' ? match.homeTeamCountry : match.awayTeamCountry;
	return [
		side === 'home' ? match.homeTeamName : match.awayTeamName,
		side === 'home' ? match.homeTeamTitle : match.awayTeamTitle,
		displayNames?.en,
		displayNames?.ru,
		displayNames?.de,
		country,
	];
}

function sideMatchesFifa(
	match: ExternalMatch,
	side: 'home' | 'away',
	fifa: Wc26TeamId
): boolean {
	return sideNameCandidates(match, side).some((candidate) => nameMatchesFifa(candidate, fifa));
}

function externalMatchesPair(
	match: ExternalMatch,
	homeFifa: Wc26TeamId,
	awayFifa: Wc26TeamId
): boolean {
	return sideMatchesFifa(match, 'home', homeFifa) && sideMatchesFifa(match, 'away', awayFifa);
}

export function filterExternalMatchesForBerlinSlot(
	matches: ExternalMatch[],
	slotId: string
): ExternalMatch[] {
	return filterExternalMatchesForWcSlot(matches, slotId);
}

function scheduleKickoffToUtcMs(scheduled: Wc26Match): number {
	return berlinKickoffToUtcMs(scheduled.date, scheduled.timeLocal);
}

function kickoffMatchesSlotSchedule(match: ExternalMatch, slotId: string): boolean {
	const slotIds = scheduleIdsForSlot(slotId);
	if (slotIds.length === 0) {
		return false;
	}
	const kickoffMs = parseUtcDate(match.utcDate)?.getTime();
	if (kickoffMs == null || Number.isNaN(kickoffMs)) {
		return false;
	}
	for (const scheduleId of slotIds) {
		const scheduled = WC26_SCHEDULE.find((m) => m.id === scheduleId);
		if (!scheduled) {
			continue;
		}
		const slotKickoffMs = scheduleKickoffToUtcMs(scheduled);
		if (Math.abs(kickoffMs - slotKickoffMs) <= KICKOFF_MATCH_WINDOW_MS) {
			return true;
		}
	}
	return false;
}

export function filterExternalMatchesForWcSlot(
	matches: ExternalMatch[],
	slotId: string
): ExternalMatch[] {
	if (!isWcBettingSlot(slotId)) {
		return matches;
	}
	return matches.filter((match) => externalMatchBelongsToWcSlot(match, slotId));
}

function findInScheduleByTeams(match: ExternalMatch, candidates: Wc26Match[]): Wc26Match | undefined {
	return candidates.find(
		(scheduled) =>
			scheduled.home &&
			scheduled.away &&
			externalMatchesPair(match, scheduled.home, scheduled.away)
	);
}

function findWc26ScheduleMatchByKickoff(
	match: ExternalMatch,
	candidates: Wc26Match[]
): Wc26Match | undefined {
	const kickoffMs = parseUtcDate(match.utcDate)?.getTime();
	if (kickoffMs == null || Number.isNaN(kickoffMs)) {
		return undefined;
	}
	let best: Wc26Match | undefined;
	let bestDelta = KICKOFF_MATCH_WINDOW_MS + 1;
	for (const scheduled of candidates) {
		const slotKickoffMs = scheduleKickoffToUtcMs(scheduled);
		const delta = Math.abs(kickoffMs - slotKickoffMs);
		if (delta <= KICKOFF_MATCH_WINDOW_MS && delta < bestDelta) {
			bestDelta = delta;
			best = scheduled;
		}
	}
	return best;
}

export function resolveWc26TeamIdFromCountry(
	country: string | null | undefined
): Wc26TeamId | undefined {
	if (!country?.trim()) {
		return undefined;
	}
	const code = country.trim().toUpperCase();
	return Object.prototype.hasOwnProperty.call(WC26_TEAMS, code) ? (code as Wc26TeamId) : undefined;
}

export function findExternalMatchForWc26Schedule(
	scheduled: Wc26Match,
	externalMatches: ExternalMatch[]
): ExternalMatch | undefined {
	if (!scheduled.home || !scheduled.away) {
		return undefined;
	}
	return externalMatches.find((ext) =>
		externalMatchesPair(ext, scheduled.home!, scheduled.away!)
	);
}

export function findWc26ScheduleMatchForExternal(
	match: ExternalMatch,
	slotId?: string
): Wc26Match | undefined {
	if (match.wc26ScheduleId != null) {
		const byId = getWc26ScheduleById(match.wc26ScheduleId);
		if (byId) {
			return byId;
		}
	}
	if (slotId) {
		const fromSlotTeams = findInScheduleByTeams(match, getWc26MatchesForSlot(slotId));
		if (fromSlotTeams) {
			return fromSlotTeams;
		}
		const fromSlotKickoff = findWc26ScheduleMatchByKickoff(match, getWc26MatchesForSlot(slotId));
		if (fromSlotKickoff) {
			return fromSlotKickoff;
		}
	}
	const fromTeams = findInScheduleByTeams(match, WC26_SCHEDULE);
	if (fromTeams) {
		return fromTeams;
	}
	return findWc26ScheduleMatchByKickoff(match, WC26_SCHEDULE);
}

export interface BerlinSlotMeta {
	round: number;
	index: number;
	betsRequired: number;
	matchCount: number;
	rangeFrom: string;
	rangeTo: string;
	utcOffset: string;
}

export function getBerlinSlotMeta(slotId: string, language: string): BerlinSlotMeta | null {
	const parsed = parseBerlinSlotId(slotId);
	if (!parsed) {
		return null;
	}
	const slotMatches = getWc26MatchesForSlot(slotId);
	const berlinTimes = slotMatches
		.map((m) => ({ match: m, date: m.date, time: m.timeLocal }))
		.sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

	const formatBerlin = (date: string, time: string): string => {
		const dateLabel = formatBerlinDateFromIsoDate(date, language);
		return `${dateLabel}, ${time}`;
	};

	const first = berlinTimes[0];
	const last = berlinTimes[berlinTimes.length - 1];
	const utcOffset = first
		? getBerlinUtcOffsetLabel(berlinKickoffToUtcMs(first.match.date, first.match.timeLocal))
		: '';

	return {
		round: parsed.round,
		index: parsed.index,
		betsRequired: betsRequiredForSlot(slotId),
		matchCount: slotMatches.length,
		rangeFrom: first ? formatBerlin(first.date, first.time) : '',
		rangeTo: last ? formatBerlin(last.date, last.time) : '',
		utcOffset,
	};
}

export function utcToBerlinKickoff(utcDate: string | undefined): string {
	const kickoff = parseUtcDate(utcDate);
	if (!kickoff) {
		return '—';
	}
	return new Intl.DateTimeFormat('de-DE', {
		timeZone: 'Europe/Berlin',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	}).format(kickoff);
}

export function expectedBerlinMatchCount(slotId: string): number {
	return matchesPerSlot(slotId);
}

export interface WcScheduleExternalMatchContext {
	leagueCode: string;
	season: string;
	matchday: number;
	leagueId?: string;
}

function resolveScheduleIdForExternalMatch(
	match: ExternalMatch,
	slotId: string
): number | undefined {
	if (match.wc26ScheduleId != null) {
		return match.wc26ScheduleId;
	}
	return findWc26ScheduleMatchForExternal(match, slotId)?.id;
}

function syntheticExternalMatchFromSchedule(
	scheduled: Wc26Match,
	ctx: WcScheduleExternalMatchContext
): ExternalMatch {
	return {
		externalMatchId: -scheduled.id,
		leagueCode: ctx.leagueCode,
		matchday: ctx.matchday,
		season: ctx.season,
		status: 'SCHEDULED',
		homeTeamName: scheduled.home ?? '',
		awayTeamName: scheduled.away ?? '',
		homeTeamCountry: scheduled.home ?? null,
		awayTeamCountry: scheduled.away ?? null,
		wc26ScheduleId: scheduled.id,
	};
}

/** Дополняет API-матчи слота запланированными парами из wc26_schedule (если sync ещё не подтянул). */
export function mergeExternalMatchesWithWcSchedule(
	externalMatches: ExternalMatch[],
	slotId: string,
	ctx: WcScheduleExternalMatchContext
): ExternalMatch[] {
	if (!isWcBettingSlot(slotId)) {
		return externalMatches;
	}
	const byScheduleId = new Map<number, ExternalMatch>();
	for (const match of externalMatches) {
		const scheduleId = resolveScheduleIdForExternalMatch(match, slotId);
		if (scheduleId != null) {
			byScheduleId.set(scheduleId, match);
		}
	}
	const merged: ExternalMatch[] = [];
	for (const scheduleId of scheduleIdsForSlot(slotId)) {
		const existing = byScheduleId.get(scheduleId);
		if (existing) {
			merged.push(existing);
			continue;
		}
		const scheduled = getWc26ScheduleById(scheduleId);
		if (scheduled?.home && scheduled?.away) {
			merged.push(syntheticExternalMatchFromSchedule(scheduled, ctx));
		}
	}
	return merged;
}
