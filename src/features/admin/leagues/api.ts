import { apiFetch } from '../../../shared/apiClient';
import League from './types/League';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export interface LeagueWithoutFormat {
	leagueId: string;
	leagueCode: string;
	leagueName: string;
	seasonId: string;
	seasonTitle: string;
}

export async function getLeaguesWithoutFormat(): Promise<{ leagues: LeagueWithoutFormat[] }> {
	const result = await apiFetch(apiUrl('/api/leagues/without-tournament-format'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function assignTournamentFormat(
	leagueId: string,
	tournamentFormatId: string
): Promise<League> {
	const result = await apiFetch(apiUrl(`/api/leagues/${leagueId}/tournament-format`), {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ tournamentFormatId }),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
