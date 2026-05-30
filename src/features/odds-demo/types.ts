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
