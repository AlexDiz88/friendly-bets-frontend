import User from '../auth/types/User';
import LeagueStats from './types/LeagueStats';
import PlayerStats from './types/PlayerStats';

export function emptyPlayerStats(player: User): PlayerStats {
	return {
		userId: player.id,
		avatar: player.avatar ?? '',
		username: player.username ?? '',
		totalBets: 0,
		betCount: 0,
		wonBetCount: 0,
		returnedBetCount: 0,
		lostBetCount: 0,
		emptyBetCount: 0,
		winRate: 0,
		averageOdds: 0,
		averageWonBetOdds: 0,
		actualBalance: 0,
	};
}

export function findLeagueStats(
	statsByLeagues: LeagueStats[],
	leagueId: string
): LeagueStats | undefined {
	return statsByLeagues.find((league) => league.simpleLeague.id === leagueId);
}

export function mergePlayersWithLeagueStats(
	players: User[],
	leagueStats: LeagueStats | undefined
): PlayerStats[] {
	const byUserId = new Map((leagueStats?.playersStats ?? []).map((s) => [s.userId, s]));
	return players.map((player) => byUserId.get(player.id) ?? emptyPlayerStats(player));
}

export function formatLeagueBalance(value: number): string {
	if (value === 0) {
		return '0';
	}
	const abs = Math.abs(value).toFixed(2);
	return value > 0 ? `+${abs}` : `−${abs}`;
}
