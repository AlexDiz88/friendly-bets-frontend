export interface BetTitleGroup {
	title: string;
	codes?: number[]; // ручной список
	range?: [number, number]; // [min, max] включительно
	subgroups?: BetTitleSubgroup[];
}

export interface BetTitleSubgroup {
	title: string;
	codes?: number[];
	range?: [number, number];
}
