/** Кэф на экране «Выбор ставки»: 2 знака, 3 — если третий десятичный ≠ 0. */
export function formatPickOdds(value: number | string): string {
	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (trimmed === '' || trimmed === '—') {
			return trimmed || value;
		}
		const parsed = Number.parseFloat(trimmed.replace(',', '.'));
		if (Number.isNaN(parsed)) {
			return value;
		}
		return formatPickOdds(parsed);
	}

	if (!Number.isFinite(value)) {
		return String(value);
	}

	const fixed3 = value.toFixed(3);
	if (fixed3.charAt(fixed3.length - 1) !== '0') {
		return fixed3;
	}
	return value.toFixed(2);
}
