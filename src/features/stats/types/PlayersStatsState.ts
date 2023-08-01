import PlayerStats from './PlayerStats';

export default interface PlayersStatsState {
  playersStats: PlayerStats[];
  error?: string;
}
