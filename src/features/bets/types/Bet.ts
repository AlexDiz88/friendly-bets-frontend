import Team from '../../admin/teams/types/Team';
import User from '../../auth/types/User';

export default interface Bet {
  id: string;
  createdAt: Date;
  player: User;
  matchDay: string;
  gameId?: string;
  gameDate?: string;
  homeTeam: Team;
  awayTeam: Team;
  betTitle: string;
  betOdds: number;
  betSize: number;
  gameResult?: string;
  betResultAddedAt: Date;
  betStatus: string;
  balanceChange?: number;
  updatedAt: Date;
}

export type BetId = Bet['id'];
