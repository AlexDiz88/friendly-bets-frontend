import Season from '../admin/seasons/types/Season';
import { DEFAULT_MATCH_RESULTS_SEASON } from './competitionOptions';

export function resolveDefaultExternalSeason(activeSeason: Season | null | undefined): string {
	if (activeSeason?.externalSeasonYear != null) {
		return String(activeSeason.externalSeasonYear);
	}
	return DEFAULT_MATCH_RESULTS_SEASON;
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
	const year = Number(DEFAULT_MATCH_RESULTS_SEASON);
	return [String(year - 1), String(year), String(year + 1)];
}
