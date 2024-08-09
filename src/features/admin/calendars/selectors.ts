import { RootState } from '../../../app/store';
import Bet from '../../bets/types/Bet';
import BetsPage from '../../bets/types/BetsPage';
import Calendar from './types/Calendar';

export const selectAllCalendarNodes = (state: RootState): Calendar[] =>
	state.calendars.allCalendarNodes;
export const selectCalendarNodesHasBets = (state: RootState): Calendar[] =>
	state.calendars.calendarNodesHasBets;
export const selectActualCalendarNodeBets = (state: RootState): Bet[] =>
	state.calendars.actualCalendarNodeBets;
export const selectCalendarNode = (state: RootState): Calendar | undefined =>
	state.calendars.calendarNode;
export const selectBetsByCalendarNode = (state: RootState): BetsPage | undefined =>
	state.calendars.betsByCalendarNode;
export const selectError = (state: RootState): string | undefined => state.calendars.error;
