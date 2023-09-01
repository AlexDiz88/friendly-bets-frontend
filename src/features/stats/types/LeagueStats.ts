import League from '../../admin/leagues/types/League';
import PlayerStats from './PlayerStats';

export default interface LeagueStats {
  league: League;
  playersStats: PlayerStats[];
}
