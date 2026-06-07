import User from '../../../auth/types/User';
import League from '../../leagues/types/League';

export default interface Season {
	id: string;
	title: string;
	startDate?: string;
	endDate?: string;
	externalSeasonYear?: number;
	availableExternalYears?: number[];
	betCountPerMatchDay: number;
	defaultBetSize: number;
	status: string;
	players: User[];
	leagues: League[];
}

export interface SeasonWithoutDates {
	seasonId: string;
	title: string;
	status: string;
}

export type SeasonId = Season['id'];
