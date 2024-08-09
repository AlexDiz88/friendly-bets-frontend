import LeagueStats from './LeagueStats';
import PlayerStats from './PlayerStats';
import PlayerStatsByTeams from './PlayerStatsByTeams';

export default interface PlayersStatsState {
	playersStats: PlayerStats[];
	playersStatsByLeague: LeagueStats[];
	playersStatsByTeams: PlayerStatsByTeams[];
	statsByTeams: PlayerStatsByTeams | undefined;
	error?: string;
}
