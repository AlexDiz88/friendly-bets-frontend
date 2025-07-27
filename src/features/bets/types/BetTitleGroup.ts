export interface BetTitleGroup {
	title: string;
	subgroups?: BetSubgroup[];
	codes?: number[];
}

export interface BetSubgroup {
	title: string;
	codes: number[];
}
