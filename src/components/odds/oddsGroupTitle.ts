import { TFunction } from 'i18next';

/** Запасные подписи, если ключ ещё не подхватился из translation.json (hot reload). */
const FALLBACK_BY_KEY: Record<string, string> = {
	periodHandicap: 'Форы (по таймам)',
	firstHalfCorrectScore: '1й тайм',
	secondHalfCorrectScore: '2й тайм',
};

export function oddsGroupTitle(t: TFunction, groupKey: string): string {
	const i18nKey = `oddsDemo.groups.${groupKey}`;
	const translated = t(i18nKey);
	if (translated !== i18nKey && translated !== groupKey) {
		return translated;
	}
	return FALLBACK_BY_KEY[groupKey] ?? groupKey;
}
