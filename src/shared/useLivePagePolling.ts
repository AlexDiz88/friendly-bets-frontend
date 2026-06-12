import { useEffect, useRef } from 'react';
import { LIVE_PAGE_POLL_INTERVAL_MS } from './livePagePolling';

/**
 * Периодический опрос API, пока enabled (напр. есть live-матчи).
 * Не запускается в скрытой вкладке; при возврате — один немедленный poll.
 */
export function useLivePagePolling(
	enabled: boolean,
	onPoll: () => void | Promise<void>,
	intervalMs = LIVE_PAGE_POLL_INTERVAL_MS
): void {
	const onPollRef = useRef(onPoll);
	onPollRef.current = onPoll;

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const tick = (): void => {
			if (document.visibilityState === 'hidden') {
				return;
			}
			void onPollRef.current();
		};

		const onVisibility = (): void => {
			if (document.visibilityState === 'visible') {
				tick();
			}
		};

		const intervalId = window.setInterval(tick, intervalMs);
		document.addEventListener('visibilitychange', onVisibility);

		return () => {
			window.clearInterval(intervalId);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, [enabled, intervalMs]);
}
