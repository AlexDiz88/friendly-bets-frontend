export type OddsLineRow = {
	line?: string | null;
	selectionCode: string;
	displayLabel: string;
	bookmakerOdds: Record<string, string>;
	selectionKey?: string;
	bestOdds?: string;
	bestBookmaker?: string;
};

export type OddsMarketGroup = {
	category: string;
	groupKey: string;
	sortOrder: number;
	collapsedByDefault: boolean;
	rows: OddsLineRow[];
};

export type OddsEventMarkets = {
	gameResultId: string;
	homeTeamId: string;
	awayTeamId: string;
	status: string;
	kickoffUtc?: string;
	bookmakers: string[];
	marketGroups: OddsMarketGroup[];
	fetchedAt?: string;
};

export type Wc26BettingContext = {
	bettingEnabled: boolean;
	seasonId?: string;
	leagueId?: string;
	leagueCode?: string;
	tournamentFormatId?: string;
	seasonParticipant: boolean;
};

export type Wc26GameResultLookup = {
	gameResultId: string;
	wc26ScheduleId: number;
	homeTeamId: string;
	awayTeamId: string;
	kickoffUtc?: string;
	slotId?: string;
};

export type PlaceBetFromOddsRequest = {
	wc26ScheduleId: number;
	matchDay: string;
	selectionKey: string;
	bookmaker: string;
	clientOdds: number;
};

export type OddsSelection = {
	selectionKey: string;
	bookmaker: string;
	clientOdds: number;
	displayLabel: string;
	line?: string | null;
	groupKey: string;
};
