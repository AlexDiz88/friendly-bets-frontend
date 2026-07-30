import {
	FIRST_HALF_STOPPAGE_LABEL,
	isCanonicalStoppageLabel,
	OT_FIRST_HALF_STOPPAGE_LABEL,
	OT_SECOND_HALF_STOPPAGE_LABEL,
	SECOND_HALF_STOPPAGE_LABEL,
} from './liveMinuteResolver';

/** Разбор «72'», «90+2'», «45+» → число минут матча. */
export function parseLiveMinuteBase(label: string): number | null {
	const trimmed = label.trim();
	if (trimmed === FIRST_HALF_STOPPAGE_LABEL) {
		return 45;
	}
	if (trimmed === SECOND_HALF_STOPPAGE_LABEL) {
		return 90;
	}
	if (trimmed === OT_FIRST_HALF_STOPPAGE_LABEL) {
		return 105;
	}
	if (trimmed === OT_SECOND_HALF_STOPPAGE_LABEL) {
		return 120;
	}
	const match = /^(\d+)(?:\+(\d+))?'?$/.exec(trimmed);
	if (!match) {
		return null;
	}
	const base = Number.parseInt(match[1], 10);
	const added = match[2] ? Number.parseInt(match[2], 10) : 0;
	return base + added;
}

export function isStoppageMinuteLabel(label: string): boolean {
	const trimmed = label.trim();
	return isCanonicalStoppageLabel(trimmed) || trimmed.includes('+');
}

export function formatLiveMinuteLabel(totalMinutes: number): string {
	if (totalMinutes > 120) {
		return OT_SECOND_HALF_STOPPAGE_LABEL;
	}
	if (totalMinutes > 105) {
		return OT_FIRST_HALF_STOPPAGE_LABEL;
	}
	if (totalMinutes > 90) {
		return SECOND_HALF_STOPPAGE_LABEL;
	}
	return `${totalMinutes}'`;
}
