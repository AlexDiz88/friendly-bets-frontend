import Team from '../../admin/teams/types/Team';

export default interface Bet {
  id: string;
  createdAt: Date;
  username: string;
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
}

export type BetId = Bet['id'];
