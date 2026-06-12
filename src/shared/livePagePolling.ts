import { isLiveMatchStatus } from '../features/football-data/externalMatchScoreView';

export const LIVE_PAGE_POLL_INTERVAL_MS = 45_000;

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
