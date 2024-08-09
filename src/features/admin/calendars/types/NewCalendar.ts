import { Dayjs } from 'dayjs';
import LeagueMatchdayNode from './LeagueMatchdayNode';

export default interface NewCalendar {
	seasonId: string | undefined;
	startDate: Dayjs | null;
	endDate: Dayjs | null;
	leagueMatchdayNodes: LeagueMatchdayNode[];
}
