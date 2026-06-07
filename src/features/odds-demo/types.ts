export type {
	OddsLineRow,
	OddsMarketGroup,
	OddsEventMarkets,
	OddsSelection,
} from '../../components/odds/oddsTypes';

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
	marketGroups: import('../../components/odds/oddsTypes').OddsMarketGroup[];
	fetchedAt: string;
};

export type OddsMappingTraceEntry = {
	bookmaker: string;
	marketName: string;
	rawRowJson: string;
	category?: string;
	mappingStatus: string;
	rejectReason?: string;
	rejectDetail?: string;
	betTitleCode?: number;
	betTitleIsNot?: boolean;
	betTitleLabel?: string;
	odds?: string;
	selectionCode?: string;
	line?: string;
};

export type OddsDemoDebugDetail = {
	oddsApiEventId: number;
	home: string;
	away: string;
	bookmakers: string[];
	fetchedAt: string;
	rawBookmakers: Record<string, unknown[]>;
	mappingTraceByBookmaker: Record<string, OddsMappingTraceEntry[]>;
	mergedMarketGroups: import('../../components/odds/oddsTypes').OddsMarketGroup[];
	mappingIssues: string[];
};
