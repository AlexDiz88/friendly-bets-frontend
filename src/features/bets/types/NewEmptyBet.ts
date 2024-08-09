export default interface NewEmptyBet {
	userId: string;
	seasonId: string;
	leagueId: string;
	isPlayoff: boolean;
	matchDay: string;
	playoffRound: string;
	betSize: number;
	calendarNodeId: string | undefined;
}
