export default interface UpdatedBet {
	seasonId: string;
	leagueId: string;
	userId: string;
	matchDay: string;
	homeTeamId: string | undefined;
	awayTeamId: string | undefined;
	betTitle: string | undefined;
	betOdds: number;
	betSize: number;
	gameResult?: string;
	betStatus: string;
	prevCalendarNodeId?: string | undefined;
	calendarNodeId: string | undefined;
}
