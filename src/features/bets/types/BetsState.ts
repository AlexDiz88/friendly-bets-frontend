import Bet from './Bet';

export default interface BetsState {
	bet?: Bet;
	openedBets: Bet[];
	completedBets: Bet[];
	allBets: Bet[];
	totalPages: number;
	error?: string;
}
