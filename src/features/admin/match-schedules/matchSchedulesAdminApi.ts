/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { apiFetch } from '../../../shared/apiClient';

function apiUrl(path: string): string {
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		return path;
	}
	return `${import.meta.env.VITE_PRODUCT_SERVER}${path}`;
}

export interface MatchSchedulesMigrationResult {
	seasonId: string;
	leagueCode: string;
	sourceSeasonYear: string;
	matchesRead: number;
	matchesUpserted: number;
	matchesSkipped: number;
	errors: number;
}

export interface MatchScheduleBetsLinkResult {
	seasonId: string;
	leagueCode: string;
	schedulesProcessed: number;
	betsLinked: number;
	errors: number;
}

function buildQs(params?: { seasonId?: string; leagueCode?: string }): string {
	const search = new URLSearchParams();
	if (params?.seasonId) {
		search.set('seasonId', params.seasonId);
	}
	if (params?.leagueCode) {
		search.set('leagueCode', params.leagueCode);
	}
	const qs = search.toString();
	return qs ? `?${qs}` : '';
}

export async function migrateGameResultsToMatchSchedules(params?: {
	seasonId?: string;
	leagueCode?: string;
}): Promise<MatchSchedulesMigrationResult> {
	const result = await apiFetch(
		apiUrl(`/api/admin/match-schedules/migrate-from-game-results${buildQs(params)}`),
		{ method: 'POST' }
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function linkBetsToMatchSchedules(params?: {
	seasonId?: string;
	leagueCode?: string;
}): Promise<MatchScheduleBetsLinkResult> {
	const result = await apiFetch(
		apiUrl(`/api/admin/match-schedules/link-bets${buildQs(params)}`),
		{ method: 'POST' }
	);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
