import { WC26_SCHEDULE, type Wc26Match, type Wc26Stage } from './wc26Schedule';

export type Wc26ViewFilter =
	| 'all'
	| 'group'
	| 'group_r1'
	| 'group_r2'
	| 'group_r3'
	| 'playoffs'
	| Wc26Stage;

/** Порядок вкладок в UI. */
export const WC26_VIEW_FILTER_ORDER: Wc26ViewFilter[] = [
	'all',
	'group',
	'group_r1',
	'group_r2',
	'group_r3',
	'playoffs',
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
	'third_place',
	'final',
];

const KNOCKOUT_STAGES = new Set<Wc26Stage>([
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
	'third_place',
	'final',
]);

function groupRoundMatches(round: 1 | 2 | 3): Wc26Match[] {
	const start = (round - 1) * 24 + 1;
	const end = round * 24;
	return WC26_SCHEDULE.filter((m) => m.id >= start && m.id <= end);
}

export function filterWc26Matches(filter: Wc26ViewFilter): Wc26Match[] {
	switch (filter) {
		case 'all':
			return WC26_SCHEDULE;
		case 'group':
			return WC26_SCHEDULE.filter((m) => m.stage === 'group');
		case 'group_r1':
			return groupRoundMatches(1);
		case 'group_r2':
			return groupRoundMatches(2);
		case 'group_r3':
			return groupRoundMatches(3);
		case 'playoffs':
			return WC26_SCHEDULE.filter((m) => KNOCKOUT_STAGES.has(m.stage));
		default:
			return WC26_SCHEDULE.filter((m) => m.stage === filter);
	}
}
