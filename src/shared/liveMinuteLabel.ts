import {
	FIRST_HALF_STOPPAGE_LABEL,
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
	return (
		trimmed === FIRST_HALF_STOPPAGE_LABEL
		|| trimmed === SECOND_HALF_STOPPAGE_LABEL
		|| trimmed.includes('+')
	);
}

export function formatLiveMinuteLabel(totalMinutes: number): string {
	if (totalMinutes > 90) {
		return SECOND_HALF_STOPPAGE_LABEL;
	}
	return `${totalMinutes}'`;
}
