import Season from './Season';

export default interface SeasonsState {
	seasons: Season[];
	statuses: string[];
	activeSeasonId?: string;
	activeSeason: Season | null;
	scheduledSeason: Season | null;
	error?: string;
}
