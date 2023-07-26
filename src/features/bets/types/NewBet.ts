export default interface NewBet {
  userId: string;
  seasonId: string;
  leagueId: string;
  matchDay: string;
  gameId?: string;
  gameDate?: string;
  homeTeamId: string;
  awayTeamId: string;
  betTitle: string;
  betOdds: number;
  betSize: number;
}
