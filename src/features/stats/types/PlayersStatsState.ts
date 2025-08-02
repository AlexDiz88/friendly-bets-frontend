import LeagueStats from './LeagueStats';
import PlayerStats from './PlayerStats';
import { PlayerStatsByBetTitles } from './PlayerStatsByBetTitles';
import PlayerStatsByTeams from './PlayerStatsByTeams';

export default interface PlayersStatsState {
	playersStats: PlayerStats[];
	playersStatsByLeague: LeagueStats[];
	playersStatsByTeams: PlayerStatsByTeams[];
	playersStatsByBetTitles: PlayerStatsByBetTitles[];
	statsByTeams: PlayerStatsByTeams | undefined;
	error?: string;
}
