const NEVER_EXTRA_TIME = new Set(['EPL', 'BL']);
const MAY_EXTRA_TIME = new Set(['CL', 'LE', 'WC', 'EC']);
const NUMERIC_SLOT = /^\d+$/;
const WC_GROUP_SLOT = /^\d+ \[\d+\]$/;
const KNOCKOUT_STAGE = /^(1\/\d+|1\/8|1\/4|1\/2|final|third_place|round_of_\d+)/i;

const WC_PLAYOFF_SLOTS = new Set([
	'1/16 [1]', '1/16 [2]', '1/16 [3]', '1/16 [4]', '1/16 [5]',
	'1/8 [1]', '1/8 [2]',
	'1/4', '1/2', 'third_place', 'final',
]);

export function normalizeSlotId(slotId?: string | null): string {
	if (!slotId?.trim()) {
		return '';
	}
	let trimmed = slotId.trim();
	if (/ \[\d+\]$/.test(trimmed)) {
		trimmed = trimmed.replace(/ \[\d+\]$/, '');
	} else if (/-s\d+$/.test(trimmed)) {
		trimmed = trimmed.replace(/-s\d+$/, '');
	}
	return trimmed;
}

export function isKnockoutSlot(slotId?: string | null): boolean {
	const id = normalizeSlotId(slotId);
	if (!id) {
		return false;
	}
	if (NUMERIC_SLOT.test(id) || WC_GROUP_SLOT.test(id)) {
		return false;
	}
	if (WC_PLAYOFF_SLOTS.has(slotId?.trim() ?? '')) {
		return true;
	}
	return KNOCKOUT_STAGE.test(id);
}

export function isExtraTimeStatus(matchStatus?: string | null): boolean {
	const normalized = (matchStatus ?? '').trim().toUpperCase();
	return normalized === 'EXTRA_TIME' || normalized === 'AET' || normalized === 'PENALTY_SHOOTOUT';
}

export function extraTimeAllowed(
	leagueCode?: string | null,
	slotId?: string | null,
	matchStatus?: string | null
): boolean {
	if (isExtraTimeStatus(matchStatus)) {
		return true;
	}
	const code = (leagueCode ?? '').trim().toUpperCase();
	if (!code || NEVER_EXTRA_TIME.has(code)) {
		return false;
	}
	if (!MAY_EXTRA_TIME.has(code)) {
		return false;
	}
	return isKnockoutSlot(slotId);
}
