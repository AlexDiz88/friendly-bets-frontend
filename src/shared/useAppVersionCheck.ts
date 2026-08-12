import { useEffect, useRef } from 'react';
import { apiFetch } from './apiClient';
import {
	VERSION_CHECK_INTERVAL_MS,
	clearReloadAttempt,
	fetchApiBuildId,
	fetchStaticBuildId,
	registerBuildId,
	reloadForBuildId,
	resolveVersionCheckOutcome,
} from './appVersionCheckLogic';

const apiFetchAdapter: typeof fetch = (input, init) => apiFetch(input, init);

/**
 * В production сверяет вшитый buildId с version.json (статика, сразу после деплоя)
 * и /api/client-version (бэкенд). Более новый клиент регистрирует версию;
 * более старый — принудительный reload.
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
				const [staticId, apiId] = await Promise.all([
					fetchStaticBuildId(),
					fetchApiBuildId(apiFetchAdapter),
				]);

				let outcome = resolveVersionCheckOutcome(localId, staticId, apiId, null);
				if (outcome.type === 'register') {
					const registeredId = await registerBuildId(outcome.buildId, apiFetchAdapter);
					outcome = resolveVersionCheckOutcome(localId, staticId, apiId, registeredId);
				}

				if (outcome.type === 'register') {
					await registerBuildId(outcome.buildId, apiFetchAdapter);
					return;
				}
				if (outcome.type === 'reload') {
					reloadForBuildId(outcome.remoteBuildId, localId);
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

		return () => {
			window.clearInterval(intervalId);
			document.removeEventListener('visibilitychange', onWake);
			window.removeEventListener('focus', onWake);
		};
	}, []);
}
