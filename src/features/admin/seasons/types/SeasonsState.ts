import Season from './Season';
import SeasonSummary from './SeasonSummary';

export default interface SeasonsState {
	seasons: Season[];
	summaries: SeasonSummary[];
	statuses: string[];
	leagueCodes: string[];
	activeSeasonId?: string;
	activeSeason: Season | null;
	scheduledSeason: Season | null;
	error?: string;
}
