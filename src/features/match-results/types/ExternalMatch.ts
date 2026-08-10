import GameScore from '../../bets/types/GameScore';
import { TeamDisplayNames } from '../../admin/teams/types/Team';
import type MatchGoalEvent from './MatchGoalEvent';

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
	/** FIFA-код страны (напр. COD), если команда найдена в БД. */
	homeTeamCountry?: string | null;
	awayTeamCountry?: string | null;
	gameScore?: GameScore | null;
	finalized?: boolean;
	finalizedAt?: string;
	finalizedSource?: string;
	adminCorrected?: boolean;
	/** Текущая минута live (напр. 72'). */
	liveMinuteLabel?: string | null;
	fetchedAt?: string;
	/** Id в wc26_schedule (1–104), если связан в БД. */
	wc26ScheduleId?: number | null;
	/** Канонический id тура (для определения плей-офф / ОТ). */
	slotId?: string | null;
	/** FULL_MATCH events (goals, reds, misses). */
	goals?: MatchGoalEvent[] | null;
	addedTimeFirstHalf?: number | null;
	addedTimeSecondHalf?: number | null;
}

export interface MatchdayPageData {
	matches: ExternalMatch[];
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
