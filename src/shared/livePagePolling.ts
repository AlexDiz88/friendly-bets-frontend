import { isLiveMatchStatus } from '../features/match-results/externalMatchScoreView';
import { isExternalMatchAwaitingLiveSync } from '../features/match-results/externalMatchKickoff';
import { isFinishedAwaitingFullMatch } from '../features/match-results/matchStatusI18n';

/**
 * Интервал опроса нашего API (MongoDB) на страницах с live-матчами.
 * Нужен, чтобы при открытой вкладке подтягивались счёт и статус после завершения игр.
 * Sync с 4score/24score на бэкенде — ~5 мин (якорь минуты); между sync +1/мин на клиенте.
 */
export const LIVE_PAGE_POLL_INTERVAL_MS = 60_000;

export type LivePollMatch = {
	status?: string | null;
	finalized?: boolean;
	liveMinuteLabel?: string | null;
	/** Kickoff UTC (ms); для ЧМ26 — из расписания venue-local. */
	kickoffUtcMs?: number;
};

/** Нужен фоновый опрос для одного матча. */
export function matchNeedsLivePoll(match: LivePollMatch): boolean {
	if (match.finalized) {
		return false;
	}
	if (isLiveMatchStatus(match.status ?? '')) {
		return true;
	}
	if (isFinishedAwaitingFullMatch(match.status ?? '')) {
		return true;
	}
	if (match.liveMinuteLabel?.trim()) {
		return true;
	}
	return isExternalMatchAwaitingLiveSync(match.status ?? '', match.kickoffUtcMs ?? 0);
}

/** Нужен фоновый опрос, пока на странице есть не финализированные live-матчи. */
export function pageHasLiveMatches(matches: LivePollMatch[]): boolean {
	return matches.some(matchNeedsLivePoll);
}
