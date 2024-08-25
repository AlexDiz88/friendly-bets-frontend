import NewEmptyBet from './NewEmptyBet';

export default interface NewOpenedBet extends NewEmptyBet {
	homeTeamId: string;
	awayTeamId: string;
	betTitle: string;
	betOdds: number;
	prevCalendarNodeId?: string | undefined;
	calendarNodeId: string | undefined;
}
