export const VERSION_CHECK_INTERVAL_MS = 60 * 1000;
const RELOAD_ATTEMPT_PREFIX = 'appReloadAttempt:';

export type VersionPayload = {
	buildId: string | null;
};

export function parseBuildId(value: string): number | null {
	if (/^\d+$/.test(value)) {
		const numeric = Number(value);
		return Number.isFinite(numeric) ? numeric : null;
	}
	if (/^[0-9a-z]+$/i.test(value)) {
		const legacy = parseInt(value, 36);
		return Number.isFinite(legacy) && legacy > 0 ? legacy : null;
	}
	return null;
}

export function pickNewestBuildId(...ids: Array<string | null | undefined>): string | null {
	let bestId: string | null = null;
	let bestNum = -1;
	for (const id of ids) {
		if (!id) {
			continue;
		}
		const num = parseBuildId(id);
		if (num == null) {
			continue;
		}
		if (num > bestNum) {
			bestNum = num;
			bestId = id;
		}
	}
	return bestId;
}

export function shouldReload(localId: string, remoteId: string): boolean {
	if (!remoteId || localId === remoteId) {
		return false;
	}
	const localNum = parseBuildId(localId);
	const remoteNum = parseBuildId(remoteId);
	if (localNum == null || remoteNum == null) {
		return localId !== remoteId;
	}
	return localNum < remoteNum;
}

export function shouldRegisterLocal(localId: string, remoteId: string | null): boolean {
	if (!remoteId) {
		return true;
	}
	const localNum = parseBuildId(localId);
	const remoteNum = parseBuildId(remoteId);
	if (localNum == null || remoteNum == null) {
		return localId !== remoteId;
	}
	return localNum > remoteNum;
}

function reloadAttemptKey(localBuildId: string): string {
	return `${RELOAD_ATTEMPT_PREFIX}${localBuildId}`;
}

export function clearReloadAttempt(localBuildId: string): void {
	try {
		sessionStorage.removeItem(reloadAttemptKey(localBuildId));
	} catch {
		// ignore
	}
}

export function reloadForBuildId(remoteBuildId: string, localBuildId: string): void {
	try {
		const key = reloadAttemptKey(localBuildId);
		if (sessionStorage.getItem(key) === remoteBuildId) {
			const url = new URL(window.location.href);
			url.searchParams.set('_v', remoteBuildId);
			window.location.replace(url.toString());
			return;
		}
		sessionStorage.setItem(key, remoteBuildId);
	} catch {
		// sessionStorage может быть недоступен — всё равно пробуем reload
	}
	window.location.reload();
}

export function staticVersionUrl(): string {
	if (typeof window !== 'undefined' && window.location?.origin) {
		return `${window.location.origin}/version.json`;
	}
	return '/version.json';
}

export function clientVersionUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function fetchJsonBuildId(
	url: string,
	fetchFn: typeof fetch = fetch
): Promise<string | null> {
	try {
		const response = await fetchFn(url, { cache: 'no-store' });
		if (!response.ok) {
			return null;
		}
		const data = (await response.json()) as VersionPayload;
		return typeof data.buildId === 'string' && data.buildId ? data.buildId : null;
	} catch {
		return null;
	}
}

export async function fetchStaticBuildId(fetchFn: typeof fetch = fetch): Promise<string | null> {
	const url = `${staticVersionUrl()}?t=${Date.now()}`;
	return fetchJsonBuildId(url, fetchFn);
}

export async function fetchApiBuildId(fetchFn: typeof fetch = fetch): Promise<string | null> {
	return fetchJsonBuildId(clientVersionUrl('/api/client-version'), fetchFn);
}

export async function registerBuildId(
	buildId: string,
	fetchFn: typeof fetch = fetch
): Promise<string | null> {
	try {
		const response = await fetchFn(clientVersionUrl('/api/client-version/register'), {
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

export type VersionCheckOutcome =
	| { type: 'noop' }
	| { type: 'register'; buildId: string }
	| { type: 'reload'; remoteBuildId: string };

export function resolveVersionCheckOutcome(
	localId: string,
	staticId: string | null,
	apiId: string | null,
	registeredId: string | null
): VersionCheckOutcome {
	const remoteId = pickNewestBuildId(staticId, apiId, registeredId);
	if (!remoteId) {
		return { type: 'register', buildId: localId };
	}
	if (remoteId === localId) {
		return { type: 'noop' };
	}
	if (shouldRegisterLocal(localId, remoteId)) {
		return { type: 'register', buildId: localId };
	}
	if (shouldReload(localId, remoteId)) {
		return { type: 'reload', remoteBuildId: remoteId };
	}
	return { type: 'noop' };
}
