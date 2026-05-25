import { externalSlotsToMatchdaySlots } from '../../components/matchday/slotMappers';
import type { MatchdaySlot } from '../../components/matchday/types';
import { FootballDataCompetitionOption } from './types/ExternalMatch';

export type { MatchdaySlot };
export { externalSlotsToMatchdaySlots };

/** football-data.org competition code ↔ наш LeagueCode */
export const FOOTBALL_DATA_COMPETITIONS: FootballDataCompetitionOption[] = [
	{ competitionCode: 'PL', leagueCode: 'EPL', matchdayCount: 38 },
	{ competitionCode: 'BL1', leagueCode: 'BL', matchdayCount: 34 },
	{ competitionCode: 'CL', leagueCode: 'CL', matchdayCount: 12 },
	{ competitionCode: 'EC', leagueCode: 'EC', matchdayCount: 7 },
	{ competitionCode: 'WC', leagueCode: 'WC', matchdayCount: 7 },
];

const REGULAR_MATCHDAYS: Record<string, number> = {
	EPL: 38,
	BL: 34,
	CL: 8,
	EC: 7,
	WC: 7,
};

const CL_KNOCKOUT_SLOTS: MatchdaySlot[] = [
	{ value: 9, label: '1/8', kind: 'KNOCKOUT' },
	{ value: 10, label: '1/4', kind: 'KNOCKOUT' },
	{ value: 11, label: '1/2', kind: 'KNOCKOUT' },
	{ value: 12, label: 'final', kind: 'KNOCKOUT' },
];

export const DEFAULT_FOOTBALL_DATA_SEASON = '2025';

const DEFAULT_MATCHDAY_COUNT = 38;

export function getMatchdayCountForLeague(leagueCode: string): number {
	return (
		FOOTBALL_DATA_COMPETITIONS.find((c) => c.leagueCode === leagueCode)?.matchdayCount ??
		DEFAULT_MATCHDAY_COUNT
	);
}

export function buildMatchdaySlotsForLeague(leagueCode: string): MatchdaySlot[] {
	const regular = REGULAR_MATCHDAYS[leagueCode] ?? DEFAULT_MATCHDAY_COUNT;
	const slots: MatchdaySlot[] = Array.from({ length: regular }, (_, i) => ({
		value: i + 1,
		slotId: String(i + 1),
		label: String(i + 1),
		kind: 'REGULAR' as const,
	}));
	if (leagueCode === 'CL') {
		slots.push(...CL_KNOCKOUT_SLOTS);
	}
	return slots;
}

export { getGridColumnsForMatchdayCount } from '../../components/matchday/types';
