import { MATCHDAY_TITLE_FINAL } from '../../constants';
import Calendar from '../admin/calendars/types/Calendar';
import LeagueMatchdayNode from '../admin/calendars/types/LeagueMatchdayNode';

export const FALLBACK_DEFAULT_BET_SIZE = 10;

type LeagueMatchdayNodeLike = LeagueMatchdayNode & { default_bet_size?: number };

export function getMatchdayBaseName(matchDay: string): string {
	const index = matchDay.indexOf('[');
	return index !== -1 ? matchDay.substring(0, index).trim() : matchDay;
}

export function normalizeMatchDayKey(matchDay: string): string {
	return getMatchdayBaseName(matchDay).trim();
}

export function getNodeDefaultBetSize(node: LeagueMatchdayNodeLike): number | undefined {
	const size = node.defaultBetSize ?? node.default_bet_size;
	return size != null && size > 0 ? size : undefined;
}

export function matchLeagueCodes(a: string | undefined, b: string | undefined): boolean {
	if (!a || !b) {
		return false;
	}
	return String(a).trim() === String(b).trim();
}

export function matchDaysEqual(a: string, b: string): boolean {
	const left = a.trim();
	const right = b.trim();
	if (left === right) {
		return true;
	}
	return normalizeMatchDayKey(a) === normalizeMatchDayKey(b);
}

type CalendarMatchdayMatch = { calendar: Calendar; node: LeagueMatchdayNode };

function pickBestCalendarMatchdayMatch(
	candidates: (CalendarMatchdayMatch & { exact: boolean })[]
): CalendarMatchdayMatch | null {
	if (candidates.length === 0) {
		return null;
	}

	const exactMatches = candidates.filter((candidate) => candidate.exact);
	const pool = exactMatches.length > 0 ? exactMatches : candidates;

	let best = pool[0];
	for (let index = 1; index < pool.length; index += 1) {
		const candidate = pool[index];
		const nodeSize = getNodeDefaultBetSize(candidate.node);
		const bestSize = getNodeDefaultBetSize(best.node);
		if (nodeSize != null && bestSize == null) {
			best = candidate;
			continue;
		}

		const nodeStart = candidate.calendar.startDate ?? '';
		const bestStart = best.calendar.startDate ?? '';
		if (nodeStart > bestStart) {
			best = candidate;
		}
	}

	return { calendar: best.calendar, node: best.node };
}

export function findLeagueMatchdayInCalendars(
	calendarNodes: Calendar[],
	leagueCode: string | undefined,
	matchDay: string,
	leagueId?: string
): CalendarMatchdayMatch | null {
	if (!leagueCode || !matchDay) {
		return null;
	}

	const candidates: (CalendarMatchdayMatch & { exact: boolean })[] = [];

	for (const calendar of calendarNodes) {
		for (const node of calendar.leagueMatchdayNodes ?? []) {
			if (leagueId && node.leagueId !== leagueId) {
				continue;
			}
			if (!matchLeagueCodes(node.leagueCode, leagueCode)) {
				continue;
			}
			const exact = node.matchDay.trim() === matchDay.trim();
			if (!exact && !matchDaysEqual(node.matchDay, matchDay)) {
				continue;
			}
			candidates.push({ calendar, node, exact });
		}
	}

	return pickBestCalendarMatchdayMatch(candidates);
}

export function isFinalMatchday(matchDay: string): boolean {
	return getMatchdayBaseName(matchDay) === MATCHDAY_TITLE_FINAL;
}

export function resolveSeasonDefaultBetSize(season?: {
	defaultBetSize?: number | null;
}): number {
	if (season?.defaultBetSize != null && season.defaultBetSize > 0) {
		return season.defaultBetSize;
	}
	return FALLBACK_DEFAULT_BET_SIZE;
}

/** Подсказка при добавлении тура в календарь (финал = удвоенный размер сезона). */
export function suggestedBetSizeForCalendarMatchday(
	seasonDefaultBetSize: number,
	matchDay: string
): number {
	const base =
		seasonDefaultBetSize > 0 ? seasonDefaultBetSize : FALLBACK_DEFAULT_BET_SIZE;
	return isFinalMatchday(matchDay) ? base * 2 : base;
}

export function resolveBetSizeForBetInput(
	seasonDefaultBetSize: number,
	matchDay: string,
	calendarNode?: LeagueMatchdayNode | null
): number {
	const fromCalendar = calendarNode ? getNodeDefaultBetSize(calendarNode) : undefined;
	if (fromCalendar != null) {
		return fromCalendar;
	}
	return seasonDefaultBetSize > 0 ? seasonDefaultBetSize : FALLBACK_DEFAULT_BET_SIZE;
}
