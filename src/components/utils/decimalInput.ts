/** Допустимый ввод: цифры и один разделитель , или . */
const DECIMAL_INPUT_PATTERN = /^[0-9]*[.,]?[0-9]*$/;

const INTEGER_INPUT_PATTERN = /^[0-9]*$/;

export function isAllowedDecimalInput(value: string): boolean {
	return value === '' || DECIMAL_INPUT_PATTERN.test(value);
}

export function isAllowedIntegerInput(value: string): boolean {
	return value === '' || INTEGER_INPUT_PATTERN.test(value);
}

export function parseDecimalInput(value: string): number {
	return Number(value.trim().replace(',', '.'));
}

/** Кэф > 1 (как на бэкенде в BetUtils.checkBetOdds) */
export function isValidBetOddsInput(value: string): boolean {
	const trimmed = value.trim();
	if (!trimmed || !DECIMAL_INPUT_PATTERN.test(trimmed)) {
		return false;
	}
	const n = parseDecimalInput(trimmed);
	return Number.isFinite(n) && n > 1;
}

export function isValidBetSizeInput(value: string): boolean {
	const trimmed = value.trim();
	if (!trimmed || !INTEGER_INPUT_PATTERN.test(trimmed)) {
		return false;
	}
	const n = Number(trimmed);
	return Number.isInteger(n) && n > 0;
}
