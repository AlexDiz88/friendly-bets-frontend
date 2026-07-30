export const FIRST_HALF_STOPPAGE_LABEL = '45+';
export const SECOND_HALF_STOPPAGE_LABEL = '90+';

const FIRST_HALF_MIN = 45;
const SECOND_HALF_START_ELAPSED_MIN = 60;
const MINUTE_PATTERN = /^(\d{1,3})(?:\+(\d{1,2}))?\s*'?$/;

export function stoppageLabelForBaseMinute(baseMinute: number): string {
	if (baseMinute <= FIRST_HALF_MIN) {
		return FIRST_HALF_STOPPAGE_LABEL;
	}
	return SECOND_HALF_STOPPAGE_LABEL;
}

export function resolveLiveMinuteLabel(
	rawMinuteLabel: string | null | undefined,
	kickoffUtcMs: number,
	nowMs = Date.now()
): string | null {
	if (!rawMinuteLabel?.trim()) {
		return null;
	}
	const trimmed = rawMinuteLabel.trim();
	const match = MINUTE_PATTERN.exec(trimmed);
	if (!match) {
		if (trimmed === FIRST_HALF_STOPPAGE_LABEL || trimmed === SECOND_HALF_STOPPAGE_LABEL) {
			return trimmed;
		}
		return trimmed.endsWith("'") ? trimmed : `${trimmed}'`;
	}
	const baseMinute = Number.parseInt(match[1], 10);
	const addedPart = match[2];
	if (addedPart != null || trimmed.includes('+')) {
		return stoppageLabelForBaseMinute(baseMinute);
	}
	if (baseMinute > FIRST_HALF_MIN && isLikelyFirstHalfStoppage(baseMinute, kickoffUtcMs, nowMs)) {
		return FIRST_HALF_STOPPAGE_LABEL;
	}
	if (baseMinute > FIRST_HALF_MIN * 2) {
		return SECOND_HALF_STOPPAGE_LABEL;
	}
	return `${baseMinute}'`;
}

function isLikelyFirstHalfStoppage(
	apiMinute: number,
	kickoffUtcMs: number,
	nowMs: number
): boolean {
	if (apiMinute <= FIRST_HALF_MIN) {
		return false;
	}
	if (kickoffUtcMs <= 0) {
		return apiMinute <= FIRST_HALF_MIN + 5;
	}
	const elapsedMin = Math.max(0, Math.floor((nowMs - kickoffUtcMs) / 60_000));
	return elapsedMin < SECOND_HALF_START_ELAPSED_MIN;
}
