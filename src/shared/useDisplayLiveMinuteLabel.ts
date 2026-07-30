import { useEffect, useState } from 'react';
import { isLiveMatchStatus } from '../features/match-results/externalMatchScoreView';
import { isMatchNotStarted } from '../features/match-results/matchStatusI18n';
import { getEstimatedMatchMinute } from './estimatedMatchMinute';
import { useSyncedLiveMinuteLabel } from './useSyncedLiveMinuteLabel';

const ESTIMATE_TICK_MS = 30_000;

function isMatchStarted(
	matchStatus: string,
	kickoffUtcMs: number,
	finalized: boolean
): boolean {
	if (finalized) {
		return false;
	}
	if (isLiveMatchStatus(matchStatus)) {
		return true;
	}
	if (kickoffUtcMs > 0 && Date.now() >= kickoffUtcMs && !isMatchNotStarted(matchStatus)) {
		return true;
	}
	return kickoffUtcMs > 0 && Date.now() >= kickoffUtcMs;
}

/**
 * Минута для карточки матча: якорь из БД + клиентская интерполяция,
 * до первого LIVE-sync — оценка по kickoff.
 */
export function useDisplayLiveMinuteLabel(
	liveMinuteLabel: string | null | undefined,
	fetchedAt: string | null | undefined,
	matchStatus: string,
	kickoffUtcMs: number,
	finalized = false
): string | null {
	const synced = useSyncedLiveMinuteLabel(liveMinuteLabel, fetchedAt, matchStatus);
	const [nowMs, setNowMs] = useState(() => Date.now());
	const started = isMatchStarted(matchStatus, kickoffUtcMs, finalized);

	useEffect(() => {
		if (!started || synced) {
			return;
		}
		const intervalId = window.setInterval(() => setNowMs(Date.now()), ESTIMATE_TICK_MS);
		return () => window.clearInterval(intervalId);
	}, [started, synced]);

	if (!started) {
		return null;
	}
	if (synced) {
		return synced;
	}
	if (kickoffUtcMs <= 0) {
		return null;
	}
	const estimate = getEstimatedMatchMinute(kickoffUtcMs, nowMs);
	if (estimate.kind === 'minute') {
		return estimate.label;
	}
	if (estimate.kind === 'halftime') {
		return 'HT';
	}
	return null;
}
