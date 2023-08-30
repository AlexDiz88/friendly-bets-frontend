import { RootState } from '../../store';
import LeagueStats from './types/LeagueStats';
import PlayerStats from './types/PlayerStats';

export const selectPlayersStats = (state: RootState): PlayerStats[] =>
  state.playersStats.playersStats;
export const selectPlayersStatsByLeagues = (state: RootState): LeagueStats[] =>
  state.playersStats.playersStatsByLeague;
export const selectError = (state: RootState): string | undefined =>
  state.bets.error;
