import { apiFetch } from '../../shared/apiClient';
import { OddsDemoDebugDetail, OddsDemoEventDetail, OddsDemoEventSummary } from './types';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

async function throwIfError(result: Response): Promise<void> {
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}

export type OddsDemoEventId = {
	id: number;
	home: string;
	away: string;
	date: string;
	status: string;
};

export type OddsDemoClearResult = {
	deletedCount: number;
};

export type OddsDemoRefreshResult = {
	leagueSlug: string;
	eventsStored: number;
	bookmakers?: string[];
};

export async function listOddsDemoEvents(leagueSlug: string): Promise<OddsDemoEventSummary[]> {
	const result = await apiFetch(apiUrl(`/api/odds/demo/leagues/${encodeURIComponent(leagueSlug)}/events`));
	await throwIfError(result);
	return result.json();
}

export async function listOddsDemoApiEvents(
	leagueSlug: string,
	limit?: number
): Promise<OddsDemoEventId[]> {
	const params = limit != null ? `?limit=${limit}` : '';
	const result = await apiFetch(
		apiUrl(`/api/odds/demo/leagues/${encodeURIComponent(leagueSlug)}/api-events${params}`)
	);
	await throwIfError(result);
	return result.json();
}

export async function getOddsDemoEvent(eventId: number): Promise<OddsDemoEventDetail> {
	const result = await apiFetch(apiUrl(`/api/odds/demo/events/${eventId}`));
	await throwIfError(result);
	return result.json();
}

export async function getOddsDemoEventDebug(eventId: number): Promise<OddsDemoDebugDetail> {
	const result = await apiFetch(apiUrl(`/api/odds/demo/events/${eventId}/debug`));
	await throwIfError(result);
	return result.json();
}

export async function refreshOddsDemoLeague(
	leagueSlug: string,
	limit?: number
): Promise<OddsDemoRefreshResult> {
	const params = limit != null ? `?limit=${limit}` : '';
	const result = await apiFetch(
		apiUrl(`/api/odds/demo/leagues/${encodeURIComponent(leagueSlug)}/refresh${params}`),
		{ method: 'POST' }
	);
	await throwIfError(result);
	return result.json();
}

export async function refreshOddsDemoEvents(
	leagueSlug: string,
	eventIds: number[]
): Promise<OddsDemoRefreshResult> {
	const result = await apiFetch(apiUrl('/api/odds/demo/events/refresh'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ leagueSlug, eventIds }),
	});
	await throwIfError(result);
	return result.json();
}

export async function deleteOddsDemoEvent(eventId: number): Promise<OddsDemoClearResult> {
	const result = await apiFetch(apiUrl(`/api/odds/demo/events/${eventId}`), { method: 'DELETE' });
	await throwIfError(result);
	return result.json();
}

export async function clearOddsDemoLeague(leagueSlug: string): Promise<OddsDemoClearResult> {
	const result = await apiFetch(
		apiUrl(`/api/odds/demo/leagues/${encodeURIComponent(leagueSlug)}`),
		{ method: 'DELETE' }
	);
	await throwIfError(result);
	return result.json();
}

export async function clearAllOddsDemo(): Promise<OddsDemoClearResult> {
	const result = await apiFetch(apiUrl('/api/odds/demo/all'), { method: 'DELETE' });
	await throwIfError(result);
	return result.json();
}

export function appendEventIdToInput(current: string, id: number): string {
	const ids = parseEventIdsInput(current);
	if (ids.includes(id)) {
		return ids.join(', ');
	}
	if (!current.trim()) {
		return String(id);
	}
	return `${current.trim().replace(/,\s*$/, '')}, ${id}`;
}

export function parseEventIdsInput(raw: string): number[] {
	return raw
		.split(/[\s,;]+/)
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => Number.parseInt(part, 10))
		.filter((id) => Number.isFinite(id) && id > 0);
}
