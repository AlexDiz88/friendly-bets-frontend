export const WC26_GROUP_LETTERS = [
	'A',
	'B',
	'C',
	'D',
	'E',
	'F',
	'G',
	'H',
	'I',
	'J',
	'K',
	'L',
] as const;

export type Wc26GroupLetter = (typeof WC26_GROUP_LETTERS)[number];

export type Wc26PageView = 'schedule' | 'standings' | 'bracket';

export const WC26_BRACKET_STAGE_ORDER = [
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
	'third_place',
	'final',
] as const;

export type Wc26BracketStageFilter = (typeof WC26_BRACKET_STAGE_ORDER)[number] | 'all';
