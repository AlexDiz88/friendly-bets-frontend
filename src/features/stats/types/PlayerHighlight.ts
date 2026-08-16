export interface HighlightTeam {
	id: string;
	title: string;
	logoKey?: string;
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
	betSize?: number | null;
	leagueCode?: string | null;
	matchDay?: string | null;
	calendarNodeId?: string | null;
	homeTeam?: HighlightTeam | null;
	awayTeam?: HighlightTeam | null;
}

export interface HighlightMatchday {
	leagueCode: string;
	matchDay?: string | null;
}

export interface BestGameweekHighlight {
	calendarNodeId: string;
	startDate?: string | null;
	endDate?: string | null;
	balanceChange: number;
	matchdays?: HighlightMatchday[] | null;
}

export interface LeagueTeamHighlight {
	leagueId: string;
	leagueCode: string;
	best?: HighlightTeam | null;
	worst?: HighlightTeam | null;
}

export type BetFormStatus = 'WON' | 'RETURNED' | 'LOST' | 'EMPTY';

export default interface PlayerHighlight {
	userId: string;
	recentForm: BetFormStatus[];
	biggestWin?: BiggestWinHighlight | null;
	bestWinStreak: number;
	worstLoseStreak?: number | null;
	bestGameweek?: BestGameweekHighlight | null;
	leagueTeams?: LeagueTeamHighlight[] | null;
}
