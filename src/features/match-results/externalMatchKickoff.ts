import { parseUtcDate } from '../../shared/utcDate';
import { formatUserDate, formatUserTime } from '../../shared/userDateTime';
import { resolveUserTimeZone } from '../../shared/userTimeZones';
import { isMatchNotStarted } from './matchStatusI18n';
import type { ExternalMatch } from './types/ExternalMatch';

export interface ExternalMatchBerlinKickoff {
	kickoff: string;
	dateLabel: string;
	kickoffUtcMs: number;
}

/** Kickoff UTC (ms) from stored utcDate Instant. */
export function resolveExternalMatchKickoffUtcMs(match: ExternalMatch): number {
	return parseUtcDate(match.utcDate)?.getTime() ?? 0;
}

/**
 * Display kickoff time/date in the user's timezone (default Europe/Berlin).
 * Name kept for call-site compatibility.
 */
export function resolveExternalMatchBerlinKickoff(
	match: ExternalMatch,
	_slotId?: string,
	language?: string,
	timeZone?: string | null
): ExternalMatchBerlinKickoff {
	const tz = resolveUserTimeZone(timeZone);
	return {
		kickoff: formatUserTime(match.utcDate, tz, language),
		dateLabel: formatUserDate(match.utcDate, tz, language),
		kickoffUtcMs: parseUtcDate(match.utcDate)?.getTime() ?? 0,
	};
}

/** Пуск прошёл, но провайдер ещё не обновил статус (SCHEDULED/TIMED). */
export function isExternalMatchAwaitingLiveSync(
	matchStatus: string,
	kickoffUtcMs: number
): boolean {
	return kickoffUtcMs > 0 && Date.now() >= kickoffUtcMs && isMatchNotStarted(matchStatus);
}
