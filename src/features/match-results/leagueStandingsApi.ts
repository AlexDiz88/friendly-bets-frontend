import { apiFetch } from '../../shared/apiClient';
import type { LeagueStandingsPage } from './types/LeagueStandings';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function fetchLeagueStandings(
	leagueCode: string,
	season: string,
	leagueId?: string
): Promise<LeagueStandingsPage> {
	const params = new URLSearchParams({ season });
	if (leagueId) {
		params.set('leagueId', leagueId);
	}
	const result = await apiFetch(
		apiUrl(`/api/match-results/competitions/${leagueCode}/standings?${params}`)
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return (await result.json()) as LeagueStandingsPage;
}
