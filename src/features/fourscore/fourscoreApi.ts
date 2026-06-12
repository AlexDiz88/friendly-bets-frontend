import { apiFetch } from '../../shared/apiClient';

function apiUrl(path: string): string {
	const isLocalhost =
		window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	return isLocalhost ? path : `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type FourScorePreviewMatch = {
	section: string;
	eventSlug: string;
	eventPath: string;
	homeTeamName: string;
	awayTeamName: string;
	statusText: string;
	listHomeScore: number | null;
	listAwayScore: number | null;
	homeTeamTitle: string | null;
	awayTeamTitle: string | null;
	homeMapped: boolean;
	awayMapped: boolean;
	firstHalfScore: string | null;
	secondHalfScore: string | null;
	extraTimeScore: string | null;
	penaltyScore: string | null;
	fullTimeScore: string | null;
	detailsLoaded: boolean;
	detailsError: string | null;
	fetchedAt: string;
};

export async function fetchFourScorePreview(date: string): Promise<FourScorePreviewMatch[]> {
	const result = await apiFetch(apiUrl(`/api/admin/fourscore/preview?date=${encodeURIComponent(date)}`));
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function syncFourScoreMatchday(
	leagueCode: string,
	matchday: number,
	season: string,
	leagueId?: string
): Promise<number> {
	const params = new URLSearchParams({ season });
	if (leagueId) {
		params.set('leagueId', leagueId);
	}
	const result = await apiFetch(
		apiUrl(`/api/admin/fourscore/sync/${encodeURIComponent(leagueCode)}/matchdays/${matchday}?${params}`),
		{ method: 'POST' }
	);
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
