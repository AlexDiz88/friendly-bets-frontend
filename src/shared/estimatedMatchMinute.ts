export const MATCH_FIRST_HALF_MIN = 45;
export const MATCH_AVG_ADDED_TIME_MIN = 3;
export const MATCH_HALFTIME_BREAK_MIN = 15;

const SECOND_HALF_START_ELAPSED =
	MATCH_FIRST_HALF_MIN + MATCH_AVG_ADDED_TIME_MIN + MATCH_HALFTIME_BREAK_MIN;

/** Верхняя граница elapsed (мин), внутри которой матч ещё может идти (~90' + добавленное). */
export const MATCH_LIVE_WINDOW_ELAPSED_MAX =
	SECOND_HALF_START_ELAPSED + MATCH_FIRST_HALF_MIN + MATCH_AVG_ADDED_TIME_MIN;

export type EstimatedMatchMinute =
	| { kind: 'not_started' }
	| { kind: 'minute'; label: string }
	| { kind: 'halftime' };

/** Целые минуты с момента пуска (округление вниз). */
export function elapsedMinutesSinceKickoff(kickoffUtcMs: number, nowMs: number): number {
	return Math.floor((nowMs - kickoffUtcMs) / 60_000);
}

export function isMatchLikelyLive(kickoffUtcMs: number, nowMs: number): boolean {
	const elapsed = elapsedMinutesSinceKickoff(kickoffUtcMs, nowMs);
	return elapsed >= 0 && elapsed <= MATCH_LIVE_WINDOW_ELAPSED_MAX;
}

/**
 * Примерная минута матча по времени пуска (без внешних live-данных).
 * Учитывает ~3 мин добавленного времени к каждому тайму и перерыв 15 мин.
 */
export function getEstimatedMatchMinute(
	kickoffUtcMs: number,
	nowMs: number
): EstimatedMatchMinute {
	const elapsed = elapsedMinutesSinceKickoff(kickoffUtcMs, nowMs);
	if (elapsed > MATCH_LIVE_WINDOW_ELAPSED_MAX) {
		return { kind: 'not_started' };
	}
	if (elapsed < 0) {
		return { kind: 'not_started' };
	}
	if (elapsed <= MATCH_FIRST_HALF_MIN) {
		return { kind: 'minute', label: `${elapsed}'` };
	}
	if (elapsed <= MATCH_FIRST_HALF_MIN + MATCH_AVG_ADDED_TIME_MIN) {
		return { kind: 'minute', label: "45+'" };
	}
	if (elapsed <= SECOND_HALF_START_ELAPSED) {
		return { kind: 'halftime' };
	}
	const matchMinute = elapsed - SECOND_HALF_START_ELAPSED + MATCH_FIRST_HALF_MIN;
	if (matchMinute > MATCH_FIRST_HALF_MIN * 2) {
		return { kind: 'minute', label: "90+'" };
	}
	return { kind: 'minute', label: `${matchMinute}'` };
}
