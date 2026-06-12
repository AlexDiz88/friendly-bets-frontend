import { useEffect, useState } from 'react';
import { normalizeMatchStatus } from '../features/football-data/matchStatusI18n';
import { extrapolateLiveMinuteLabel } from './liveMinuteLabel';

const LIVE_MINUTE_TICK_MS = 30_000;

export function useExtrapolatedLiveMinuteLabel(
	liveMinuteLabel: string | null | undefined,
	fetchedAt: string | null | undefined,
	matchStatus: string
): string | null {
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		if (!liveMinuteLabel || normalizeMatchStatus(matchStatus) !== 'IN_PLAY') {
			return;
		}
		const tick = (): void => setNow(Date.now());
		tick();
		const intervalId = window.setInterval(tick, LIVE_MINUTE_TICK_MS);
		return () => window.clearInterval(intervalId);
	}, [liveMinuteLabel, fetchedAt, matchStatus]);

	if (!liveMinuteLabel || normalizeMatchStatus(matchStatus) !== 'IN_PLAY') {
		return liveMinuteLabel ?? null;
	}

	const fetchedAtMs = fetchedAt ? Date.parse(fetchedAt) : null;
	return extrapolateLiveMinuteLabel(liveMinuteLabel, fetchedAtMs, now);
}
