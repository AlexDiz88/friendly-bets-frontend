import { apiFetch } from '../../shared/apiClient';

function apiUrl(path: string): string {
	const isLocalhost =
		window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	return isLocalhost ? path : `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export type MarathonbetMarketSelection = {
	selId?: number | null;
	name: string;
	odds: number | null;
};

export type MarathonbetMarket = {
	marketId?: number | null;
	model: string;
	name: string;
	selections: MarathonbetMarketSelection[];
	/** Не попадает в prod-merge (напр. «… (3 исхода)»). */
	ignoredForProd?: boolean;
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
	totalMarkets?: MarathonbetMarket[];
	correctScoreMarkets?: MarathonbetMarket[];
	doubleChanceMarkets?: MarathonbetMarket[];
	warnings: string[];
};

export type MarathonbetSlotMatchPreview = {
	gameResultId: string;
	matchday: number;
	homeTeamTitle: string | null;
	awayTeamTitle: string | null;
	utcDate: string | null;
	marathonbetTreeId: number | null;
	marathonHomeTeam: string | null;
	marathonAwayTeam: string | null;
	marathonDisplayTimeMillis: number | null;
	matchStatus: string | null;
	mappingOk: boolean;
	mappingNote: string | null;
};

export type MarathonbetSlotPreview = {
	leagueId: string;
	leagueCode: string;
	season: string;
	matchday: number;
	tournamentTreeId: number;
	matches: MarathonbetSlotMatchPreview[];
};

export type MarathonbetSyncRun = {
	id: string;
	startedAt?: string;
	finishedAt?: string;
	leagueCode?: string;
	season?: string;
	slotOrders?: number[];
	tournamentFetched?: boolean;
	matchesEligible?: number;
	matchesMatched?: number;
	mergedSaved?: number;
	sseCalls?: number;
	mappingFailures?: number;
	manual?: boolean;
	errorSummary?: string | null;
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

export async function fetchMarathonbetSlotPreview(
	leagueId: string,
	matchday: number,
	season?: string
): Promise<MarathonbetSlotPreview> {
	const params = new URLSearchParams({ leagueId, matchday: String(matchday) });
	if (season) {
		params.set('season', season);
	}
	const result = await apiFetch(apiUrl(`/api/admin/marathonbet/slot-preview?${params}`), {
		credentials: 'include',
	});
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export type MarathonbetSlotSyncResult = {
	message: string;
	tournamentFetched: boolean;
	matchesEligible: number;
	matchesMatched: number;
	mergedSaved: number;
	sseCalls: number;
	mappingFailures: number;
	failedGameResultIds?: string[];
};

export async function syncMarathonbetSlot(
	leagueId: string,
	matchday: number,
	season?: string,
	gameResultIds?: string[]
): Promise<MarathonbetSlotSyncResult> {
	const params = new URLSearchParams({ leagueId, matchday: String(matchday) });
	if (season) {
		params.set('season', season);
	}
	if (gameResultIds?.length) {
		gameResultIds.forEach((id) => params.append('gameResultIds', id));
	}
	const result = await apiFetch(apiUrl(`/api/admin/marathonbet/sync-slot?${params}`), {
		method: 'POST',
		credentials: 'include',
	});
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function fetchLatestMarathonbetSyncRun(): Promise<MarathonbetSyncRun | null> {
	const result = await apiFetch(apiUrl('/api/admin/marathonbet/sync-runs/latest'), {
		credentials: 'include',
	});
	if (result.status === 204) {
		return null;
	}
	if (result.status >= 400) {
		const { message } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
