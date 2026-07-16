import { useEffect, useRef } from 'react';
import { apiFetch } from './apiClient';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const RELOAD_STORAGE_KEY = 'appReloadForBuildId';

type VersionPayload = {
	buildId: string | null;
};

function clientVersionUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

async function fetchRemoteBuildId(): Promise<string | null> {
	try {
		const response = await apiFetch(clientVersionUrl('/api/client-version'), {
			cache: 'no-store',
		});
		if (!response.ok) {
			return null;
		}
		const data = (await response.json()) as VersionPayload;
		return typeof data.buildId === 'string' && data.buildId ? data.buildId : null;
	} catch {
		return null;
	}
}

async function registerBuildId(buildId: string): Promise<string | null> {
	try {
		const response = await apiFetch(clientVersionUrl('/api/client-version/register'), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			cache: 'no-store',
			body: JSON.stringify({ buildId }),
		});
		if (!response.ok) {
			return null;
		}
		const data = (await response.json()) as VersionPayload;
		return typeof data.buildId === 'string' && data.buildId ? data.buildId : null;
	} catch {
		return null;
	}
}

function reloadForBuildId(remoteBuildId: string): void {
	try {
		if (sessionStorage.getItem(RELOAD_STORAGE_KEY) === remoteBuildId) {
			return;
		}
		sessionStorage.setItem(RELOAD_STORAGE_KEY, remoteBuildId);
	} catch {
		// sessionStorage может быть недоступен — всё равно пробуем один reload
	}
	window.location.reload();
}

function parseBuildId(value: string): number | null {
	if (!/^\d+$/.test(value)) {
		return null;
	}
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}

/**
 * В production сверяет вшитый buildId с /api/client-version (бэкенд, без CDN static).
 * Более новый клиент регистрирует версию; более старый — один принудительный reload.
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

		const localNum = parseBuildId(localId);
		if (localNum == null) {
			return;
		}

		const check = async (): Promise<void> => {
			if (checkingRef.current) {
				return;
			}
			checkingRef.current = true;
			try {
				const remoteId = await fetchRemoteBuildId();
				if (!remoteId) {
					await registerBuildId(localId);
					return;
				}

				if (remoteId === localId) {
					return;
				}

				const remoteNum = parseBuildId(remoteId);
				if (remoteNum == null) {
					await registerBuildId(localId);
					return;
				}

				if (localNum > remoteNum) {
					await registerBuildId(localId);
					return;
				}

				if (localNum < remoteNum) {
					reloadForBuildId(remoteId);
				}
			} finally {
				checkingRef.current = false;
			}
		};

		const onVisibility = (): void => {
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
		}, CHECK_INTERVAL_MS);

		document.addEventListener('visibilitychange', onVisibility);

		return () => {
			window.clearInterval(intervalId);
			document.removeEventListener('visibilitychange', onVisibility);
		};
	}, []);
}
