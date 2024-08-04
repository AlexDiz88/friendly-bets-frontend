import BetsPage from '../../../bets/types/BetsPage';
import Calendar from './Calendar';

export default interface CalendarsState {
	allCalendarNodes: Calendar[];
	calendarNode: Calendar | undefined;
	betsByCalendarNode: BetsPage | undefined;
	error?: string;
}
