import Bet from '../../../bets/types/Bet';
import Team from '../../teams/types/Team';

export default interface League {
  id: string;
  name: string;
  displayNameRu: string;
  displayNameEn: string;
  shortNameRu: string;
  shortNameEn: string;
  currentMatchDay: string;
  teams: Team[];
  bets: Bet[];
}

export type LeagueId = League['id'];
