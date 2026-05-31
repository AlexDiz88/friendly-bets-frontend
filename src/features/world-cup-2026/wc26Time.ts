import { WC26_VENUE_TIMEZONE } from './wc26Venues';

const BERLIN = 'Europe/Berlin';

export function wc26DateLocale(language: string): string {
	if (language === 'de') return 'de-DE';
	if (language === 'en') return 'en-US';
	return 'ru-RU';
}

/** Локальный пуск на стадионе → дата/время по Германии (CEST). */
export function kickoffToGerman(
	date: string,
	timeLocal: string,
	venueKey: string
): { date: string; time: string } {
	const tz = WC26_VENUE_TIMEZONE[venueKey] ?? 'UTC';
	const [y, m, d] = date.split('-').map(Number);
	const [hour, minute] = timeLocal.split(':').map(Number);
	const utcMs = localPartsToUtcMs(y, m, d, hour, minute, tz);

	const time = new Intl.DateTimeFormat('de-DE', {
		timeZone: BERLIN,
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	}).format(utcMs);

	const dateBerlin = new Intl.DateTimeFormat('en-CA', {
		timeZone: BERLIN,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(utcMs);

	return { date: dateBerlin, time };
}

/** Короткая дата по Berlin из UTC (для карточек результатов). */
export function formatBerlinDateFromUtc(utcDate: string | undefined, language: string): string {
	if (!utcDate) {
		return '—';
	}
	return new Intl.DateTimeFormat(wc26DateLocale(language), {
		timeZone: BERLIN,
		day: 'numeric',
		month: 'short',
	}).format(new Date(utcDate));
}

/** Короткая дата по Berlin из ISO-даты (YYYY-MM-DD). */
export function formatBerlinDateFromIsoDate(isoDate: string, language: string): string {
	const [y, m, d] = isoDate.split('-').map(Number);
	if (!y || !m || !d) {
		return '—';
	}
	return new Intl.DateTimeFormat(wc26DateLocale(language), {
		timeZone: BERLIN,
		day: 'numeric',
		month: 'short',
	}).format(new Date(Date.UTC(y, m - 1, d, 12, 0)));
}

function localPartsToUtcMs(
	year: number,
	month: number,
	day: number,
	hour: number,
	minute: number,
	timeZone: string
): number {
	let ms = Date.UTC(year, month - 1, day, hour, minute);
	for (let i = 0; i < 4; i += 1) {
		const parts = getZonedParts(ms, timeZone);
		const asUtc = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute);
		const wanted = Date.UTC(year, month - 1, day, hour, minute);
		ms += wanted - asUtc;
	}
	return ms;
}

function getZonedParts(
	utcMs: number,
	timeZone: string
): { year: number; month: number; day: number; hour: number; minute: number } {
	const fmt = new Intl.DateTimeFormat('en-US', {
		timeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
	});
	const map = Object.fromEntries(
		fmt.formatToParts(new Date(utcMs)).filter((p) => p.type !== 'literal').map((p) => [p.type, p.value])
	);
	return {
		year: Number(map.year),
		month: Number(map.month),
		day: Number(map.day),
		hour: Number(map.hour),
		minute: Number(map.minute),
	};
}
