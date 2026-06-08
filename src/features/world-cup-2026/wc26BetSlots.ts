import type { ExternalMatch } from '../football-data/types/ExternalMatch';
import { WC26_SCHEDULE, type Wc26Match } from './wc26Schedule';
import {
	formatBerlinDateFromIsoDate,
	getBerlinUtcOffsetLabel,
	kickoffToGerman,
	venueLocalKickoffToUtcMs,
} from './wc26Time';
import type { Wc26TeamId } from './wc26Teams';

const BERLIN_GROUP_SLOT = /^([123]) \[(\d+)\]$/;

/** odds-api / football-data names per FIFA code — mirrors backend Wc26TeamCatalog. */
const API_NAMES_BY_FIFA: Record<Wc26TeamId, string[]> = {
	MEX: ['Mexico'],
	RSA: ['South Africa', 'SouthAfrica'],
	KOR: ['Korea Republic', 'South Korea', 'KoreaRepublic', 'SouthKorea'],
	CZE: ['Czechia', 'Czech Republic', 'CzechRepublic'],
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

export function parseBerlinSlotId(slotId: string): { round: number; index: number } | null {
	const match = BERLIN_GROUP_SLOT.exec(slotId);
	if (!match) {
		return null;
	}
	return { round: Number(match[1]), index: Number(match[2]) };
}

export function scheduleIdsForSlot(slotId: string): number[] {
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
	if (!isBerlinGroupSlot(slotId)) {
		return matches;
	}
	const expected = getWc26MatchesForSlot(slotId).filter((m) => m.home && m.away);
	return matches.filter((ext) =>
		expected.some(
			(scheduled) =>
				scheduled.home &&
				scheduled.away &&
				externalMatchesPair(ext, scheduled.home, scheduled.away)
		)
	);
}

function findInScheduleByTeams(match: ExternalMatch, candidates: Wc26Match[]): Wc26Match | undefined {
	return candidates.find(
		(scheduled) =>
			scheduled.home &&
			scheduled.away &&
			externalMatchesPair(match, scheduled.home, scheduled.away)
	);
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
	if (slotId) {
		const fromSlot = findInScheduleByTeams(match, getWc26MatchesForSlot(slotId));
		if (fromSlot) {
			return fromSlot;
		}
	}
	return findInScheduleByTeams(match, WC26_SCHEDULE);
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
		.map((m) => ({
			match: m,
			german: kickoffToGerman(m.date, m.timeLocal, m.venueKey),
		}))
		.sort((a, b) =>
			`${a.german.date}T${a.german.time}`.localeCompare(`${b.german.date}T${b.german.time}`)
		);

	const formatBerlin = (date: string, time: string): string => {
		const dateLabel = formatBerlinDateFromIsoDate(date, language);
		return `${dateLabel}, ${time}`;
	};

	const first = berlinTimes[0];
	const last = berlinTimes[berlinTimes.length - 1];
	const utcOffset = first
		? getBerlinUtcOffsetLabel(
				venueLocalKickoffToUtcMs(first.match.date, first.match.timeLocal, first.match.venueKey)
			)
		: '';

	return {
		round: parsed.round,
		index: parsed.index,
		betsRequired: betsRequiredForSlot(slotId),
		matchCount: slotMatches.length,
		rangeFrom: first ? formatBerlin(first.german.date, first.german.time) : '',
		rangeTo: last ? formatBerlin(last.german.date, last.german.time) : '',
		utcOffset,
	};
}

export function utcToBerlinKickoff(utcDate: string | undefined): string {
	if (!utcDate) {
		return '—';
	}
	return new Intl.DateTimeFormat('de-DE', {
		timeZone: 'Europe/Berlin',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	}).format(new Date(utcDate));
}

export function expectedBerlinMatchCount(slotId: string): number {
	return matchesPerSlot(slotId);
}
