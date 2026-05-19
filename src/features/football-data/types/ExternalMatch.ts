import GameScore from '../../bets/types/GameScore';

export type ExternalMatchdaySyncStatus = 'POLLING' | 'COMPLETED';

export interface ExternalMatchdaySync {
	competitionCode: string;
	matchday: number;
	season: string;
	syncStatus: ExternalMatchdaySyncStatus;
	expectedMatchCount: number;
	finishedMatchCount: number;
	lastFetchedAt?: string;
	completedAt?: string;
}

export interface ExternalMatch {
	externalMatchId: number;
	competitionCode: string;
	matchday: number;
	season: string;
	status: string;
	utcDate?: string;
	homeTeamName: string;
	awayTeamName: string;
	gameScore?: GameScore | null;
}

export interface ExternalMatchdayPage {
	sync: ExternalMatchdaySync | null;
	matches: ExternalMatch[];
}

export interface FootballDataCompetitionOption {
	competitionCode: string;
	leagueCode: string;
	/** Запасное число туров, если API недоступен. */
	matchdayCount: number;
}

export interface ExternalCompetitionInfo {
	competitionCode: string;
	season: string;
	currentMatchday: number;
	matchdayCount: number;
}
