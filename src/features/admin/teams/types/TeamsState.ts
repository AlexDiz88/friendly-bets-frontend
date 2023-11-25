import Team from './Team';

export default interface TeamsState {
	teams: Team[];
	error?: string;
}
