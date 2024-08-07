import Season from './Season';

export default interface SeasonsState {
	seasons: Season[];
	statuses: string[];
	leagueCodes: string[];
	activeSeasonId?: string;
	activeSeason: Season | null;
	scheduledSeason: Season | null;
	error?: string;
}
