import { FootballDataCompetitionOption } from './types/ExternalMatch';

/** football-data.org competition code ↔ наш LeagueCode */
export const FOOTBALL_DATA_COMPETITIONS: FootballDataCompetitionOption[] = [
	{ competitionCode: 'PL', leagueCode: 'EPL', matchdayCount: 38 },
	{ competitionCode: 'BL1', leagueCode: 'BL', matchdayCount: 34 },
	{ competitionCode: 'CL', leagueCode: 'CL', matchdayCount: 13 },
	{ competitionCode: 'EC', leagueCode: 'EC', matchdayCount: 7 },
	{ competitionCode: 'WC', leagueCode: 'WC', matchdayCount: 7 },
];

export const DEFAULT_FOOTBALL_DATA_SEASON = '2025';

const DEFAULT_MATCHDAY_COUNT = 38;

export function getMatchdayCountForLeague(leagueCode: string): number {
	return (
		FOOTBALL_DATA_COMPETITIONS.find((c) => c.leagueCode === leagueCode)?.matchdayCount ??
		DEFAULT_MATCHDAY_COUNT
	);
}

export function getGridColumnsForMatchdayCount(count: number): number {
	if (count <= 12) return 4;
	if (count <= 24) return 6;
	return 7;
}
