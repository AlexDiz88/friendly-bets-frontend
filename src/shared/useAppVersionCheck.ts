import { useEffect, useRef } from 'react';
import { apiFetch } from './apiClient';
import {
	VERSION_CHECK_INTERVAL_MS,
	clearReloadAttempt,
	fetchApiBuildId,
	reloadForBuildId,
	shouldReload,
} from './appVersionCheckLogic';

const apiFetchAdapter: typeof fetch = (input, init) => apiFetch(input, init);

/**
 * В production сверяет вшитый buildId с /api/client-version (единственный источник правды).
 * Проверка сразу при возврате на вкладку, затем каждые 5 минут пока вкладка видима.
 */
export function useAppVersionCheck(): void {
	const checkingRef = useRef(false);

	useEffect(() => {
		if (!import.meta.env.PROD) {
			return;
		}

		const localId = import.meta.env.VITE_APP_BUILD_ID;
		if (!localId) {
			return;
		}

		const check = async (): Promise<void> => {
			if (checkingRef.current) {
				return;
			}
			checkingRef.current = true;
			try {
				const remoteId = await fetchApiBuildId(apiFetchAdapter);
				if (shouldReload(localId, remoteId)) {
					reloadForBuildId(remoteId!, localId);
					return;
				}
				clearReloadAttempt(localId);
			} finally {
				checkingRef.current = false;
			}
		};

		const onWake = (): void => {
			if (document.visibilityState === 'visible') {
				void check();
			}
		};

		void check();
		const intervalId = window.setInterval(() => {
			if (document.visibilityState === 'hidden') {
				return;
			}
			void check();
		}, VERSION_CHECK_INTERVAL_MS);

		document.addEventListener('visibilitychange', onWake);
		window.addEventListener('focus', onWake);
		window.addEventListener('pageshow', onWake);

		return () => {
			window.clearInterval(intervalId);
			document.removeEventListener('visibilitychange', onWake);
			window.removeEventListener('focus', onWake);
			window.removeEventListener('pageshow', onWake);
		};
	}, []);
}
