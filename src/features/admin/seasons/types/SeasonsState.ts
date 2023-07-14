import Season from './Season';

export default interface SeasonsState {
  seasons: Season[];
  statuses: string[];
  error?: string;
}
