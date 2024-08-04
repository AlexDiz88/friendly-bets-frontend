import Bet from '../../../bets/types/Bet';
import NewCalendar from './NewCalendar';

export default interface Calendar extends NewCalendar {
	id: string;
	bets: Bet[];
}
