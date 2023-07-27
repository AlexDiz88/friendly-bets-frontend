import NewEmptyBet from './NewEmptyBet';

export default interface NewBet extends NewEmptyBet {
  gameId?: string;
  gameDate?: string;
  homeTeamId: string;
  awayTeamId: string;
  betTitle: string;
  betOdds: number;
}
