import { WC26_SCHEDULE, type Wc26Match } from './wc26Schedule';
import { kickoffToGerman } from './wc26Time';

export type Wc26GroupRound = 1 | 2 | 3;

export interface Wc26BetSlot {
	/** r1-s1, r2-s3, … */
	id: string;
	round: Wc26GroupRound;
	slotIndex: number;
	matchIds: number[];
	betsRequired: number;
	matchesPerSlot: number;
}

interface BerlinKickoff {
	match: Wc26Match;
	date: string;
	time: string;
	sortKey: string;
}

function berlinKickoff(match: Wc26Match): BerlinKickoff {
	const { date, time } = kickoffToGerman(match.date, match.timeLocal, match.venueKey);
	return { match, date, time, sortKey: `${date}T${time}` };
}

function groupRoundMatches(round: Wc26GroupRound): BerlinKickoff[] {
	const start = (round - 1) * 24 + 1;
	const end = round * 24;
	return WC26_SCHEDULE.filter((m) => m.id >= start && m.id <= end)
		.map(berlinKickoff)
		.sort((a, b) => a.sortKey.localeCompare(b.sortKey) || a.match.id - b.match.id);
}

function chunkIntoSlots(round: Wc26GroupRound): Wc26BetSlot[] {
	const matchesPerSlot = round === 3 ? 6 : 4;
	const betsRequired = round === 3 ? 3 : 2;
	const sorted = groupRoundMatches(round);
	const slots: Wc26BetSlot[] = [];

	for (let i = 0; i < sorted.length; i += matchesPerSlot) {
		const chunk = sorted.slice(i, i + matchesPerSlot);
		const slotIndex = i / matchesPerSlot + 1;
		slots.push({
			id: `r${round}-s${slotIndex}`,
			round,
			slotIndex,
			matchIds: chunk.map((c) => c.match.id),
			betsRequired,
			matchesPerSlot,
		});
	}

	return slots;
}

/** 16 слотов группового этапа: 6+6+4 (туры 1–2 по 4 матча, тур 3 по 6). */
export const WC26_BET_SLOTS: Wc26BetSlot[] = [
	...chunkIntoSlots(1),
	...chunkIntoSlots(2),
	...chunkIntoSlots(3),
];

export function getBetSlotById(slotId: string): Wc26BetSlot | undefined {
	return WC26_BET_SLOTS.find((s) => s.id === slotId);
}

export function getMatchesForSlot(slot: Wc26BetSlot): Wc26Match[] {
	return slot.matchIds
		.map((id) => WC26_SCHEDULE.find((m) => m.id === id))
		.filter((m): m is Wc26Match => m !== undefined);
}

export function formatSlotBerlinRange(
	slot: Wc26BetSlot,
	dateLocale: string
): { from: string; to: string } {
	const matches = getMatchesForSlot(slot);
	if (matches.length === 0) return { from: '', to: '' };

	const kickoffs = matches.map(berlinKickoff).sort((a, b) => a.sortKey.localeCompare(b.sortKey));
	const first = kickoffs[0];
	const last = kickoffs[kickoffs.length - 1];

	const fmt = (date: string, time: string): string => {
		const d = new Date(`${date}T12:00:00`);
		const dayMonth = d.toLocaleDateString(dateLocale, { day: 'numeric', month: 'short' });
		return `${dayMonth} ${time}`;
	};

	return { from: fmt(first.date, first.time), to: fmt(last.date, last.time) };
}
