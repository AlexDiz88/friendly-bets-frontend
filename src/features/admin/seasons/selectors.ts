import { RootState } from '../../../app/store';
import Season from './types/Season';

export const selectSeasons = (state: RootState): Season[] => state.seasons.seasons;
export const selectStatuses = (state: RootState): string[] => state.seasons.statuses;
export const selectActiveSeason = (state: RootState): Season | null => state.seasons.activeSeason;
export const selectActiveSeasonId = (state: RootState): string | undefined =>
	state.seasons.activeSeasonId;
export const selectScheduledSeason = (state: RootState): Season | null =>
	state.seasons.scheduledSeason;
export const selectError = (state: RootState): string | undefined => state.seasons.error;
