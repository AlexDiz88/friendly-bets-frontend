import Team from './Team';

export default interface TeamsState {
	teams: Team[];
	leagueTeams: Team[];
	error?: string;
}
