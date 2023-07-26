export default interface Bet {
  id: string;
  username: string;
  seasonId: string;
  leagueName: string;
  matchDay: string;
  gameId?: string;
  gameDate?: string;
  homeTeamTitle: string;
  awayTeamTitle: string;
  betTitle: string;
  betOdds: number;
  betSize: number;
  gameResult?: string;
  betStatus: string;
  balanceChange?: number;
}

export type BetId = Bet['id'];
