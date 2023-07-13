import { RootState } from '../../../store';
import Season from './types/Season';

export const selectSeasons = (state: RootState): Season[] => state.seasons.seasons;
export const selectError = (state: RootState): string | undefined =>
  state.tasks.error;
