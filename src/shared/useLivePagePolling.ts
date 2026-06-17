import { useEffect, useRef } from 'react';
import { LIVE_PAGE_POLL_INTERVAL_MS } from './livePagePolling';

/**
 * Периодический опрос нашего API, пока enabled (напр. есть live-матчи).
 * По умолчанию — раз в минуту (счёт, статус, liveMinuteLabel из БД).
 * Не запускается в скрытой вкладке. Возврат на вкладку — useVisibilityPageRefresh.
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

		const intervalId = window.setInterval(tick, intervalMs);

		return () => {
			window.clearInterval(intervalId);
		};
	}, [enabled, intervalMs]);
}
