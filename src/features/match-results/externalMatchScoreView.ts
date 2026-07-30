import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import GameScore from '../bets/types/GameScore';
import { isMatchNotStarted, normalizeMatchStatus } from './matchStatusI18n';

const SCORE_UNAVAILABLE = '—';
export const DEFAULT_LIVE_SCORE = '0:0';

const LIVE_STATUSES = new Set(['LIVE', 'IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT']);

export function isLiveMatchStatus(matchStatus: string): boolean {
	return LIVE_STATUSES.has(normalizeMatchStatus(matchStatus));
}

function hasLiveMinuteLabel(liveMinuteLabel?: string | null): boolean {
	return Boolean(liveMinuteLabel?.trim());
}

function isEffectivelyLiveMatch(matchStatus: string, liveMinuteLabel?: string | null): boolean {
	return isLiveMatchStatus(matchStatus) || hasLiveMinuteLabel(liveMinuteLabel);
}

/** Показывать live-счёт с LIVE-провайдера, а не прочерк. */
export function trustExternalLiveScore(
	gameScore: GameScore | null | undefined,
	matchStatus: string,
	liveMinuteLabel?: string | null
): boolean {
	return (
		isEffectivelyLiveMatch(matchStatus, liveMinuteLabel) &&
		Boolean(gameScore?.fullTime || hasLiveMinuteLabel(liveMinuteLabel))
	);
}

/** Отображаемый счёт; при trustLiveScore — live-счёт. */
export function getExternalMatchScoreView(
	gameScore: GameScore | null | undefined,
	matchStatus: string,
	finalized = false,
	trustLiveScore = false
): string {
	if (isLiveMatchStatus(matchStatus) && !finalized && !trustLiveScore) {
		return SCORE_UNAVAILABLE;
	}

	if (trustLiveScore && !finalized) {
		if (gameScore?.fullTime) {
			return formatLiveScoreWithPenalty(gameScore.fullTime, gameScore.penalty, matchStatus);
		}
		return DEFAULT_LIVE_SCORE;
	}

	if (!gameScore?.fullTime) {
		return SCORE_UNAVAILABLE;
	}

	if (gameScore.firstTime) {
		return getGameScoreView(gameScore, false);
	}

	return formatLiveScoreWithPenalty(gameScore.fullTime, gameScore.penalty, matchStatus);
}

/**
 * Во время серии пенальти: основной счёт + счёт по пенальти в скобках, напр. {@code 0:0 [2:2]}.
 */
export function formatLiveScoreWithPenalty(
	fullTime: string,
	penalty: string | null | undefined,
	matchStatus: string
): string {
	const pen = penalty?.trim();
	if (pen && normalizeMatchStatus(matchStatus) === 'PENALTY_SHOOTOUT') {
		return `${fullTime} [${pen}]`;
	}
	return fullTime;
}

export function hasExternalMatchScore(scoreView?: string | null): boolean {
	return Boolean(scoreView && scoreView !== SCORE_UNAVAILABLE);
}

/** Единая точка: trust + live 0:0 + kickoff прошёл, а sync ещё не обновил статус. */
export function resolveExternalMatchScoreView(params: {
	gameScore: GameScore | null | undefined;
	matchStatus: string;
	finalized?: boolean;
	liveMinuteLabel?: string | null;
	kickoffUtcMs?: number;
}): string {
	const finalized = params.finalized ?? false;
	const trustLiveScore = trustExternalLiveScore(
		params.gameScore,
		params.matchStatus,
		params.liveMinuteLabel
	);
	const view = getExternalMatchScoreView(
		params.gameScore,
		params.matchStatus,
		finalized,
		trustLiveScore
	);
	if (hasExternalMatchScore(view) || finalized) {
		return view;
	}
	const kickoffUtcMs = params.kickoffUtcMs ?? 0;
	if (
		kickoffUtcMs > 0 &&
		Date.now() >= kickoffUtcMs &&
		isMatchNotStarted(params.matchStatus)
	) {
		return DEFAULT_LIVE_SCORE;
	}
	return view;
}
