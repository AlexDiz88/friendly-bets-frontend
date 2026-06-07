import Season from '../admin/seasons/types/Season';
import { DEFAULT_FOOTBALL_DATA_SEASON } from './competitionOptions';

export function resolveDefaultExternalSeason(activeSeason: Season | null | undefined): string {
	if (activeSeason?.externalSeasonYear != null) {
		return String(activeSeason.externalSeasonYear);
	}
	return DEFAULT_FOOTBALL_DATA_SEASON;
}

/** Год football-data.org: {@code externalSeasonYear} активного сезона (год старта, едино для всех лиг). */
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
	const year = Number(DEFAULT_FOOTBALL_DATA_SEASON);
	return [String(year - 1), String(year), String(year + 1)];
}
