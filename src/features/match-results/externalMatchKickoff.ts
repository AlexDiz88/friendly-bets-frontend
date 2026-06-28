import { parseUtcDate } from '../../shared/utcDate';
import {
	findWc26ScheduleMatchForExternal,
	getWc26ScheduleById,
	utcToBerlinKickoff,
} from '../world-cup-2026/wc26BetSlots';
import {
	berlinKickoffToUtcMs,
	formatBerlinDateFromIsoDate,
	formatBerlinDateFromUtc,
} from '../world-cup-2026/wc26Time';
import { isMatchNotStarted } from './matchStatusI18n';
import type { ExternalMatch } from './types/ExternalMatch';

export interface ExternalMatchBerlinKickoff {
	kickoff: string;
	dateLabel: string;
	kickoffUtcMs: number;
}

function resolveFromWc26Schedule(
	match: ExternalMatch,
	slotId?: string,
	language?: string
): ExternalMatchBerlinKickoff | null {
	const scheduled =
		(match.wc26ScheduleId != null ? getWc26ScheduleById(match.wc26ScheduleId) : undefined) ??
		findWc26ScheduleMatchForExternal(match, slotId);
	if (!scheduled) {
		return null;
	}
	return {
		kickoff: scheduled.timeLocal,
		dateLabel: formatBerlinDateFromIsoDate(scheduled.date, language ?? 'ru'),
		kickoffUtcMs: berlinKickoffToUtcMs(scheduled.date, scheduled.timeLocal),
	};
}

/** Kickoff UTC (ms): для ЧМ — из wc26_schedule (Berlin для плей-офф), иначе utcDate API. */
export function resolveExternalMatchKickoffUtcMs(
	match: ExternalMatch,
	slotId?: string
): number {
	const fromSchedule = resolveFromWc26Schedule(match, slotId);
	if (fromSchedule) {
		return fromSchedule.kickoffUtcMs;
	}
	return parseUtcDate(match.utcDate)?.getTime() ?? 0;
}

/** Время/дата по Berlin для карточки результатов. */
export function resolveExternalMatchBerlinKickoff(
	match: ExternalMatch,
	slotId?: string,
	language?: string
): ExternalMatchBerlinKickoff {
	const fromSchedule = resolveFromWc26Schedule(match, slotId, language);
	if (fromSchedule) {
		return fromSchedule;
	}
	return {
		kickoff: utcToBerlinKickoff(match.utcDate),
		dateLabel: formatBerlinDateFromUtc(match.utcDate, language ?? 'ru'),
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
