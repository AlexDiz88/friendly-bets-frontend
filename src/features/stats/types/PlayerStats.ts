export default interface PlayerStats {
	userId: string;
	avatar: string;
	username: string;
	totalBets: number;
	betCount: number;
	wonBetCount: number;
	returnedBetCount: number;
	lostBetCount: number;
	emptyBetCount: number;
	winRate: number;
	averageOdds: number;
	averageWonBetOdds: number;
	actualBalance: number;
}
