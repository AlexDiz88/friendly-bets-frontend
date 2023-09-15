import SimpleLeague from '../../admin/leagues/types/SimpleLeague';
import PlayerStats from './PlayerStats';

export default interface LeagueStats {
  simpleLeague: SimpleLeague;
  playersStats: PlayerStats[];
}
