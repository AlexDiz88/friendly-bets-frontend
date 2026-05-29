export type OddsLineRow = {
	line?: string | null;
	selectionCode: string;
	displayLabel: string;
	bookmakerOdds: Record<string, string>;
};

export type OddsMarketGroup = {
	category: string;
	groupKey: string;
	sortOrder: number;
	collapsedByDefault: boolean;
	rows: OddsLineRow[];
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
	marketGroups: OddsMarketGroup[];
	fetchedAt: string;
};
