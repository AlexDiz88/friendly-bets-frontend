import BetTitle from './BetTitle';
import GameScore from './GameScore';

export default interface UpdatedBet {
	seasonId: string;
	leagueId: string;
	userId: string;
	matchDay: string;
	homeTeamId: string | undefined;
	awayTeamId: string | undefined;
	betTitle: BetTitle;
	betOdds: number;
	betSize: number;
	gameResult?: GameScore | null;
	betStatus: string;
	prevCalendarNodeId?: string | undefined;
	calendarNodeId: string | undefined;
}
