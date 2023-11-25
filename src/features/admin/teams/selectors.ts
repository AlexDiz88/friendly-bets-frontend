import { RootState } from '../../../app/store';
import Team from './types/Team';

export const selectTeams = (state: RootState): Team[] => state.teams.teams;
export const selectError = (state: RootState): string | undefined => state.teams.error;
