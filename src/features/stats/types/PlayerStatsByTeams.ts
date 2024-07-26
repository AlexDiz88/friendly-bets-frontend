import TeamStats from './TeamStats';

export default interface PlayerStatsByTeams {
	seasonId: string;
	leagueId: string;
	leagueCode: string;
	avatar: string;
	username: string;
	leagueStats: boolean;
	teamStats: TeamStats[];
}
