export default interface Bet {
  id: string;
  username: string;
  seasonTitle: string;
  leagueTitle: string;
  matchDay: string;
  gameId: number;
  gameDate: string;
  homeTeam: string;
  awayTeam: string;
  betTitle: string;
  betOdds: number;
  betSize: number;
  gameResult: string;
  betStatus: string;
  balanceChange: number;
}

export type BetId = Bet['id'];
