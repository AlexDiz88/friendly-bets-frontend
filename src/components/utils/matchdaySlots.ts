import { t } from 'i18next';
import type { ExpandedMatchdaySlot } from '../../features/admin/tournament-formats/types/TournamentFormat';

export function formatMatchdaySlotLabel(slot: ExpandedMatchdaySlot): string {
	const display = slot.id;
	if (slot.kind === 'KNOCKOUT' || display.includes('[')) {
		const bracket = display.indexOf('[');
		const playoffStage = bracket >= 0 ? display.substring(0, bracket).trim() : display;
		const leg = bracket >= 0 ? display.substring(bracket) : '';
		const key = `playoffStage.${playoffStage}`;
		const translated = t(key);
		const stageLabel = translated === key ? playoffStage : translated;
		return leg ? `${stageLabel} ${leg}` : stageLabel;
	}
	return display;
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
