import { apiFetch } from '../../shared/apiClient';
import Bet from '../bets/types/Bet';
import {
	OddsEventMarkets,
	PlaceBetFromOddsRequest,
	Wc26BettingContext,
	Wc26GameResultLookup,
} from '../../components/odds/oddsTypes';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export async function getWc26BettingContext(): Promise<Wc26BettingContext> {
	const result = await apiFetch(apiUrl('/api/wc26/betting-context'));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function lookupWc26GameResult(
	seasonId: string,
	wc26ScheduleId: number,
	slotId: string
): Promise<Wc26GameResultLookup> {
	const params = new URLSearchParams({ seasonId, slotId });
	const result = await apiFetch(
		apiUrl(`/api/wc26/matches/${wc26ScheduleId}/game-result?${params}`)
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getOddsEventMarkets(gameResultId: string): Promise<OddsEventMarkets> {
	const result = await apiFetch(apiUrl(`/api/odds/events/${encodeURIComponent(gameResultId)}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function placeBetFromOdds(
	body: PlaceBetFromOddsRequest,
	idempotencyKey: string
): Promise<Bet> {
	const result = await apiFetch(apiUrl('/api/bets/self/place-from-odds'), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Idempotency-Key': idempotencyKey,
		},
		body: JSON.stringify(body),
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getSelfOpenedBets(
	seasonId: string,
	leagueId: string,
	matchDay?: string
): Promise<Bet[]> {
	const params = new URLSearchParams({ seasonId, leagueId });
	if (matchDay) {
		params.set('matchDay', matchDay);
	}
	const result = await apiFetch(apiUrl(`/api/bets/self/opened?${params}`));
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	const page: { bets: Bet[] } = await result.json();
	return page.bets ?? [];
}
