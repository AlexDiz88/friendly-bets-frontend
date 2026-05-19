import { FootballDataCompetitionOption } from './types/ExternalMatch';

/** football-data.org competition code ↔ наш LeagueCode */
export const FOOTBALL_DATA_COMPETITIONS: FootballDataCompetitionOption[] = [
	{ competitionCode: 'PL', leagueCode: 'EPL' },
	{ competitionCode: 'BL1', leagueCode: 'BL' },
	{ competitionCode: 'CL', leagueCode: 'CL' },
	{ competitionCode: 'EC', leagueCode: 'EC' },
	{ competitionCode: 'WC', leagueCode: 'WC' },
];

export const DEFAULT_FOOTBALL_DATA_SEASON = '2025';
