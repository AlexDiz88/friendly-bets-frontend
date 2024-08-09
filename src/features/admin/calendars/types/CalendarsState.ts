import Bet from '../../../bets/types/Bet';
import BetsPage from '../../../bets/types/BetsPage';
import Calendar from './Calendar';

export default interface CalendarsState {
	allCalendarNodes: Calendar[];
	calendarNodesHasBets: Calendar[];
	actualCalendarNodeBets: Bet[];
	calendarNode: Calendar | undefined;
	betsByCalendarNode: BetsPage | undefined;
	error?: string;
}
