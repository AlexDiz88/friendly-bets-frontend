import { useEffect, useState } from 'react';
import {
	getEstimatedMatchMinute,
	type EstimatedMatchMinute,
} from './estimatedMatchMinute';

const LIVE_TICK_MS = 30_000;

export function useEstimatedMatchMinute(
	kickoffUtcMs: number | null | undefined
): EstimatedMatchMinute | null {
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		if (kickoffUtcMs == null) {
			return;
		}
		const tick = (): void => setNow(Date.now());
		tick();
		const intervalId = window.setInterval(tick, LIVE_TICK_MS);
		return () => window.clearInterval(intervalId);
	}, [kickoffUtcMs]);

	if (kickoffUtcMs == null) {
		return null;
	}
	return getEstimatedMatchMinute(kickoffUtcMs, now);
}
