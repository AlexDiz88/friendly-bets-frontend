/** Страницы сборных и расписание на fifa.com; флаги — CDN (api.fifa.com часто недоступен). */
const FIFA_TOURNAMENT_BASE =
	'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026';
const FIFA_SCHEDULE_URL = `${FIFA_TOURNAMENT_BASE}/articles/match-schedule-fixtures-results-teams-stadiums`;

/** ISO 3166-1 alpha-2 / flagcdn-суффикс для изображения флага. */
export function flagImageUrl(isoFlag: string): string {
	return `https://flagcdn.com/w80/${isoFlag.toLowerCase()}.png`;
}

export function fifaTeamPageUrl(teamSlug: string): string {
	return `${FIFA_TOURNAMENT_BASE}/teams/${teamSlug}`;
}

export { FIFA_SCHEDULE_URL, FIFA_TOURNAMENT_BASE };
