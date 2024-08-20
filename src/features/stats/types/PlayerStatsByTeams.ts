import TeamStats from './TeamStats';

export default interface PlayerStatsByTeams {
	seasonId: string;
	leagueId: string;
	leagueStats: boolean;
	teamStats: TeamStats[];
}
