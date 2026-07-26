/**
 * Backend сериализует Instant UTC как ISO-8601 с `Z`.
 * Legacy строки без зоны (например "2026-06-11T18:00:00") трактуются как UTC.
 * Для отображения в UI используй `userDateTime.ts` / `useFormatUserDateTime()`.
 */
const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/;

export function parseUtcDate(value: string | null | undefined): Date | null {
	if (!value) {
		return null;
	}
	const date = new Date(HAS_ZONE.test(value) ? value : `${value}Z`);
	return Number.isNaN(date.getTime()) ? null : date;
}

export function utcDateMs(value: string | null | undefined): number | null {
	return parseUtcDate(value)?.getTime() ?? null;
}
