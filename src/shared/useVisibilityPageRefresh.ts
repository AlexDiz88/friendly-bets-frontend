import { useEffect, useRef } from 'react';

/**
 * Один тихий onRefresh при возврате на вкладку (visibility / bfcache).
 * Не включает loading и не зависит от статусов матчей на странице.
 */
export function useVisibilityPageRefresh(
	enabled: boolean,
	onRefresh: () => void | Promise<void>
): void {
	const onRefreshRef = useRef(onRefresh);
	onRefreshRef.current = onRefresh;

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const refresh = (): void => {
			if (document.visibilityState === 'visible') {
				void onRefreshRef.current();
			}
		};

		const onPageShow = (event: PageTransitionEvent): void => {
			if (event.persisted) {
				void onRefreshRef.current();
			}
		};

		document.addEventListener('visibilitychange', refresh);
		window.addEventListener('pageshow', onPageShow);

		return () => {
			document.removeEventListener('visibilitychange', refresh);
			window.removeEventListener('pageshow', onPageShow);
		};
	}, [enabled]);
}
