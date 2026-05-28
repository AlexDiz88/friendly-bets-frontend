import GameScore from '../../bets/types/GameScore';
import { TeamDisplayNames } from '../../admin/teams/types/Team';

export type ExternalMatchdaySyncStatus = 'POLLING' | 'COMPLETED';

export interface ExternalMatchdaySync {
	leagueCode: string;
	matchday: number;
	season: string;
	syncStatus: ExternalMatchdaySyncStatus;
	expectedMatchCount: number;
	finishedMatchCount: number;
	lastFetchedAt?: string;
	completedAt?: string;
}

export interface ExternalMatch {
	id?: string;
	externalMatchId: number;
	leagueCode: string;
	matchday: number;
	season: string;
	status: string;
	utcDate?: string;
	homeTeamName: string;
	awayTeamName: string;
	homeTeamId?: string;
	awayTeamId?: string;
	/** Внутренний title (PascalCase), если команда найдена в БД. */
	homeTeamTitle?: string | null;
	awayTeamTitle?: string | null;
	homeTeamLogoKey?: string | null;
	awayTeamLogoKey?: string | null;
	homeTeamDisplayNames?: TeamDisplayNames | null;
	awayTeamDisplayNames?: TeamDisplayNames | null;
	gameScore?: GameScore | null;
	finalized?: boolean;
	finalizedAt?: string;
	finalizedSource?: string;
	adminCorrected?: boolean;
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

export interface ExternalMatchdaySlot {
	value: number;
	slotId?: string;
	label: string;
	kind: 'REGULAR' | 'KNOCKOUT';
}

export interface ExternalCompetitionInfo {
	competitionCode: string;
	season: string;
	leagueId?: string;
	currentMatchday: number;
	matchdayCount: number;
	matchdaySlots?: ExternalMatchdaySlot[];
}
