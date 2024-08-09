import NewEmptyBet from './NewEmptyBet';

export default interface NewBet extends NewEmptyBet {
	homeTeamId: string;
	awayTeamId: string;
	betTitle: string;
	betOdds: number;
	betStatus?: string;
	gameResult?: string;
	prevCalendarNodeId?: string | undefined;
	calendarNodeId: string | undefined;
}
