import { Box, Chip, Typography } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26BracketMatchNode from './Wc26BracketMatchNode';
import { useWc26FifaBracket } from './useWc26FifaData';
import type { Wc26Stage } from './wc26Schedule';
import {
	WC26_BRACKET_STAGE_ORDER,
	type Wc26BracketStageFilter,
} from './wc26PageViews';
import {
	wc26StageChipBarSx,
	wc26StageChipSx,
} from './wc26PageStyles';

const COMPACT_ROUND_STAGES = new Set<Wc26BracketStageFilter>([
	'round_of_32',
	'round_of_16',
	'quarter_final',
	'semi_final',
]);

interface Wc26BracketViewProps {
	stageFilter: Wc26BracketStageFilter;
	onStageFilterChange: (value: Wc26BracketStageFilter) => void;
}

export default function Wc26BracketView({
	stageFilter,
	onStageFilterChange,
}: Wc26BracketViewProps): JSX.Element {
	const { t } = useTranslation();
	const { data, loading, error } = useWc26FifaBracket(stageFilter);

	const stageChips = useMemo(
		() =>
			WC26_BRACKET_STAGE_ORDER.map((stage) => ({
				value: stage as Wc26BracketStageFilter,
				label: t(`wc26.stages.${stage}`),
			})),
		[t]
	);

	const renderStageChip = (value: Wc26BracketStageFilter): JSX.Element => {
		const label =
			value === 'all'
				? t('wc26.bracket.allStages')
				: t(`wc26.stages.${value as Wc26Stage}`);
		const isCompactRound = COMPACT_ROUND_STAGES.has(value);
		const selected = stageFilter === value;
		return (
			<Chip
				key={value}
				label={label}
				onClick={() => onStageFilterChange(value)}
				sx={(theme: Theme) => {
					const base = wc26StageChipSx(selected);
					const resolved = typeof base === 'function' ? base(theme) : base;
					const merged = {
						...(Array.isArray(resolved) ? {} : resolved),
						flexShrink: 0,
						fontSize: { xs: '0.75rem', sm: '0.75rem' },
						height: { xs: 38, sm: 36 },
						...(isCompactRound
							? {
									flex: '0 0 auto',
									width: { xs: 50, sm: 55 },
									minWidth: { xs: 50, sm: 55 },
									'& .MuiChip-label': { px: { xs: 0.25, sm: 0.4 } },
								}
							: {
									flex: { xs: '1 1 0', sm: '0 0 auto' },
									minWidth: 0,
									'& .MuiChip-label': { px: { xs: 0.45, sm: 1 } },
								}),
					};
					return merged as SystemStyleObject<Theme>;
				}}
			/>
		);
	};

	const matches = data?.matches ?? [];
	const columns =
		stageFilter === 'round_of_32'
			? { xs: '1fr', sm: '1fr 1fr' }
			: stageFilter === 'round_of_16'
				? { xs: '1fr', sm: '1fr 1fr' }
				: stageFilter === 'quarter_final'
					? { xs: '1fr', sm: '1fr 1fr' }
					: '1fr';

	return (
		<Box>
			<Box
				sx={{
					...wc26StageChipBarSx,
					flexWrap: 'nowrap',
					justifyContent: 'center',
					mb: 1,
				}}
			>
				{stageChips.map(({ value }) => renderStageChip(value))}
			</Box>

			{error ? (
				<Typography variant="body2" color="error" sx={{ textAlign: 'center', py: 2 }}>
					{t(`error.${error}`, { defaultValue: error })}
				</Typography>
			) : null}

			{loading && !data ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
					{t('wc26.bracket.loading')}
				</Typography>
			) : null}

			{!loading && matches.length === 0 ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
					{t('wc26.bracket.empty')}
				</Typography>
			) : null}

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: columns,
					gap: 1,
				}}
			>
				{matches.map((match) => (
					<Wc26BracketMatchNode key={match.matchNumber} match={match} />
				))}
			</Box>

		</Box>
	);
}
