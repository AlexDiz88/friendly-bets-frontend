/**
 * Backend сериализует LocalDateTime (UTC) без суффикса `Z`
 * (например "2026-06-11T18:00:00"), а `new Date(...)` трактует такую
 * строку как локальное время браузера. Этот парсер принудительно
 * интерпретирует строки без зоны как UTC.
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
