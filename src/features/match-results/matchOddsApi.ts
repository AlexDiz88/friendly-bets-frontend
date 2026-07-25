import { apiFetch } from '../../shared/apiClient';
import { OddsEventMarkets } from '../../components/odds/oddsTypes';

function apiUrl(path: string): string {
	const isLocalhost =
		window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
	return isLocalhost ? path : `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getOddsEventMarkets(matchScheduleId: string): Promise<OddsEventMarkets> {
	const result = await apiFetch(apiUrl(`/api/odds/events/${encodeURIComponent(matchScheduleId)}`));
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
	failedMatchScheduleIds?: string[];
};

export async function syncMarathonbetSlot(
	leagueId: string,
	matchday: number,
	season?: string,
	matchScheduleIds?: string[]
): Promise<MarathonbetSlotSyncResult> {
	const params = new URLSearchParams({ leagueId, matchday: String(matchday) });
	if (season) {
		params.set('season', season);
	}
	if (matchScheduleIds?.length) {
		matchScheduleIds.forEach((id) => params.append('matchScheduleIds', id));
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
