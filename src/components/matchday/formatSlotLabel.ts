import { t } from 'i18next';
import type { MatchdaySlot } from './types';

function translatePlayoffStage(stageKey: string): string {
	const key = `playoffStage.${stageKey}`;
	const translated = t(key);
	return translated === key ? stageKey : translated;
}

function translatePlayoffStageForGrid(stageKey: string): string {
	if (stageKey === 'third_place') {
		const shortKey = 'playoffStage.third_place_short';
		const short = t(shortKey);
		if (short !== shortKey) {
			return short;
		}
	}
	return translatePlayoffStage(stageKey);
}

export function formatSlotIdLabel(slotId: string, kind?: MatchdaySlot['kind']): string {
	if (kind === 'GROUP') {
		return slotId;
	}

	const bracket = slotId.indexOf('[');
	if (kind === 'KNOCKOUT' || bracket >= 0) {
		const playoffStage = bracket >= 0 ? slotId.substring(0, bracket).trim() : slotId;
		const leg = bracket >= 0 ? slotId.substring(bracket) : '';
		const stageLabel = translatePlayoffStageForGrid(playoffStage);
		return leg ? `${stageLabel} ${leg}` : stageLabel;
	}

	return slotId;
}

export function formatSlotLabel(slot: MatchdaySlot): string {
	const display = slot.slotId ?? slot.label;
	return formatSlotIdLabel(display, slot.kind);
}
