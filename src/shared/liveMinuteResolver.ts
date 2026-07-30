import { extraTimeAllowed } from './liveMatchExtraTimePolicy';

export const FIRST_HALF_STOPPAGE_LABEL = '45+';
export const SECOND_HALF_STOPPAGE_LABEL = '90+';
export const OT_FIRST_HALF_STOPPAGE_LABEL = '105+';
export const OT_SECOND_HALF_STOPPAGE_LABEL = '120+';

const FIRST_HALF_MIN = 45;
const OT_FIRST_HALF_END_MINUTE = 105;
const OT_SECOND_HALF_END_MINUTE = 120;
const SECOND_HALF_START_ELAPSED_MIN = 60;
const REGULATION_END_ELAPSED_MIN = 125;
const OT_SECOND_HALF_START_ELAPSED_MIN = 148;
const MINUTE_PATTERN = /^(\d{1,3})(?:\+(\d{1,2}))?\s*'?$/;

export type LiveMinuteContext = {
	kickoffUtcMs?: number;
	leagueCode?: string | null;
	slotId?: string | null;
	matchStatus?: string | null;
	nowMs?: number;
};

export function stoppageLabelForBaseMinute(baseMinute: number): string {
	if (baseMinute <= FIRST_HALF_MIN) {
		return FIRST_HALF_STOPPAGE_LABEL;
	}
	if (baseMinute <= FIRST_HALF_MIN * 2) {
		return SECOND_HALF_STOPPAGE_LABEL;
	}
	if (baseMinute <= OT_FIRST_HALF_END_MINUTE) {
		return OT_FIRST_HALF_STOPPAGE_LABEL;
	}
	return OT_SECOND_HALF_STOPPAGE_LABEL;
}

export function resolveLiveMinuteLabel(
	rawMinuteLabel: string | null | undefined,
	context: LiveMinuteContext = {}
): string | null {
	if (!rawMinuteLabel?.trim()) {
		return null;
	}
	const otAllowed = extraTimeAllowed(
		context.leagueCode,
		context.slotId,
		context.matchStatus
	);
	const nowMs = context.nowMs ?? Date.now();
	const kickoffUtcMs = context.kickoffUtcMs ?? 0;
	const trimmed = rawMinuteLabel.trim();
	const match = MINUTE_PATTERN.exec(trimmed);
	if (!match) {
		if (isCanonicalStoppageLabel(trimmed)) {
			return trimmed;
		}
		return stripTrailingApostrophe(trimmed);
	}
	const baseMinute = Number.parseInt(match[1], 10);
	const addedPart = match[2];
	if (addedPart != null || trimmed.includes('+')) {
		return stoppageLabelForBaseMinute(baseMinute);
	}
	return resolvePlainMinute(baseMinute, kickoffUtcMs, nowMs, otAllowed);
}

function resolvePlainMinute(
	apiMinute: number,
	kickoffUtcMs: number,
	nowMs: number,
	otAllowed: boolean
): string {
	if (apiMinute <= 0) {
		return '';
	}
	const elapsedMin = elapsedMinutes(kickoffUtcMs, nowMs);

	if (apiMinute > FIRST_HALF_MIN && isLikelyFirstHalfStoppage(apiMinute, elapsedMin)) {
		return FIRST_HALF_STOPPAGE_LABEL;
	}
	if (apiMinute > OT_SECOND_HALF_END_MINUTE) {
		return otAllowed && elapsedMin >= REGULATION_END_ELAPSED_MIN
			? OT_SECOND_HALF_STOPPAGE_LABEL
			: SECOND_HALF_STOPPAGE_LABEL;
	}
	if (apiMinute > OT_FIRST_HALF_END_MINUTE) {
		if (!otAllowed || elapsedMin < REGULATION_END_ELAPSED_MIN) {
			return SECOND_HALF_STOPPAGE_LABEL;
		}
		if (elapsedMin < OT_SECOND_HALF_START_ELAPSED_MIN) {
			return OT_FIRST_HALF_STOPPAGE_LABEL;
		}
		return `${apiMinute}`;
	}
	if (apiMinute > FIRST_HALF_MIN * 2) {
		if (!otAllowed || elapsedMin < REGULATION_END_ELAPSED_MIN) {
			return SECOND_HALF_STOPPAGE_LABEL;
		}
		return `${apiMinute}`;
	}
	return `${apiMinute}`;
}

function stripTrailingApostrophe(value: string): string {
	return value.endsWith("'") ? value.slice(0, -1) : value;
}

function isLikelyFirstHalfStoppage(apiMinute: number, elapsedMin: number): boolean {
	if (apiMinute <= FIRST_HALF_MIN) {
		return false;
	}
	if (elapsedMin <= 0) {
		return apiMinute <= FIRST_HALF_MIN + 5;
	}
	return elapsedMin < SECOND_HALF_START_ELAPSED_MIN;
}

function elapsedMinutes(kickoffUtcMs: number, nowMs: number): number {
	if (kickoffUtcMs <= 0) {
		return 0;
	}
	return Math.max(0, Math.floor((nowMs - kickoffUtcMs) / 60_000));
}

export function isCanonicalStoppageLabel(label: string): boolean {
	return (
		label === FIRST_HALF_STOPPAGE_LABEL
		|| label === SECOND_HALF_STOPPAGE_LABEL
		|| label === OT_FIRST_HALF_STOPPAGE_LABEL
		|| label === OT_SECOND_HALF_STOPPAGE_LABEL
	);
}

/** UI: 45+ → 45+', 72' → 72' */
export function formatLiveMinuteForDisplay(label: string | null | undefined): string | null {
	if (!label?.trim()) {
		return null;
	}
	const trimmed = label.trim();
	if (trimmed.endsWith("'")) {
		return trimmed;
	}
	if (trimmed.endsWith('+')) {
		return `${trimmed}'`;
	}
	return `${trimmed}'`;
}
