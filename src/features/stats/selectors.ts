import { RootState } from '../../app/store';
import LeagueStats from './types/LeagueStats';
import PlayerStats from './types/PlayerStats';
import PlayerStatsByTeams from './types/PlayerStatsByTeams';

export const selectPlayersStats = (state: RootState): PlayerStats[] =>
	state.playersStats.playersStats;
export const selectPlayersStatsByLeagues = (state: RootState): LeagueStats[] =>
	state.playersStats.playersStatsByLeague;
export const selectAllStatsByTeamsInSeason = (state: RootState): PlayerStatsByTeams[] =>
	state.playersStats.playersStatsByTeams;
export const selectError = (state: RootState): string | undefined => state.playersStats.error;
