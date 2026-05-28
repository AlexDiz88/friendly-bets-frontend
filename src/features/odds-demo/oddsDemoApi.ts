import { apiFetch } from '../../shared/apiClient';
import { OddsDemoEventDetail, OddsDemoEventSummary } from './types';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function listOddsDemoEvents(leagueSlug: string): Promise<OddsDemoEventSummary[]> {
	const result = await apiFetch(apiUrl(`/api/odds/demo/leagues/${encodeURIComponent(leagueSlug)}/events`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getOddsDemoEvent(eventId: number): Promise<OddsDemoEventDetail> {
	const result = await apiFetch(apiUrl(`/api/odds/demo/events/${eventId}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function refreshOddsDemoLeague(leagueSlug: string, limit?: number): Promise<void> {
	const params = limit != null ? `?limit=${limit}` : '';
	const result = await apiFetch(
		apiUrl(`/api/odds/demo/leagues/${encodeURIComponent(leagueSlug)}/refresh${params}`),
		{ method: 'POST' }
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
}
