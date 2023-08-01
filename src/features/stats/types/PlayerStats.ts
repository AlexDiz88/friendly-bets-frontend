export default interface PlayerStats {
  username: string;
  betCount: number;
  wonBetCount: number;
  returnedBetCount: number;
  lostBetCount: number;
  emptyBetCount: number;
  winRate: number;
  averageOdds: number;
  averageWonBetOdds: number;
  actualBalance: number;
  sumOfOdds: number;
  sumOfWonOdds: number;
}
