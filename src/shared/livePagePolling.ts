import { isLiveMatchStatus } from '../features/match-results/externalMatchScoreView';

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
};

/** Нужен фоновый опрос, пока на странице есть не финализированные live-матчи. */
export function pageHasLiveMatches(matches: LivePollMatch[]): boolean {
	return matches.some((m) => {
		if (m.finalized) {
			return false;
		}
		if (isLiveMatchStatus(m.status ?? '')) {
			return true;
		}
		return Boolean(m.liveMinuteLabel);
	});
}
