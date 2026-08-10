import type MatchGoalEvent from './types/MatchGoalEvent';

export type MatchEventsPeriod = 'H1' | 'H2' | 'OT' | 'PEN';

export type MatchTimelineItem =
	| { kind: 'event'; event: MatchGoalEvent; sortKey: number }
	| { kind: 'addedTime'; minutes: number; sortKey: number };

export type MatchEventsPeriodBlock = {
	period: MatchEventsPeriod;
	items: MatchTimelineItem[];
};

function baseMinute(event: MatchGoalEvent): number {
	const label = event.minute?.trim();
	if (label) {
		const plus = /^(\d{1,3})\s*\+/.exec(label);
		if (plus) {
			return Number(plus[1]);
		}
		const m = /(\d{1,3})/.exec(label);
		if (m) {
			return Number(m[1]);
		}
	}
	if (event.minuteNumber != null && event.minuteNumber >= 0) {
		return event.minuteNumber;
	}
	return 999;
}

function sortKeyForEvent(event: MatchGoalEvent): number {
	const base = baseMinute(event);
	const label = event.minute?.trim() ?? '';
	const injury = /\+(\d+)/.exec(label);
	const injuryN = injury ? Number(injury[1]) : 0;
	return base * 100 + injuryN;
}

export function isMatchTimelineEvent(event: MatchGoalEvent | null | undefined): boolean {
	if (!event) {
		return false;
	}
	if (Boolean(event.redCard) || Boolean(event.missed) || Boolean(event.penaltyShootout)) {
		return true;
	}
	// Regular / pen / own goal — anything with a player that is not a pure skip
	return Boolean(event.playerName?.trim() || event.minute?.trim());
}

export function periodForMatchEvent(event: MatchGoalEvent): MatchEventsPeriod {
	if (Boolean(event.penaltyShootout)) {
		return 'PEN';
	}
	const base = baseMinute(event);
	if (base <= 45) {
		return 'H1';
	}
	if (base <= 90) {
		return 'H2';
	}
	return 'OT';
}

/**
 * Build H1 / H2 / OT / PEN blocks. Empty OT/PEN omitted; H1/H2 omitted if no events and no added time.
 */
export function buildMatchEventsPeriods(
	events: MatchGoalEvent[] | null | undefined,
	addedTimeFirstHalf?: number | null,
	addedTimeSecondHalf?: number | null
): MatchEventsPeriodBlock[] {
	const buckets: Record<MatchEventsPeriod, MatchTimelineItem[]> = {
		H1: [],
		H2: [],
		OT: [],
		PEN: [],
	};

	for (const event of events ?? []) {
		if (!isMatchTimelineEvent(event)) {
			continue;
		}
		const period = periodForMatchEvent(event);
		buckets[period].push({ kind: 'event', event, sortKey: sortKeyForEvent(event) });
	}

	const pushAdded = (period: 'H1' | 'H2', minutes: number | null | undefined): void => {
		if (minutes == null || minutes <= 0) {
			return;
		}
		// After period events (injury time is conceptually end of half)
		const sortKey = period === 'H1' ? 45 * 100 + 99 : 90 * 100 + 99;
		buckets[period].push({ kind: 'addedTime', minutes, sortKey });
	};
	pushAdded('H1', addedTimeFirstHalf);
	pushAdded('H2', addedTimeSecondHalf);

	const order: MatchEventsPeriod[] = ['H1', 'H2', 'OT', 'PEN'];
	const result: MatchEventsPeriodBlock[] = [];
	for (const period of order) {
		const items = buckets[period].slice().sort((a, b) => a.sortKey - b.sortKey);
		if (items.length === 0) {
			continue;
		}
		result.push({ period, items });
	}
	return result;
}

export function formatMatchEventMinute(event: MatchGoalEvent): string {
	const raw = event.minute?.trim();
	if (!raw) {
		return '—';
	}
	return raw.endsWith("'") ? raw : `${raw}'`;
}
