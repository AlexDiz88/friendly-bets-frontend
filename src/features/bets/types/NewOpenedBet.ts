import BetTitle from './BetTitle';
import NewEmptyBet from './NewEmptyBet';

export default interface NewOpenedBet extends NewEmptyBet {
	homeTeamId: string;
	awayTeamId: string;
	betTitle: BetTitle;
	betOdds: number;
	prevCalendarNodeId?: string | undefined;
	calendarNodeId: string | undefined;
}
