import { RootState } from '../../../store';
import Season from './types/Season';

export const selectSeasons = (state: RootState): Season[] => state.seasons.seasons;
export const selectStatuses = (state: RootState): string[] => state.seasons.statuses;
export const selectActiveSeason = (state: RootState): Season | null =>
  state.seasons.activeSeason;
export const selectError = (state: RootState): string | undefined =>
  state.tasks.error;
