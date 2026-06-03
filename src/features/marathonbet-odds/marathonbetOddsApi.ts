import { apiFetch } from '../../shared/apiClient';

function apiUrl(path: string): string {
	const isLocalhost =
		window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	return isLocalhost ? path : `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type MarathonbetMarketSelection = {
	name: string;
	odds: number | null;
};

export type MarathonbetMarket = {
	model: string;
	name: string;
	selections: MarathonbetMarketSelection[];
};

export type MarathonbetScrapeResult = {
	treeId: number;
	eventId: number | null;
	eventName: string | null;
	competitionHeader: string | null;
	homeTeam: string | null;
	awayTeam: string | null;
	startTime: string | null;
	sourceUrl: string | null;
	fetchedAt: string;
	matchResultMarkets: MarathonbetMarket[];
	handicapMarkets: MarathonbetMarket[];
	warnings: string[];
};

export async function scrapeMarathonbetEvent(treeId: number): Promise<MarathonbetScrapeResult> {
	const result = await apiFetch(apiUrl(`/api/marathonbet/scrape/events/${treeId}`), {
		method: 'GET',
		credentials: 'include',
	});
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
