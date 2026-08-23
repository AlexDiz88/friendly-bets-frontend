export type SeasonSortable = {
	id: string;
	startDate?: string;
	externalSeasonYear?: number;
};

function seasonRecencyKey(season: SeasonSortable): string {
	if (season.startDate) {
		return season.startDate;
	}
	if (season.externalSeasonYear != null) {
		return `${season.externalSeasonYear}-01-01`;
	}
	return '';
}

/** Newest first: startDate / year desc, then original list order reversed. */
export function sortSeasonsNewestFirst<T extends SeasonSortable>(seasons: T[]): T[] {
	const indexById = new Map(seasons.map((season, index) => [season.id, index]));
	return [...seasons].sort((a, b) => {
		const aKey = seasonRecencyKey(a);
		const bKey = seasonRecencyKey(b);
		if (aKey && bKey) {
			const byDate = bKey.localeCompare(aKey);
			if (byDate !== 0) {
				return byDate;
			}
		} else if (aKey) {
			return -1;
		} else if (bKey) {
			return 1;
		}
		return (indexById.get(b.id) ?? 0) - (indexById.get(a.id) ?? 0);
	});
}
