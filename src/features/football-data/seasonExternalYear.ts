import Season from '../admin/seasons/types/Season';
import { DEFAULT_FOOTBALL_DATA_SEASON } from './competitionOptions';

const TOURNAMENT_LEAGUE_CODES = new Set(['WC', 'EC']);

export function resolveDefaultExternalSeason(activeSeason: Season | null | undefined): string {
	if (activeSeason?.externalSeasonYear != null) {
		return String(activeSeason.externalSeasonYear);
	}
	return DEFAULT_FOOTBALL_DATA_SEASON;
}

/** WC/EC на football-data.org — год турнира (конец сезона), не год старта. */
export function resolveExternalSeasonForLeague(
	activeSeason: Season | null | undefined,
	leagueCode: string | undefined
): string {
	if (activeSeason && leagueCode && TOURNAMENT_LEAGUE_CODES.has(leagueCode)) {
		if (activeSeason.endDate) {
			return String(new Date(activeSeason.endDate).getFullYear());
		}
		if (activeSeason.availableExternalYears && activeSeason.availableExternalYears.length > 0) {
			return String(Math.max(...activeSeason.availableExternalYears));
		}
	}
	return resolveDefaultExternalSeason(activeSeason);
}

export function resolveExternalSeasonYearOptions(activeSeason: Season | null | undefined): string[] {
	if (activeSeason?.availableExternalYears && activeSeason.availableExternalYears.length > 0) {
		return activeSeason.availableExternalYears.map(String);
	}
	const year = Number(DEFAULT_FOOTBALL_DATA_SEASON);
	return [String(year - 1), String(year), String(year + 1)];
}
