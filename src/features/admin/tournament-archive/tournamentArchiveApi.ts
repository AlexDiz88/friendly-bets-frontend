import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export interface TournamentArchiveImportResult {
	editionCode: string;
	id?: string;
	matches?: unknown[];
	bracket?: unknown[];
	groupStandings?: unknown[];
	bestThirdPlaces?: unknown[];
	unresolvedTeams?: string[];
	importedAt?: string;
}

/** Импорт review-JSON с диска сервера (backend/data/tournament-archive-*.json). */
export async function importTournamentArchiveFromFile(
	editionCode = 'WC_2026'
): Promise<TournamentArchiveImportResult> {
	const params = new URLSearchParams({ editionCode });
	const result = await apiFetch(apiUrl(`/api/admin/tournament-archives/import-file?${params}`), {
		method: 'POST',
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
