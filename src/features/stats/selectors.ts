import { RootState } from '../../app/store';
import LeagueStats from './types/LeagueStats';
import PlayerHighlight from './types/PlayerHighlight';
import PlayerStats from './types/PlayerStats';
import { PlayerStatsByBetTitles } from './types/PlayerStatsByBetTitles';
import { PlayerStatsByBetValues } from './types/PlayerStatsByBetValues';
import PlayerStatsByTeams from './types/PlayerStatsByTeams';

export const selectPlayersStats = (state: RootState): PlayerStats[] =>
	state.playersStats.playersStats;
export const selectPlayersStatsByLeagues = (state: RootState): LeagueStats[] =>
	state.playersStats.playersStatsByLeague;
export const selectAllStatsByTeamsInSeason = (state: RootState): PlayerStatsByTeams[] =>
	state.playersStats.playersStatsByTeams;
export const selectAllStatsByBetTitlesInSeason = (state: RootState): PlayerStatsByBetTitles[] =>
	state.playersStats.playersStatsByBetTitles;
export const selectAllStatsByBetValuesInSeason = (state: RootState): PlayerStatsByBetValues[] =>
	state.playersStats.playersStatsByBetValues;
export const selectStatsByTeams = (state: RootState): PlayerStatsByTeams | undefined =>
	state.playersStats.statsByTeams;
export const selectPlayerHighlights = (state: RootState): PlayerHighlight[] =>
	state.playersStats.playerHighlights;
export const selectPlayerHighlightsSeasonId = (state: RootState): string | undefined =>
	state.playersStats.playerHighlightsSeasonId;
export const selectError = (state: RootState): string | undefined => state.playersStats.error;
