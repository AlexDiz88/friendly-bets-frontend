/**
 * Curated IANA timezones — must match backend UserTimeZones.SUPPORTED_TIMEZONES.
 * One representative per distinct offset ruleset (incl. DST), sorted by UTC offset ascending.
 * No aliases / silent remapping of unknown IDs.
 */
export const DEFAULT_USER_TIMEZONE = 'Europe/Berlin';

export const SUPPORTED_USER_TIMEZONES: readonly string[] = [
	'America/Los_Angeles', // UTC-8 / UTC-7
	'America/Denver', // UTC-7 / UTC-6
	'America/Chicago', // UTC-6 / UTC-5
	'America/Mexico_City', // UTC-6 (no DST)
	'America/New_York', // UTC-5 / UTC-4
	'America/Sao_Paulo', // UTC-3 (no DST)
	'Atlantic/Reykjavik', // UTC+0 (no DST)
	'Europe/London', // UTC+0 / UTC+1
	'Europe/Berlin', // UTC+1 / UTC+2 (default)
	'Europe/Kyiv', // UTC+2 / UTC+3
	'Europe/Moscow', // UTC+3 (no DST)
	'Asia/Tbilisi', // UTC+4 (no DST)
	'Asia/Yekaterinburg', // UTC+5 (no DST)
	'Asia/Kolkata', // UTC+5:30
	'Asia/Novosibirsk', // UTC+7
	'Asia/Shanghai', // UTC+8
	'Asia/Tokyo', // UTC+9
	'Asia/Vladivostok', // UTC+10
	'Australia/Sydney', // UTC+10 / UTC+11
	'Pacific/Auckland', // UTC+12 / UTC+13
] as const;

const SUPPORTED_SET = new Set<string>(SUPPORTED_USER_TIMEZONES);

export function isSupportedUserTimeZone(timezone: string | null | undefined): boolean {
	return !!timezone && SUPPORTED_SET.has(timezone.trim());
}

export function resolveUserTimeZone(timezone: string | null | undefined): string {
	if (timezone && SUPPORTED_SET.has(timezone.trim())) {
		return timezone.trim();
	}
	return DEFAULT_USER_TIMEZONE;
}

/** e.g. "UTC+1" / "UTC+2" for current DST at `atMs` (default now). */
export function formatUtcOffsetLabel(timeZone: string, atMs: number = Date.now()): string {
	try {
		const parts = new Intl.DateTimeFormat('en-US', {
			timeZone,
			timeZoneName: 'shortOffset',
		}).formatToParts(new Date(atMs));
		const raw = parts.find((p) => p.type === 'timeZoneName')?.value ?? 'UTC';
		return raw.replace(/^GMT/i, 'UTC');
	} catch {
		return 'UTC';
	}
}

/** IANA city segment for i18n: Europe/Berlin → Berlin, America/Mexico_City → Mexico_City */
export function timeZoneCityI18nKey(timeZone: string): string {
	const slash = timeZone.lastIndexOf('/');
	const raw = slash >= 0 ? timeZone.slice(slash + 1) : timeZone;
	return `timezoneCities.${raw}`;
}

/** City label key segment: Europe/Berlin → Berlin (English fallback id) */
export function timeZoneCityKey(timeZone: string): string {
	const slash = timeZone.lastIndexOf('/');
	const raw = slash >= 0 ? timeZone.slice(slash + 1) : timeZone;
	return raw.replace(/_/g, ' ');
}
