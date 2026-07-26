import { parseUtcDate } from './utcDate';
import { DEFAULT_USER_TIMEZONE, resolveUserTimeZone } from './userTimeZones';

export type FormatUserDateTimeOptions = {
	timeZone?: string | null;
	locale?: string;
	dateStyle?: 'full' | 'long' | 'medium' | 'short';
	timeStyle?: 'full' | 'long' | 'medium' | 'short';
	/** Custom Intl options (overrides dateStyle/timeStyle when set). */
	options?: Intl.DateTimeFormatOptions;
};

function dateLocale(language?: string): string {
	if (language === 'de') return 'de-DE';
	if (language === 'en') return 'en-US';
	return 'ru-RU';
}

/**
 * Format a UTC Instant (ISO with Z, or legacy wall-clock without zone treated as UTC)
 * into the user's IANA timezone (default Europe/Berlin).
 */
export function formatInUserTimeZone(
	utcInput: string | number | Date | null | undefined,
	opts: FormatUserDateTimeOptions = {}
): string {
	const date =
		typeof utcInput === 'number'
			? new Date(utcInput)
			: utcInput instanceof Date
				? utcInput
				: parseUtcDate(typeof utcInput === 'string' ? utcInput : undefined);
	if (!date || Number.isNaN(date.getTime())) {
		return '—';
	}
	const timeZone = resolveUserTimeZone(opts.timeZone ?? DEFAULT_USER_TIMEZONE);
	const locale = opts.locale ?? dateLocale('ru');
	const formatOptions: Intl.DateTimeFormatOptions = opts.options ?? {
		dateStyle: opts.dateStyle ?? 'medium',
		timeStyle: opts.timeStyle ?? 'medium',
		timeZone,
	};
	if (!opts.options) {
		formatOptions.timeZone = timeZone;
	} else if (!formatOptions.timeZone) {
		formatOptions.timeZone = timeZone;
	}
	try {
		return new Intl.DateTimeFormat(locale, formatOptions).format(date);
	} catch {
		return '—';
	}
}

/** HH:mm in user timezone. */
export function formatUserTime(
	utcInput: string | number | Date | null | undefined,
	timeZone?: string | null,
	locale?: string
): string {
	return formatInUserTimeZone(utcInput, {
		timeZone,
		locale: dateLocale(locale),
		options: {
			timeZone: resolveUserTimeZone(timeZone),
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23',
		},
	});
}

/** Short date (day + short month) in user timezone. */
export function formatUserDate(
	utcInput: string | number | Date | null | undefined,
	timeZone?: string | null,
	locale?: string
): string {
	return formatInUserTimeZone(utcInput, {
		timeZone,
		locale: dateLocale(locale),
		options: {
			timeZone: resolveUserTimeZone(timeZone),
			day: 'numeric',
			month: 'short',
		},
	});
}

/** day short-month, HH:mm — match kickoffs / user-facing datetimes. */
export function formatUserDateTime(
	utcInput: string | number | Date | null | undefined,
	timeZone?: string | null,
	locale?: string
): string {
	return formatInUserTimeZone(utcInput, {
		timeZone,
		locale: dateLocale(locale),
		options: {
			timeZone: resolveUserTimeZone(timeZone),
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
			hourCycle: 'h23',
		},
	});
}

/** day short-month, HH:mm:ss — for monitoring / logs. */
export function formatUserDateTimeDetailed(
	utcInput: string | number | Date | null | undefined,
	timeZone?: string | null,
	locale?: string
): string {
	return formatInUserTimeZone(utcInput, {
		timeZone,
		locale: dateLocale(locale),
		options: {
			timeZone: resolveUserTimeZone(timeZone),
			day: '2-digit',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			hourCycle: 'h23',
		},
	});
}

export { resolveUserTimeZone, DEFAULT_USER_TIMEZONE };
