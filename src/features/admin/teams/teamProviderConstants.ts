/** Canonical ids — keep in sync with backend {@code ExternalProviderIds}. */
export const MARATHONBET_PROVIDER = 'marathonbet';
export const MELBET_PROVIDER = 'melbet';
export const TWENTYFOUR_SCORE_PROVIDER = '24score.pro';
export const CHAMPIONAT_PROVIDER = 'championat.com';
export const EURO_FOOTBALL_PROVIDER = 'euro-football.ru';
export const SOCCER365_PROVIDER = 'soccer365.ru';
export const SPORTS_RU_PROVIDER = 'sports.ru';
export const FOOTBALL24_PROVIDER = 'football24.ua';
export const RUSCORE_PROVIDER = 'ruscore.ru';
export const FLASHSCORE_PROVIDER = 'flashscorekz.com';
export const FLASHSCORE_UA_PROVIDER = 'flashscore.com.ua';
export const LIVERESULT_PROVIDER = 'liveresult.ru';

/**
 * Still registered and selectable, but currently unreachable (JS challenge / SberID / etc.).
 * Do not use for team-form completeness or as a default pick. Can be re-enabled later.
 */
export const INACTIVE_EXTERNAL_PROVIDERS: ReadonlySet<string> = new Set([
	SOCCER365_PROVIDER,
	CHAMPIONAT_PROVIDER,
]);

export function isInactiveExternalProvider(provider: string | null | undefined): boolean {
	return !!provider && INACTIVE_EXTERNAL_PROVIDERS.has(provider);
}

/** Keep original order within each group: live first, inactive last. */
export function sortProvidersLiveFirst(providers: readonly string[]): string[] {
	const live: string[] = [];
	const inactive: string[] = [];
	for (const id of providers) {
		if (isInactiveExternalProvider(id)) {
			inactive.push(id);
		} else {
			live.push(id);
		}
	}
	return [...live, ...inactive];
}

export function firstLiveProvider(providers: readonly string[], fallback = ''): string {
	return providers.find((id) => !isInactiveExternalProvider(id)) ?? fallback;
}

/** Options for a select: live first; empty input uses fallback. */
export function listedProviders(providers: readonly string[], fallback: readonly string[]): string[] {
	const raw = providers.length > 0 ? providers : [...fallback];
	return sortProvidersLiveFirst(raw);
}

export function resolveSelectedProvider(options: readonly string[], current: string): string {
	if (current && options.includes(current)) {
		return current;
	}
	return firstLiveProvider(options, options[0] ?? '');
}
