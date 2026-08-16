import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import PlayerStats from './types/PlayerStats';
import {
	playerOutcomesLegendItemSx,
	playerOutcomesLegendSx,
	playerOutcomesSegmentSx,
	playerOutcomesTrackSx,
	playerStatsMetaChipSx,
	playerStatsMetaRowSx,
} from './playerStatsChartStyles';

const OUTCOME_COLORS = {
	dark: {
		won: '#4ade80',
		returned: '#facc15',
		lost: '#f87171',
		empty: '#94a3b8',
	},
	light: {
		won: '#15803d',
		returned: '#ca8a04',
		lost: '#b91c1c',
		empty: '#64748b',
	},
} as const;

export default function PlayerOutcomesBar({ pStats }: { pStats: PlayerStats }): JSX.Element {
	const theme = useTheme();
	const colors = theme.palette.mode === 'dark' ? OUTCOME_COLORS.dark : OUTCOME_COLORS.light;
	const total =
		pStats.wonBetCount + pStats.returnedBetCount + pStats.lostBetCount + pStats.emptyBetCount;
	const segments = [
		{ key: 'won' as const, count: pStats.wonBetCount, color: colors.won, labelKey: 'statsChart.wonShort' },
		{
			key: 'returned' as const,
			count: pStats.returnedBetCount,
			color: colors.returned,
			labelKey: 'statsChart.returnedShort',
		},
		{ key: 'lost' as const, count: pStats.lostBetCount, color: colors.lost, labelKey: 'statsChart.lostShort' },
		{
			key: 'empty' as const,
			count: pStats.emptyBetCount,
			color: colors.empty,
			labelKey: 'statsChart.emptyShort',
		},
	];

	return (
		<Box>
			<Box
				sx={playerOutcomesTrackSx}
				role="img"
				aria-label={`${t('betsWonCount')} ${pStats.wonBetCount}, ${t('betsReturnedCount')} ${pStats.returnedBetCount}, ${t('betsLostCount')} ${pStats.lostBetCount}, ${t('emptyBetsCount')} ${pStats.emptyBetCount}`}
			>
				{segments.map((segment) => (
					<Box
						key={segment.key}
						sx={playerOutcomesSegmentSx(segment.color, total > 0 ? segment.count / total : 0)}
					/>
				))}
			</Box>
			<Box sx={playerOutcomesLegendSx}>
				{segments.map((segment) => (
					<Box key={segment.key} sx={playerOutcomesLegendItemSx(segment.color)}>
						{t(segment.labelKey)} {segment.count}
					</Box>
				))}
			</Box>
			<Box sx={playerStatsMetaRowSx}>
				<Typography component="span" sx={playerStatsMetaChipSx('winRate')}>
					{t('winPercentage')}: {pStats.winRate.toFixed(1)}%
				</Typography>
				<Typography component="span" sx={playerStatsMetaChipSx('avgOdds')}>
					{t('averageCoef')}: {pStats.averageOdds.toFixed(2)}
				</Typography>
				<Typography component="span" sx={playerStatsMetaChipSx('avgWinOdds')}>
					{t('averageWinCoef')}: {pStats.averageWonBetOdds.toFixed(2)}
				</Typography>
			</Box>
		</Box>
	);
}
