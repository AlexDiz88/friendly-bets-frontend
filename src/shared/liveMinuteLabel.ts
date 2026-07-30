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

/**
 * Клиентский +1 мин между sync.
 * На границе тайма → метка добавленного времени (45+/90+/105+/120+), иначе обычная минута.
 * Важно: 106–119 не схлопывать в 105+ (это валидные минуты 2-го тайма ОТ).
 */
export function formatIncrementedLiveMinute(previousBase: number): string {
	if (previousBase === 45) {
		return FIRST_HALF_STOPPAGE_LABEL;
	}
	if (previousBase === 90) {
		return SECOND_HALF_STOPPAGE_LABEL;
	}
	if (previousBase === 105) {
		return OT_FIRST_HALF_STOPPAGE_LABEL;
	}
	// 119' → 120+ (конец 2-го тайма ОТ / добавленное время)
	if (previousBase >= 119) {
		return OT_SECOND_HALF_STOPPAGE_LABEL;
	}
	return `${previousBase + 1}'`;
}
