import { t } from 'i18next';
import GameScore from '../../features/bets/types/GameScore';
import { ValidationResult } from '../../features/bets/types/ValidationResult';

export const removeUnnecessarySymbols = (str: string): string => {
	if (!str) {
		return '';
	}
	str = str
		.trim()
		.replace(/[$!"№%?(){}\]§&+=]/g, '')
		.replace(/[.*;_/-]/g, ':')
		.replace(/:+/g, ':')
		.replace(/[,]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	return str;
};

const parseScorePart = (score: string): { home: number; away: number } | null => {
	const parts = score.split(':');
	if (parts.length !== 2) {
		return null;
	}

	const [homeStr, awayStr] = parts;

	if (
		!homeStr ||
		!awayStr ||
		(homeStr.length > 1 && homeStr.startsWith('0')) ||
		(awayStr.length > 1 && awayStr.startsWith('0'))
	) {
		return null;
	}

	const home = Number(homeStr);
	const away = Number(awayStr);

	if (isNaN(home) || isNaN(away) || home > 50 || away > 50) {
		return null;
	}

	return { home, away };
};

const isGameScoreValid = (gameScore: string): boolean => {
	const gameScoreParts: string[] = gameScore.split(' ');

	if (gameScoreParts.length >= 2 && gameScoreParts.length <= 4) {
		const fullTimeScore = parseScorePart(gameScoreParts[0]);
		const firstTimeScore = parseScorePart(gameScoreParts[1]);
		if (!fullTimeScore || !firstTimeScore) {
			return false;
		}

		// Количество голов в 1 тайме не может быть больше голов за весь матч
		if (fullTimeScore.home < firstTimeScore.home || fullTimeScore.away < firstTimeScore.away) {
			return false;
		}

		if (gameScoreParts.length === 2) {
			return true;
		}

		const overTimeScore = parseScorePart(gameScoreParts[2]);
		if (!overTimeScore) {
			return false;
		}

		if (gameScoreParts.length === 3) {
			// Если нет пенальти - в дополнительное время не может быть ничьи
			return overTimeScore.home !== overTimeScore.away;
		}

		if (gameScoreParts.length === 4) {
			// Если есть пенальти - должна быть ничья в дополнительное время
			if (overTimeScore.home !== overTimeScore.away) {
				return false;
			}

			const penaltyScore = parseScorePart(gameScoreParts[3]);

			if (!penaltyScore) {
				return false;
			}

			// В серии пенальти не может быть ничьи
			return penaltyScore.home !== penaltyScore.away;
		}
	}

	return false;
};

export const gameScoreInputStringValidation = (gameScore: string | undefined): string => {
	if (!gameScore || gameScore === '') {
		return t('notSpecified');
	}

	const cleanedGameScore = removeUnnecessarySymbols(gameScore);
	if (isGameScoreValid(cleanedGameScore)) {
		return cleanedGameScore;
	}

	return t('error.incorrectGameResult');
};

// main function
export const transformToGameResult = (gameScoreInput: string): GameScore => {
	const result: GameScore = {
		fullTime: null,
		firstTime: null,
		overTime: null,
		penalty: null,
	};

	const cleanedGameScore = removeUnnecessarySymbols(gameScoreInput);
	if (!isGameScoreValid(cleanedGameScore)) {
		return result;
	}

	const gameScoreParts: string[] = cleanedGameScore.split(' ');
	if (gameScoreParts.length >= 2 || gameScoreParts.length <= 4) {
		if (gameScoreParts.length > 1) {
			result.fullTime = gameScoreParts[0];
			result.firstTime = gameScoreParts[1];
		}
		if (gameScoreParts.length > 2) {
			result.overTime = gameScoreParts[2];
		}
		if (gameScoreParts.length > 3) {
			result.penalty = gameScoreParts[3];
		}
	}
	return result;
};

// function for transform GameResult into good-looking view
export const getGameResultView = (gameRes: GameScore | undefined, isFullView = true): string => {
	if (!gameRes || !gameRes.fullTime || !gameRes.firstTime) {
		return t('notSpecified');
	}

	let result = `${gameRes.fullTime} (${gameRes.firstTime})`;

	if (gameRes.overTime || gameRes.penalty) {
		const otPart = gameRes.overTime
			? isFullView
				? `${t('ot')}${gameRes.overTime}`
				: gameRes.overTime
			: '';
		const penaltyPart = gameRes.penalty
			? isFullView
				? `${t('pen')}${gameRes.penalty}`
				: gameRes.penalty
			: '';

		result += gameRes.penalty ? ` [${otPart} ${penaltyPart}]` : ` [${otPart}]`;
	}

	return result;
};

export const convertGameResultToString = (gameResult: GameScore | undefined): string => {
	if (!gameResult) {
		return t('notSpecified');
	}
	if (!gameResult.fullTime || !gameResult.firstTime) {
		return t('error.incorrectGameResult');
	}

	let res = `${gameResult.fullTime} ${gameResult.firstTime}`;

	if (gameResult.overTime) {
		res += ` ${gameResult.overTime}`;
	}
	if (gameResult.penalty) {
		res += ` ${gameResult.penalty}`;
	}

	return res.trim();
};

export const parseScore = (score: string | null): [number, number] => {
	if (!score) return [0, 0];
	const [home, away] = score.split(':').map(Number);
	return [home || 0, away || 0];
};

export function validateGameResult(result: GameScore): ValidationResult {
	const errors: ValidationResult['errors'] = {};
	const [ftH, ftA] = parseScore(result.fullTime);
	const [htH, htA] = parseScore(result.firstTime);
	const [otH, otA] = parseScore(result.overTime);
	const [penH, penA] = parseScore(result.penalty);

	// 1. Half-time goals can't exceed full-time
	if (htH > ftH) errors.fullTime = 'Голы хозяев: 1й тайм > Осн.время';
	if (htA > ftA) errors.fullTime = 'Голы гостей: 1й тайм > Осн.время';

	// 2. Penalty allowed only if overtime is a draw
	if (result.penalty && result.overTime && otH !== otA) {
		errors.penalty = 'Пенальти возможны, только если ОТ закончился вничью';
	}

	// 3. Penalty goal diff max 3
	if (result.penalty && Math.abs(penH - penA) > 3) {
		errors.penalty = 'Разница мячей в серии пенальти больше 3';
	}

	// 4. Penalty can't be draw
	if (result.penalty && penH === penA) {
		errors.penalty = 'Серия пенальти не может закончится вничью';
	}

	return {
		valid: Object.keys(errors).length === 0,
		errors,
	};
}
