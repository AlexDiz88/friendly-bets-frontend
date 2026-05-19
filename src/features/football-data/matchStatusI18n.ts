import { TFunction } from 'i18next';

/** football-data.org v4; PAUSE/HALFTIME — устаревшие алиасы */
const LEGACY_STATUS_MAP: Record<string, string> = {
	PAUSE: 'PAUSED',
	HALFTIME: 'PAUSED',
};

export function normalizeMatchStatus(status: string): string {
	return LEGACY_STATUS_MAP[status] ?? status;
}

const NOT_STARTED_STATUSES = new Set(['SCHEDULED', 'TIMED']);

/** Матч ещё не начался (нет kick-off). */
export function isMatchNotStarted(status: string): boolean {
	return NOT_STARTED_STATUSES.has(normalizeMatchStatus(status));
}

export function isMatchdayNotStarted(matches: { status: string }[]): boolean {
	return matches.length > 0 && matches.every((m) => isMatchNotStarted(m.status));
}

/** Статусы матча football-data.org → ключ i18n `matchStatus.*` */
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
			return 'error';
		default:
			return 'default';
	}
}
