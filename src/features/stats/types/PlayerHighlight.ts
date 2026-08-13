export interface HighlightTeam {
	id: string;
	title: string;
	displayNames?: {
		en?: string;
		ru?: string;
		de?: string;
	};
	actualBalance?: number | null;
}

export interface BiggestWinHighlight {
	balanceChange: number;
	betOdds?: number | null;
	homeTeam?: HighlightTeam | null;
	awayTeam?: HighlightTeam | null;
}

export interface BestGameweekHighlight {
	calendarNodeId: string;
	startDate?: string | null;
	endDate?: string | null;
	balanceChange: number;
}

export type BetFormStatus = 'WON' | 'RETURNED' | 'LOST' | 'EMPTY';

export default interface PlayerHighlight {
	userId: string;
	recentForm: BetFormStatus[];
	biggestWin?: BiggestWinHighlight | null;
	bestWinStreak: number;
	bestGameweek?: BestGameweekHighlight | null;
	mostProfitableTeam?: HighlightTeam | null;
	mostUnprofitableTeam?: HighlightTeam | null;
}
