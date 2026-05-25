import { t } from 'i18next';
import type { MatchdaySlot } from './types';

export function formatSlotLabel(slot: MatchdaySlot): string {
	const display = slot.slotId ?? slot.label;
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
