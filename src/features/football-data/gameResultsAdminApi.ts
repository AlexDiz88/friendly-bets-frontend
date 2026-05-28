import { apiFetch } from '../../shared/apiClient';
import GameScore from '../bets/types/GameScore';
import { ExternalMatch } from './types/ExternalMatch';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export interface AdminCorrectGameScoreBody {
	fullTime: string;
	firstTime?: string | null;
	overTime?: string | null;
	penalty?: string | null;
}

export interface MatchdaySettleResult {
	matchesSubmitted: number;
	betsProcessed: number;
	gameweekStatsRecalculated: boolean;
}

export async function adminCorrectGameResultScore(
	gameResultId: string,
	body: AdminCorrectGameScoreBody
): Promise<ExternalMatch> {
	const result = await apiFetch(apiUrl(`/api/admin/game-results/${gameResultId}/admin-score`), {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function settleMatchdayAndRecalculateStats(body: {
	seasonId: string;
	leagueCode: string;
	matchday: number;
	externalSeason?: string;
}): Promise<MatchdaySettleResult> {
	const result = await apiFetch(apiUrl('/api/admin/game-results/matchdays/settle-and-recalculate'), {
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

export function gameScoreToAdminBody(score: GameScore): AdminCorrectGameScoreBody {
	return {
		fullTime: score.fullTime ?? '',
		firstTime: score.firstTime,
		overTime: score.overTime,
		penalty: score.penalty,
	};
}
