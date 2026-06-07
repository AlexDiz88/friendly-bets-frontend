import type { ExpandedMatchdaySlot } from '../../features/admin/tournament-formats/types/TournamentFormat';
import { formatSlotIdLabel } from '../matchday/formatSlotLabel';
import type { MatchdaySlot } from '../matchday/types';

function expandedSlotKind(kind: ExpandedMatchdaySlot['kind']): MatchdaySlot['kind'] {
	if (kind === 'KNOCKOUT') {
		return 'KNOCKOUT';
	}
	if (kind === 'GROUP') {
		return 'GROUP';
	}
	return 'REGULAR';
}

export function formatMatchdaySlotLabel(slot: ExpandedMatchdaySlot): string {
	return formatSlotIdLabel(slot.id, expandedSlotKind(slot.kind));
}

export function resolveDefaultMatchDay(
	currentMatchDay: string | undefined,
	slots: ExpandedMatchdaySlot[] | undefined
): string {
	if (!slots?.length) {
		return currentMatchDay?.trim() || '1';
	}
	const stored = currentMatchDay?.trim() ?? '';
	if (stored && slots.some((s) => s.id === stored)) {
		return stored;
	}
	const numericOrder = Number.parseInt(stored, 10);
	if (!Number.isNaN(numericOrder)) {
		const byOrder = slots.find((s) => s.order === numericOrder);
		if (byOrder) {
			return byOrder.id;
		}
	}
	return slots[0].id;
}

export function isValidMatchDayForSlots(matchDay: string, slots: ExpandedMatchdaySlot[] | undefined): boolean {
	if (!slots?.length) {
		return matchDay.trim().length > 0;
	}
	return slots.some((s) => s.id === matchDay.trim());
}
