import { RootState } from '../../store';
import PlayerStats from './types/PlayerStats';

export const selectPlayersStats = (state: RootState): PlayerStats[] =>
  state.playersStats.playersStats;
export const selectError = (state: RootState): string | undefined =>
  state.bets.error;
