import LeagueStats from './LeagueStats';
import PlayerStats from './PlayerStats';

export default interface PlayersStatsState {
  playersStats: PlayerStats[];
  playersStatsByLeague: LeagueStats[];
  error?: string;
}
