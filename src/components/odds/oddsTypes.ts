import BetTitle from '../../features/bets/types/BetTitle';

export type OddsLineRow = {
	line?: string | null;
	selectionCode: string;
	displayLabel: string;
	bookmakerOdds: Record<string, string>;
	bookmakerSourcePaths?: Record<string, string>;
	selectionKey?: string;
	bestOdds?: string;
	bestBookmaker?: string;
	betTitle?: BetTitle;
	crossBookmakerMismatch?: boolean;
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

export type OddsSelection = {
	selectionKey: string;
	bookmaker: string;
	clientOdds: number;
	displayLabel: string;
	line?: string | null;
	groupKey: string;
};
