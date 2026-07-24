import type { Wc26TeamId } from './wc26Teams';

export type Wc26Stage =
	| 'group'
	| 'group_1'
	| 'group_2'
	| 'group_3'
	| 'round_of_32'
	| 'round_of_16'
	| 'quarter_final'
	| 'semi_final'
	| 'third_place'
	| 'final';

export interface Wc26Match {
	id: number;
	date: string;
	timeLocal: string;
	stage: Wc26Stage;
	group?: string;
	home?: Wc26TeamId;
	away?: Wc26TeamId;
	labelKey?: string;
}
