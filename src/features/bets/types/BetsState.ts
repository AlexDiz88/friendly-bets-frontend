import Bet from './Bet';

export default interface BetsState {
	bet?: Bet;
	bets: Bet[];
	error?: string;
}
