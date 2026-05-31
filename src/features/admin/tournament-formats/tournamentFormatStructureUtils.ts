import TournamentFormat, { NewTournamentFormat, PlayoffStage, RoundRobinStage } from './types/TournamentFormat';

export const PLAYOFF_STAGE_OPTIONS = ['1/16', '1/8', '1/4', '1/2', 'third_place', 'final'] as const;

export const WC_FORMAT_CODE = 'wc-48teams';

export const emptyPlayoffStage = (): PlayoffStage => ({ stage: '1/8', matchdayCount: 2 });

export interface TournamentFormatStructureDraft {
	useRegular: boolean;
	regularCount: string;
	useGroup: boolean;
	groupCount: string;
	groupSplitSlots: boolean;
	groupSlotsPerRound: string[];
	usePlayoff: boolean;
	rounds: PlayoffStage[];
}

function defaultGroupSlotsPerRound(count: number, from?: number[] | null): string[] {
	const n = Math.max(1, Math.min(8, count));
	const result: string[] = [];
	for (let i = 0; i < n; i++) {
		result.push(String(from?.[i] ?? 1));
	}
	return result;
}

export function emptyStructureDraft(): TournamentFormatStructureDraft {
	return {
		useRegular: false,
		regularCount: '38',
		useGroup: false,
		groupCount: '8',
		groupSplitSlots: false,
		groupSlotsPerRound: ['1'],
		usePlayoff: false,
		rounds: [emptyPlayoffStage()],
	};
}

export function structureDraftFromFormat(format: TournamentFormat): TournamentFormatStructureDraft {
	const isWc = format.formatCode === WC_FORMAT_CODE;
	const groupCount = format.groupStage?.matchdayCount ?? (isWc ? 3 : 8);
	return {
		useRegular: Boolean(format.regularStage) && !isWc,
		regularCount: String(format.regularStage?.matchdayCount ?? 38),
		useGroup: Boolean(format.groupStage) || isWc,
		groupCount: String(groupCount),
		groupSplitSlots: Boolean(format.groupStage?.splitSlotsPerRound),
		groupSlotsPerRound: defaultGroupSlotsPerRound(
			groupCount,
			format.groupStage?.slotsPerRound
		),
		usePlayoff: Boolean(format.playoff?.length),
		rounds: format.playoff?.length ? format.playoff.map((r) => ({ ...r })) : [emptyPlayoffStage()],
	};
}

export function resizeStructureDraftGroupCount(
	draft: TournamentFormatStructureDraft,
	newCount: string
): TournamentFormatStructureDraft {
	const n = Math.max(1, Math.min(8, Number(newCount) || 1));
	return {
		...draft,
		groupCount: String(n),
		groupSlotsPerRound: defaultGroupSlotsPerRound(n, draft.groupSlotsPerRound.map(Number)),
	};
}

function buildGroupStage(draft: TournamentFormatStructureDraft): RoundRobinStage | null {
	if (!draft.useGroup || draft.useRegular) {
		return null;
	}
	const matchdayCount = Number(draft.groupCount);
	if (!draft.groupSplitSlots) {
		return { matchdayCount, splitSlotsPerRound: false };
	}
	const slotsPerRound = defaultGroupSlotsPerRound(
		matchdayCount,
		draft.groupSlotsPerRound.map((s) => Number(s))
	).map(Number);
	return { matchdayCount, splitSlotsPerRound: true, slotsPerRound };
}

export function buildStructurePayload(
	draft: TournamentFormatStructureDraft,
	formatCode?: string
): Pick<NewTournamentFormat, 'regularStage' | 'groupStage' | 'playoff'> {
	const groupStage = buildGroupStage(draft);
	const playoff: PlayoffStage[] | null = draft.usePlayoff
		? draft.rounds.filter((r) => r.stage.trim())
		: null;

	if (formatCode === WC_FORMAT_CODE) {
		return {
			regularStage: null,
			groupStage,
			playoff,
		};
	}

	const regularStage: RoundRobinStage | null =
		draft.useRegular && !draft.useGroup ? { matchdayCount: Number(draft.regularCount) } : null;

	return { regularStage, groupStage, playoff };
}
