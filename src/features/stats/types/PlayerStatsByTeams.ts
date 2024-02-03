import TeamStats from './TeamStats';

export default interface PlayerStatsByTeams {
	seasonId: string;
	leagueId: string;
	leagueNameRu: string;
	avatar: string;
	username: string;
	leagueStats: boolean;
	teamStats: TeamStats[];
}
