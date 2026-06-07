import type { ExpandedMatchdaySlot } from '../../features/admin/tournament-formats/types/TournamentFormat';
import { buildMatchdaySlotsForLeague } from '../../features/football-data/competitionOptions';
import type { MatchdaySlot } from './types';

export function externalSlotsToMatchdaySlots(
	slots: { value: number; slotId?: string; label: string; kind: string }[]
): MatchdaySlot[] {
	return slots.map((s) => ({
		value: s.value,
		slotId: s.slotId ?? s.label,
		label: s.label,
		kind:
			s.kind === 'KNOCKOUT'
				? 'KNOCKOUT'
				: s.kind === 'GROUP'
					? 'GROUP'
					: 'REGULAR',
	}));
}

export function expandedSlotsToMatchdaySlots(slots: ExpandedMatchdaySlot[]): MatchdaySlot[] {
	return slots.map((s) => ({
		value: s.order,
		slotId: s.id,
		label: s.labelKey ?? s.id,
		kind: s.kind === 'KNOCKOUT' ? 'KNOCKOUT' : 'GROUP',
	}));
}

export function resolveMatchdaySlotsForBetInput(
	matchdaySlots: ExpandedMatchdaySlot[] | undefined,
	leagueCode: string | undefined
): MatchdaySlot[] {
	if (matchdaySlots?.length) {
		return expandedSlotsToMatchdaySlots(matchdaySlots);
	}
	if (leagueCode) {
		return buildMatchdaySlotsForLeague(leagueCode);
	}
	return [];
}

export function matchDayStringToSlotValue(matchDay: string, slots: MatchdaySlot[]): number {
	const trimmed = matchDay.trim();
	const bySlotId = slots.find((s) => s.slotId === trimmed);
	if (bySlotId) {
		return bySlotId.value;
	}
	const parsed = Number.parseInt(trimmed, 10);
	if (!Number.isNaN(parsed) && slots.some((s) => s.value === parsed)) {
		return parsed;
	}
	return slots[0]?.value ?? 1;
}

export function slotValueToMatchDayString(value: number, slots: MatchdaySlot[]): string {
	const slot = slots.find((s) => s.value === value);
	return slot?.slotId ?? String(value);
}
