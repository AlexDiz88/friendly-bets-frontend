/** ISO 3166-1 alpha-2 / flagcdn-суффикс для изображения флага. */
export function flagImageUrl(isoFlag: string): string {
	return `https://flagcdn.com/w80/${isoFlag.toLowerCase()}.png`;
}
