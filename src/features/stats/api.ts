/* eslint-disable @typescript-eslint/restrict-template-expressions */
import LeagueStats from './types/LeagueStats';
import PlayerStats from './types/PlayerStats';
import PlayerStatsByTeams from './types/PlayerStatsByTeams';

export async function getAllPlayersStatsBySeason(
	seasonId: string
): Promise<{ playersStats: PlayerStats[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/stats/season/${seasonId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/stats/season/${seasonId}`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getAllPlayersStatsByLeagues(
	seasonId: string
): Promise<{ playersStatsByLeagues: LeagueStats[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/stats/season/${seasonId}/leagues`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/stats/season/${seasonId}/leagues`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getAllStatsByTeamsInSeason(
	seasonId: string
): Promise<{ playersStatsByTeams: PlayerStatsByTeams[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/stats/season/${seasonId}/teams`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/stats/season/${seasonId}/teams`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getStatsByTeams(
	seasonId: string,
	leagueId: string,
	userId: string
): Promise<{ statsByTeams: PlayerStatsByTeams }> {
	let url = `${
		import.meta.env.VITE_PRODUCT_SERVER
	}/api/stats/season/${seasonId}/league/${leagueId}/user/${userId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/stats/season/${seasonId}/league/${leagueId}/user/${userId}`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function playersStatsFullRecalculation(
	seasonId: string
): Promise<{ playersStats: PlayerStats[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/stats/season/${seasonId}/recalculation`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/stats/season/${seasonId}/recalculation`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

// TODO: сделать позже - статистика игрока за все сезоны
export async function getAllPlayersStats(): Promise<{
	playersStats: PlayerStats[];
}> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER}/api/my/bets`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/my/bets';
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
