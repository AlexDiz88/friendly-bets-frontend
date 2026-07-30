import { useEffect, useState } from 'react';
import { isLiveMatchStatus } from '../features/match-results/externalMatchScoreView';
import { isMatchBreakStatus, isMatchNotStarted, isPenaltyShootoutStatus } from '../features/match-results/matchStatusI18n';
import { getEstimatedMatchMinute } from './estimatedMatchMinute';
import { useSyncedLiveMinuteLabel } from './useSyncedLiveMinuteLabel';

const ESTIMATE_TICK_MS = 30_000;

export type DisplayLiveMinuteParams = {
	liveMinuteLabel?: string | null;
	fetchedAt?: string | null;
	matchStatus: string;
	kickoffUtcMs?: number;
	finalized?: boolean;
	leagueCode?: string | null;
	slotId?: string | null;
};

function isMatchStarted(params: DisplayLiveMinuteParams): boolean {
	if (params.finalized || isMatchBreakStatus(params.matchStatus) || isPenaltyShootoutStatus(params.matchStatus)) {
		return false;
	}
	if (isLiveMatchStatus(params.matchStatus)) {
		return true;
	}
	const kickoffUtcMs = params.kickoffUtcMs ?? 0;
	if (
		kickoffUtcMs > 0
		&& Date.now() >= kickoffUtcMs
		&& !isMatchNotStarted(params.matchStatus)
	) {
		return true;
	}
	return kickoffUtcMs > 0 && Date.now() >= kickoffUtcMs;
}

/**
 * Минута для карточки матча: якорь из БД + клиентская интерполяция,
 * до первого LIVE-sync — оценка по kickoff.
 */
export function useDisplayLiveMinuteLabel(params: DisplayLiveMinuteParams): string | null {
	const synced = useSyncedLiveMinuteLabel(
		params.liveMinuteLabel,
		params.fetchedAt,
		params.matchStatus
	);
	const [nowMs, setNowMs] = useState(() => Date.now());
	const started = isMatchStarted(params);

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
	const kickoffUtcMs = params.kickoffUtcMs ?? 0;
	if (kickoffUtcMs <= 0) {
		return null;
	}
	const estimate = getEstimatedMatchMinute(kickoffUtcMs, nowMs);
	if (estimate.kind === 'minute') {
		return estimate.label;
	}
	if (estimate.kind === 'halftime') {
		return null;
	}
	return null;
}
