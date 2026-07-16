import { useEffect, useRef } from 'react';

const CHECK_INTERVAL_MS = 5 * 60 * 1000;
const RELOAD_STORAGE_KEY = 'appReloadForBuildId';

type VersionPayload = {
	buildId: string;
};

async function fetchRemoteBuildId(): Promise<string | null> {
	try {
		const response = await fetch(`${import.meta.env.BASE_URL}version.json`, {
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

/**
 * В production сверяет вшитый buildId с version.json на хостинге.
 * При расхождении — один принудительный reload (защита от цикла через sessionStorage).
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
				const remoteId = await fetchRemoteBuildId();
				if (remoteId && remoteId !== localId) {
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
