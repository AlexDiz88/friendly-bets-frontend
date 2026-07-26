import { apiFetch } from '../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export interface MatchdaySettleResult {
	matchesSubmitted: number;
	betsProcessed: number;
	gameweekStatsRecalculated: boolean;
}

export async function settleMatchdayAndRecalculateStats(body: {
	seasonId: string;
	leagueCode: string;
	matchday: number;
	externalSeason?: string;
}): Promise<MatchdaySettleResult> {
	const result = await apiFetch(apiUrl('/api/admin/match-schedules/matchdays/settle-and-recalculate'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
