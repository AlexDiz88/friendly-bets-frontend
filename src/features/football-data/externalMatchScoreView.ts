import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import GameScore from '../bets/types/GameScore';
import { normalizeMatchStatus } from './matchStatusI18n';

const SCORE_UNAVAILABLE = '—';

const LIVE_STATUSES = new Set(['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT']);

/** Счёт для football-data.org: без live на бесплатном тарифе — прочерк вместо «Не указан!». */
export function getExternalMatchScoreView(
	gameScore: GameScore | null | undefined,
	matchStatus: string
): string {
	if (LIVE_STATUSES.has(normalizeMatchStatus(matchStatus))) {
		return SCORE_UNAVAILABLE;
	}

	if (!gameScore?.fullTime) {
		return SCORE_UNAVAILABLE;
	}

	if (gameScore.firstTime) {
		return getGameScoreView(gameScore, false);
	}

	return gameScore.fullTime;
}
