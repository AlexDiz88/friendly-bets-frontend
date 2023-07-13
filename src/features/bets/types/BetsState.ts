import Bet from './Bet';

export default interface BetsState {
  bets: Bet[];
  error?: string;
}
