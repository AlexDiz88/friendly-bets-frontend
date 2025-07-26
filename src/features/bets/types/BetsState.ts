import Bet from './Bet';

export default interface BetsState {
	bet?: Bet;
	openedBets: Bet[];
	completedBets: Bet[];
	allBets: Bet[];
	betTitleCodeLabelMap: Record<number, string> | undefined;
	totalPages: number;
	error?: string;
}
