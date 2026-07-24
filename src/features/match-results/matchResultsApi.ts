/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { apiFetch } from '../../shared/apiClient';
import { ExternalCompetitionInfo, ExternalMatchdayPage } from './types/ExternalMatch';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

/** Метаданные турнира (текущий тур, число туров). */
export async function getCompetitionInfo(
	competitionCode: string,
	season: string
): Promise<ExternalCompetitionInfo> {
	const params = new URLSearchParams({ season });
	const result = await apiFetch(
		apiUrl(`/api/match-results/competitions/${competitionCode}?${params}`)
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

/** Только чтение из MongoDB (без запроса к внешним API). */
export async function getMatchdayFromCache(
	competitionCode: string,
	matchday: number,
	season: string,
	leagueId?: string
): Promise<ExternalMatchdayPage> {
	const params = new URLSearchParams({ season });
	if (leagueId) {
		params.set('leagueId', leagueId);
	}
	const result = await apiFetch(
		apiUrl(`/api/match-results/competitions/${competitionCode}/matchdays/${matchday}?${params}`)
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getLeagueExternalCompetitionInfo(
	leagueId: string,
	season: string
): Promise<ExternalCompetitionInfo> {
	const params = new URLSearchParams({ season });
	const result = await apiFetch(
		apiUrl(`/api/leagues/${leagueId}/external-competition-info?${params}`)
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
