export type MergedOddsSelection = {
	selectionKey: string;
	displayLabel: string;
	bookmakerOdds: Record<string, string>;
};

export type MergedOddsLine = {
	marketName: string;
	line?: string | null;
	selections: MergedOddsSelection[];
};

export type OddsDemoEventSummary = {
	oddsApiEventId: number;
	home: string;
	away: string;
	eventDate: string;
	leagueSlug: string;
	status: string;
	mergedLineCount: number;
};

export type OddsDemoEventDetail = OddsDemoEventSummary & {
	bookmakers: string[];
	mergedLines: MergedOddsLine[];
	fetchedAt: string;
};
