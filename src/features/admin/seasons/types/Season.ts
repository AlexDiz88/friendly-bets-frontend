import User from '../../../auth/types/User';
import League from '../../leagues/types/League';

export default interface Season {
	id: string;
	title: string;
	betCountPerMatchDay: number;
	status: string;
	players: User[];
	leagues: League[];
}

export type SeasonId = Season['id'];
