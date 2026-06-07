export interface RoundRobinStage {
	matchdayCount: number;
	splitSlotsPerRound?: boolean;
	slotsPerRound?: number[] | null;
}

export interface PlayoffStage {
	stage: string;
	matchdayCount: number;
}

export interface ExpandedMatchdaySlot {
	id: string;
	order: number;
	kind: string;
	labelKey: string;
}

export default interface TournamentFormat {
	id: string;
	formatCode: string;
	name: string;
	createdAt?: string;
	regularStage: RoundRobinStage | null;
	groupStage: RoundRobinStage | null;
	playoff: PlayoffStage[] | null;
	expandedSlots?: ExpandedMatchdaySlot[];
	linkedLeagueCount?: number;
}

export interface NewTournamentFormat {
	formatCode: string;
	name: string;
	regularStage: RoundRobinStage | null;
	groupStage: RoundRobinStage | null;
	playoff: PlayoffStage[] | null;
}

export interface UpdateTournamentFormat {
	name: string;
	regularStage: RoundRobinStage | null;
	groupStage: RoundRobinStage | null;
	playoff: PlayoffStage[] | null;
}
