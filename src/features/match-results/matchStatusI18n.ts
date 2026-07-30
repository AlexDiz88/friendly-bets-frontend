import { TFunction } from 'i18next';

/** Канонические статусы матча; PAUSE/HALFTIME — устаревшие алиасы */
const LEGACY_STATUS_MAP: Record<string, string> = {
	PAUSE: 'PAUSED',
	HALFTIME: 'PAUSED',
	LIVE: 'IN_PLAY',
	CANCELLED: 'CANCELED',
};

export function normalizeMatchStatus(status: string): string {
	return LEGACY_STATUS_MAP[status] ?? status;
}

const NOT_STARTED_STATUSES = new Set(['SCHEDULED', 'TIMED']);

/** Матч ещё не начался (нет kick-off). */
export function isMatchNotStarted(status: string): boolean {
	return NOT_STARTED_STATUSES.has(normalizeMatchStatus(status));
}

/** Перерыв (тайм-аут, halftime) — минуту не показываем. */
export function isMatchBreakStatus(status: string): boolean {
	return normalizeMatchStatus(status) === 'PAUSED';
}

/** Серия пенальти — вместо минуты показываем статус. */
export function isPenaltyShootoutStatus(status: string): boolean {
	return normalizeMatchStatus(status) === 'PENALTY_SHOOTOUT';
}

/** Статусы матча → ключ i18n `matchStatus.*` */
export function translateMatchStatus(status: string, t: TFunction): string {
	const normalized = normalizeMatchStatus(status);
	const key = `matchStatus.${normalized}`;
	const translated = t(key);
	return translated === key ? status : translated;
}

export type MatchStatusChipColor = 'success' | 'warning' | 'default' | 'error';

export function getMatchStatusChipColor(status: string): MatchStatusChipColor {
	switch (normalizeMatchStatus(status)) {
		case 'FINISHED':
		case 'AWARDED':
			return 'success';
		case 'IN_PLAY':
		case 'PAUSED':
		case 'EXTRA_TIME':
		case 'PENALTY_SHOOTOUT':
			return 'warning';
		case 'CANCELLED':
		case 'CANCELED':
			return 'error';
		default:
			return 'default';
	}
}
