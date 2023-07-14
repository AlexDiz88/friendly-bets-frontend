import Season from './Season';

export default interface SeasonsState {
  seasons: Season[];
  statuses: string[];
  activeSeason: Season | null;
  error?: string;
}
