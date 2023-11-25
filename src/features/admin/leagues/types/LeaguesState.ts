import League from './League';

export default interface LeaguesState {
	leagues: League[];
	error?: string;
}
