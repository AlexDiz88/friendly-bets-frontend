import { RootState } from '../../store';
import Bet from './types/Bet';

export const selectBets = (state: RootState): Bet[] => state.bets.bets;
export const selectError = (state: RootState): string | undefined =>
  state.bets.error;
