import { RootState } from '../../app/store';
import LeagueStats from './types/LeagueStats';
import PlayerStats from './types/PlayerStats';
import { PlayerStatsByBetTitles } from './types/PlayerStatsByBetTitles';
import PlayerStatsByTeams from './types/PlayerStatsByTeams';

export const selectPlayersStats = (state: RootState): PlayerStats[] =>
	state.playersStats.playersStats;
export const selectPlayersStatsByLeagues = (state: RootState): LeagueStats[] =>
	state.playersStats.playersStatsByLeague;
export const selectAllStatsByTeamsInSeason = (state: RootState): PlayerStatsByTeams[] =>
	state.playersStats.playersStatsByTeams;
export const selectAllStatsByBetTitlesInSeason = (state: RootState): PlayerStatsByBetTitles[] =>
	state.playersStats.playersStatsByBetTitles;
export const selectStatsByTeams = (state: RootState): PlayerStatsByTeams | undefined =>
	state.playersStats.statsByTeams;
export const selectError = (state: RootState): string | undefined => state.playersStats.error;
