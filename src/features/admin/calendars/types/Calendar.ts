import GameweekStats from './GameweekStats';
import NewCalendar from './NewCalendar';

export default interface Calendar extends NewCalendar {
	id: string;
	hasBets: boolean;
	isFinished: boolean;
	previousGameweekId: string;
	gameweekStats: GameweekStats[];
	/** Только GET .../current — лига/тур для дефолта «Результаты». */
	resultsLeagueCode?: string;
	resultsMatchDay?: string;
}
