import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import GameScore from '../bets/types/GameScore';
import { normalizeMatchStatus } from './matchStatusI18n';

const SCORE_UNAVAILABLE = '—';

const LIVE_STATUSES = new Set(['IN_PLAY', 'PAUSED', 'EXTRA_TIME', 'PENALTY_SHOOTOUT']);

/** Счёт для football-data.org: live без финализации — прочерк. */
export function getExternalMatchScoreView(
	gameScore: GameScore | null | undefined,
	matchStatus: string,
	finalized = false
): string {
	if (LIVE_STATUSES.has(normalizeMatchStatus(matchStatus)) && !finalized) {
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
