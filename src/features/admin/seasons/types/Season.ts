import User from '../../../auth/types/User';
import Bet from '../../../bets/types/Bet';
import League from '../../leagues/types/League';

export default interface Season {
  id: string;
  title: string;
  betCountPerMatchDay: number;
  players?: User[];
  leagues?: League[];
  bets?: Bet[];
}

export type SeasonId = Season['id'];
