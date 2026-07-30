const FIRST_HALF_MIN = 45;
const SECOND_HALF_START_ELAPSED_MIN = 60;
const MINUTE_PATTERN = /^(\d{1,3})(?:\+(\d{1,2}))?\s*'?$/;

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
		return trimmed.endsWith("'") ? trimmed : `${trimmed}'`;
	}
	const baseMinute = Number.parseInt(match[1], 10);
	const addedPart = match[2];
	if (addedPart) {
		return `${baseMinute}+${addedPart}'`;
	}
	if (baseMinute > FIRST_HALF_MIN && isLikelyFirstHalfStoppage(baseMinute, kickoffUtcMs, nowMs)) {
		return "45+'";
	}
	if (baseMinute > FIRST_HALF_MIN * 2) {
		return "90+'";
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
