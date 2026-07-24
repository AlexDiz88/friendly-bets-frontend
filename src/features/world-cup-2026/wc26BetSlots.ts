import type { ExternalMatch } from '../match-results/types/ExternalMatch';
import { WC26_TEAMS, type Wc26TeamId } from './wc26Teams';

const BERLIN_GROUP_SLOT = /^([123]) \[(\d+)\]$/;

const PLAYOFF_SLOT_IDS = new Set([
	'1/16 [1]',
	'1/16 [2]',
	'1/16 [3]',
	'1/16 [4]',
	'1/16 [5]',
	'1/8 [1]',
	'1/8 [2]',
	'1/4',
	'1/2',
	'third_place',
	'final',
]);

export function isBerlinGroupSlot(slotId: string): boolean {
	return BERLIN_GROUP_SLOT.test(slotId);
}

export function isWcBettingSlot(slotId: string): boolean {
	return isBerlinGroupSlot(slotId) || PLAYOFF_SLOT_IDS.has(slotId);
}

export function isPlayoffSlot(slotId: string): boolean {
	return isWcBettingSlot(slotId) && !isBerlinGroupSlot(slotId);
}

export function betsRequiredForSlot(slotId: string): number {
	const m = BERLIN_GROUP_SLOT.exec(slotId);
	if (!m) {
		return 1;
	}
	const round = Number(m[1]);
	if (round === 3) {
		return 3;
	}
	if (round === 1 || round === 2) {
		return 2;
	}
	return 1;
}

export interface BerlinSlotMeta {
	round: number;
	index: number;
	betsRequired: number;
	matchCount: number;
	rangeFrom?: string;
	rangeTo?: string;
	utcOffset?: string;
}

export function getBerlinSlotMeta(slotId: string, _language: string): BerlinSlotMeta | null {
	const m = BERLIN_GROUP_SLOT.exec(slotId);
	if (!m) {
		return null;
	}
	const round = Number(m[1]);
	const index = Number(m[2]);
	const matchCount = round === 3 ? 6 : 4;
	return {
		round,
		index,
		betsRequired: betsRequiredForSlot(slotId),
		matchCount,
	};
}

export function resolveWc26TeamIdFromCountry(
	country: string | null | undefined
): Wc26TeamId | null {
	if (!country) {
		return null;
	}
	const upper = country.trim().toUpperCase();
	if (upper in WC26_TEAMS) {
		return upper as Wc26TeamId;
	}
	return null;
}

/** @deprecated Prefer team country/FIFA from Mongo match payload. */
export function findWc26ScheduleMatchForExternal(
	_match: ExternalMatch,
	_slotId?: string
): null {
	return null;
}
