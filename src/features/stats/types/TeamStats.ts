import Team from '../../admin/teams/types/Team';

export default interface TeamStats {
	team: Team;
	betCount: number;
	wonBetCount: number;
	returnedBetCount: number;
	lostBetCount: number;
	winRate: number;
	averageOdds: number;
	averageWonBetOdds: number;
	actualBalance: number;
}
