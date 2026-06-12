import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import GameScore from '../bets/types/GameScore';
import { normalizeMatchStatus } from './matchStatusI18n';

const SCORE_UNAVAILABLE = '—';

const LIVE_STATUSES = new Set(['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT']);

export function isLiveMatchStatus(matchStatus: string): boolean {
	return LIVE_STATUSES.has(normalizeMatchStatus(matchStatus));
}

/** Показывать live-счёт с primary-провайдера (4score), а не прочерк. */
export function trustExternalLiveScore(
	gameScore: GameScore | null | undefined,
	matchStatus: string,
	liveMinuteLabel?: string | null
): boolean {
	return (
		isLiveMatchStatus(matchStatus) &&
		Boolean(gameScore?.fullTime || liveMinuteLabel)
	);
}

/** Счёт для football-data.org; при trustLiveScore — показываем live-счёт 4score. */
export function getExternalMatchScoreView(
	gameScore: GameScore | null | undefined,
	matchStatus: string,
	finalized = false,
	trustLiveScore = false
): string {
	if (isLiveMatchStatus(matchStatus) && !finalized && !trustLiveScore) {
		return SCORE_UNAVAILABLE;
	}

	if (!gameScore?.fullTime) {
		return SCORE_UNAVAILABLE;
	}

	if (trustLiveScore && isLiveMatchStatus(matchStatus) && !finalized) {
		return gameScore.fullTime;
	}

	if (gameScore.firstTime) {
		return getGameScoreView(gameScore, false);
	}

	return gameScore.fullTime;
}
