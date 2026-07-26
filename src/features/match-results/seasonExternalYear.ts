import Season from '../admin/seasons/types/Season';

/** Запасной год, если у активного сезона ещё нет дат / externalSeasonYear. */
const FALLBACK_EXTERNAL_SEASON_YEAR = '2025';

export function resolveDefaultExternalSeason(activeSeason: Season | null | undefined): string {
	if (activeSeason?.externalSeasonYear != null) {
		return String(activeSeason.externalSeasonYear);
	}
	return FALLBACK_EXTERNAL_SEASON_YEAR;
}

/** {@code externalSeasonYear} активного сезона (год старта, едино для всех лиг). */
export function resolveExternalSeasonForLeague(
	activeSeason: Season | null | undefined,
	_leagueCode: string | undefined
): string {
	return resolveDefaultExternalSeason(activeSeason);
}

export function resolveExternalSeasonYearOptions(activeSeason: Season | null | undefined): string[] {
	if (activeSeason?.availableExternalYears && activeSeason.availableExternalYears.length > 0) {
		return activeSeason.availableExternalYears.map(String);
	}
	const year = Number(FALLBACK_EXTERNAL_SEASON_YEAR);
	return [String(year - 1), String(year), String(year + 1)];
}
