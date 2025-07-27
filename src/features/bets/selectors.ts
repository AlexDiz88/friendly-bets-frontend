import { RootState } from '../../app/store';
import Bet from './types/Bet';

export const selectBet = (state: RootState): Bet | undefined => state.bets.bet;
export const selectOpenedBets = (state: RootState): Bet[] => state.bets.openedBets;
export const selectCompletedBets = (state: RootState): Bet[] => state.bets.completedBets;
export const selectAllBets = (state: RootState): Bet[] => state.bets.allBets;
export const selectBetTitleCodeLabelMap = (state: RootState): Record<number, string> | undefined =>
	state.bets.betTitleCodeLabelMap;
export const selectTotalPages = (state: RootState): number => state.bets.totalPages;
export const selectError = (state: RootState): string | undefined => state.bets.error;
