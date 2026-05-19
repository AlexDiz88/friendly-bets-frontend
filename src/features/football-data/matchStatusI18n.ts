import { TFunction } from 'i18next';

/** Статусы матча football-data.org → ключ i18n `matchStatus.*` */
export function translateMatchStatus(status: string, t: TFunction): string {
	const key = `matchStatus.${status}`;
	const translated = t(key);
	return translated === key ? status : translated;
}
