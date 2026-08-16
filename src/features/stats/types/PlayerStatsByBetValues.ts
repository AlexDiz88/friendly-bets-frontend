export const BET_VALUE_RANGES = [
	'SUPER_LOW',
	'LOW',
	'MEDIUM',
	'HIGH',
	'VERY_HIGH',
	'UNLIKELY',
	'COSMIC',
	'UNREALISTIC',
] as const;

export type BetValueRange = (typeof BET_VALUE_RANGES)[number];

export const TOTAL_LEAGUE_ID = 'total';

export interface BetValueRangeStats {
	range: BetValueRange;
	betCount: number;
	wonBetCount: number;
	returnedBetCount: number;
	lostBetCount: number;
	winRate: number;
	averageOdds: number;
	averageWonBetOdds: number;
	actualBalance: number;
}

export interface PlayerStatsByBetValues {
	seasonId: string;
	leagueId: string;
	leagueCode: string | null;
	userId: string;
	betCount: number;
	actualBalance: number;
	rangeStats: BetValueRangeStats[];
}
