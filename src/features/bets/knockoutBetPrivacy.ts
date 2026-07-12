const PRIVACY_LEAGUES = new Set(['WC', 'EC', 'CL', 'LE']);
const PRIVACY_STAGES = new Set(['1/2', 'third_place', 'final']);

export function normalizeKnockoutStage(matchDay: string | undefined): string | null {
	if (!matchDay?.trim()) {
		return null;
	}
	let trimmed = matchDay.trim();
	if (/ \[\d+\]$/.test(trimmed)) {
		trimmed = trimmed.replace(/ \[\d+\]$/, '');
	} else if (/-s\d+$/.test(trimmed)) {
		trimmed = trimmed.replace(/-s\d+$/, '');
	}
	return trimmed;
}

export function isSensitiveKnockoutSlot(leagueCode: string | undefined, matchDay: string | undefined): boolean {
	if (!leagueCode || !PRIVACY_LEAGUES.has(leagueCode)) {
		return false;
	}
	const stage = normalizeKnockoutStage(matchDay);
	return stage != null && PRIVACY_STAGES.has(stage);
}

export function isBetDetailsHidden(bet: { betDetailsHidden?: boolean }): boolean {
	return bet.betDetailsHidden === true;
}
