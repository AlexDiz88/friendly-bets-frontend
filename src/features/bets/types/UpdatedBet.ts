import BetTitle from './BetTitle';
import GameResult from './GameResult';

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
	gameResult?: GameResult | null;
	betStatus: string;
	prevCalendarNodeId?: string | undefined;
	calendarNodeId: string | undefined;
}
