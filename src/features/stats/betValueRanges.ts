import { BET_VALUE_RANGES, type BetValueRange, type BetValueRangeStats } from './types/PlayerStatsByBetValues';

export const BET_VALUE_RANGE_ACCENT: Record<BetValueRange, string> = {
	SUPER_LOW: '#64748b',
	LOW: '#38bdf8',
	MEDIUM: '#34d399',
	HIGH: '#fbbf24',
	VERY_HIGH: '#fb923c',
	UNLIKELY: '#f87171',
	COSMIC: '#c084fc',
	UNREALISTIC: '#f43f5e',
};

export function betValueRangeAccent(range: BetValueRange): string {
	return BET_VALUE_RANGE_ACCENT[range];
}

export function orderedRangeStats(rangeStats: BetValueRangeStats[]): BetValueRangeStats[] {
	const byRange = new Map(rangeStats.map((stats) => [stats.range, stats]));
	return BET_VALUE_RANGES.flatMap((range) => {
		const stats = byRange.get(range);
		return stats ? [stats] : [];
	});
}

export function summarizeRangeStats(rangeStats: BetValueRangeStats[]): {
	betCount: number;
	wonBetCount: number;
	returnedBetCount: number;
	lostBetCount: number;
	winRate: number;
	actualBalance: number;
} {
	const betCount = rangeStats.reduce((sum, stats) => sum + stats.betCount, 0);
	const wonBetCount = rangeStats.reduce((sum, stats) => sum + stats.wonBetCount, 0);
	const returnedBetCount = rangeStats.reduce((sum, stats) => sum + stats.returnedBetCount, 0);
	const lostBetCount = rangeStats.reduce((sum, stats) => sum + stats.lostBetCount, 0);
	const actualBalance = rangeStats.reduce((sum, stats) => sum + stats.actualBalance, 0);
	const decided = betCount - returnedBetCount;
	return {
		betCount,
		wonBetCount,
		returnedBetCount,
		lostBetCount,
		winRate: decided > 0 ? (wonBetCount * 100) / decided : 0,
		actualBalance,
	};
}
