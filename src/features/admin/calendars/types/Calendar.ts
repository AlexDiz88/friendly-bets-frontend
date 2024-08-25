import GameweekStats from './GameweekStats';
import NewCalendar from './NewCalendar';

export default interface Calendar extends NewCalendar {
	id: string;
	hasBets: boolean;
	isFinished: boolean;
	previousGameweekId: string;
	gameweekStats: GameweekStats[];
}
