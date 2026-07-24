import { WC26_TEAMS, type Wc26TeamId } from './wc26Teams';

export function resolveWc26TeamId(fifaCode: string | null | undefined): Wc26TeamId | null {
	if (!fifaCode) {
		return null;
	}
	const upper = fifaCode.toUpperCase();
	return upper in WC26_TEAMS ? (upper as Wc26TeamId) : null;
}

export function formatGoalsLine(goalsFor: number, goalsAgainst: number): string {
	return `${goalsFor}:${goalsAgainst}`;
}

export function formatGoalDifference(goalDifference: number): string {
	if (goalDifference > 0) {
		return `+${goalDifference}`;
	}
	return String(goalDifference);
}

export function bracketScoreLabel(
	homeScore?: number | null,
	awayScore?: number | null,
	homePen?: number | null,
	awayPen?: number | null
): string | null {
	if (homeScore == null || awayScore == null) {
		return null;
	}
	if (homePen != null && awayPen != null && homePen !== awayPen) {
		return `${homeScore}:${awayScore} (${homePen}:${awayPen})`;
	}
	return `${homeScore}:${awayScore}`;
}

/** Placeholder вроде «2A» → i18n-ключ или текст. */
export function bracketPlaceholderLabel(code: string | null | undefined): string | null {
	if (!code) {
		return null;
	}
	return code.trim();
}
