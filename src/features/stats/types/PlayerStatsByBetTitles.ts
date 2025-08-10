export interface PlayerStatsByBetTitles {
	seasonId: string;
	userId: string;
	actualBalance: number;
	betTitleCategoryStats: CategoryStats[];
}

export interface CategoryStats {
	category: string;
	stats: SubCategoryStats[];
}

export interface SubCategoryStats {
	subCategory: string;
	betCount: number;
	wonBetCount: number;
	returnedBetCount: number;
	lostBetCount: number;
	winRate: number;
	averageOdds: number;
	averageWonBetOdds: number;
	actualBalance: number;
}
