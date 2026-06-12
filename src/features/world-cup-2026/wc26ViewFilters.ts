import { WC26_SCHEDULE, type Wc26Match, type Wc26Stage } from './wc26Schedule';

export type Wc26MatchListSource = Wc26Match[];

export type Wc26ViewFilter =
	| 'all'
	| 'group'
	| 'group_r1'
	| 'group_r2'
	| 'group_r3'
	| 'playoffs'
	/** Матч за 3-е место + финал */
	| 'finals'
	| Wc26Stage;

/** Порядок вкладок в UI (десктоп — одна панель с переносом). */
export const WC26_VIEW_FILTER_ORDER: Wc26ViewFilter[] = [
	'all',
	'group_r1',
	'group_r2',
	'group_r3',
	'playoffs',
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
	'finals',
];

/** Мобильная раскладка: 1-й ряд — групповой этап, 2-й — плей-офф. */
export const WC26_VIEW_FILTER_MOBILE_ROW1: Wc26ViewFilter[] = ['all', 'group_r1', 'group_r2', 'group_r3'];

export const WC26_VIEW_FILTER_MOBILE_ROW2: Wc26ViewFilter[] = [
	'playoffs',
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
	'finals',
];

const KNOCKOUT_STAGES = new Set<Wc26Stage>([
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
	'third_place',
	'final',
]);

function groupRoundMatches(matches: Wc26Match[], round: 1 | 2 | 3): Wc26Match[] {
	const start = (round - 1) * 24 + 1;
	const end = round * 24;
	return matches.filter((m) => m.id >= start && m.id <= end);
}

export function filterWc26Matches(
	matches: Wc26MatchListSource,
	filter: Wc26ViewFilter
): Wc26Match[] {
	switch (filter) {
		case 'all':
			return matches;
		case 'group':
			return matches.filter((m) => m.stage === 'group');
		case 'group_r1':
			return groupRoundMatches(matches, 1);
		case 'group_r2':
			return groupRoundMatches(matches, 2);
		case 'group_r3':
			return groupRoundMatches(matches, 3);
		case 'playoffs':
			return matches.filter((m) => KNOCKOUT_STAGES.has(m.stage));
		case 'finals':
			return matches.filter((m) => m.stage === 'third_place' || m.stage === 'final');
		default:
			return matches.filter((m) => m.stage === filter);
	}
}

/** @deprecated Use filterWc26Matches(matches, filter) with API data on schedule page. */
export function filterStaticWc26Matches(filter: Wc26ViewFilter): Wc26Match[] {
	return filterWc26Matches(WC26_SCHEDULE, filter);
}
