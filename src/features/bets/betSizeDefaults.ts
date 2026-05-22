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
	return normalizeMatchDayKey(a) === normalizeMatchDayKey(b);
}

export function findLeagueMatchdayInCalendars(
	calendarNodes: Calendar[],
	leagueCode: string | undefined,
	matchDay: string
): { calendar: Calendar; node: LeagueMatchdayNode } | null {
	if (!leagueCode || !matchDay) {
		return null;
	}

	let best: { calendar: Calendar; node: LeagueMatchdayNode } | null = null;

	for (const calendar of calendarNodes) {
		for (const node of calendar.leagueMatchdayNodes ?? []) {
			if (!matchLeagueCodes(node.leagueCode, leagueCode) || !matchDaysEqual(node.matchDay, matchDay)) {
				continue;
			}

			if (!best) {
				best = { calendar, node };
				continue;
			}

			const nodeSize = getNodeDefaultBetSize(node);
			const bestSize = getNodeDefaultBetSize(best.node);
			if (nodeSize != null && bestSize == null) {
				best = { calendar, node };
				continue;
			}

			const nodeStart = calendar.startDate ?? '';
			const bestStart = best.calendar.startDate ?? '';
			if (nodeStart > bestStart) {
				best = { calendar, node };
			}
		}
	}

	return best;
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
