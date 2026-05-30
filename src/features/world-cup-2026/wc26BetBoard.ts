import { ExternalMatch } from '../football-data/types/ExternalMatch';

export type Wc26BettingSlot = {
	id: string;
	round: number;
	slotIndex: number;
	betsRequired: number;
	matchesPerSlot: number;
	matches: ExternalMatch[];
};

export type Wc26GroupStageBoard = {
	seasonId: string;
	leagueId: string;
	storageSeason: string;
	slots: Wc26BettingSlot[];
};

export function formatSlotUtcRange(
	slot: Wc26BettingSlot,
	dateLocale: string
): { from: string; to: string } {
	const dates = slot.matches
		.map((m) => m.utcDate)
		.filter((d): d is string => Boolean(d))
		.sort();
	if (dates.length === 0) {
		return { from: '', to: '' };
	}
	const fmt = (iso: string): string => {
		const d = new Date(iso);
		return d.toLocaleString(dateLocale, {
			timeZone: 'Europe/Berlin',
			day: 'numeric',
			month: 'short',
			hour: '2-digit',
			minute: '2-digit',
		});
	};
	return { from: fmt(dates[0]), to: fmt(dates[dates.length - 1]) };
}
