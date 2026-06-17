import { parseUtcDate } from '../../shared/utcDate';
import { findWc26ScheduleMatchForExternal } from '../world-cup-2026/wc26BetSlots';
import { venueLocalKickoffToUtcMs } from '../world-cup-2026/wc26Time';
import { isMatchNotStarted } from './matchStatusI18n';
import type { ExternalMatch } from './types/ExternalMatch';

/** Kickoff UTC (ms) для матча на странице результатов: расписание ЧМ26 приоритетнее utcDate API. */
export function resolveExternalMatchKickoffUtcMs(match: ExternalMatch, slotId?: string): number {
	const scheduled = findWc26ScheduleMatchForExternal(match, slotId);
	if (scheduled) {
		return venueLocalKickoffToUtcMs(scheduled.date, scheduled.timeLocal, scheduled.venueKey);
	}
	return parseUtcDate(match.utcDate)?.getTime() ?? 0;
}

/** Пуск прошёл, но провайдер ещё не обновил статус (SCHEDULED/TIMED). */
export function isExternalMatchAwaitingLiveSync(
	matchStatus: string,
	kickoffUtcMs: number
): boolean {
	return kickoffUtcMs > 0 && Date.now() >= kickoffUtcMs && isMatchNotStarted(matchStatus);
}
