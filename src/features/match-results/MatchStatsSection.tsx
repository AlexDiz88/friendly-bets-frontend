import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
	buildMatchStatRows,
	formatMatchStatValue,
	hasMatchTeamStats,
	matchStatShare,
	type MatchStatRow,
} from './matchTeamStatsModel';
import {
	matchStatsBarHalfSx,
	matchStatsBarTrackSx,
	matchStatsLabelSx,
	matchStatsRowSx,
	matchStatsRowsSx,
	matchStatsSectionRootSx,
	matchStatsSectionTitleSx,
	matchStatsValueSx,
	matchStatsValuesRowSx,
} from './matchStatsSectionStyles';
import type MatchTeamStats from './types/MatchTeamStats';

type Props = {
	stats?: MatchTeamStats | null;
};

function StatBarRow({ row, label }: { row: MatchStatRow; label: string }): JSX.Element {
	const { homePct, awayPct } = matchStatShare(row.home, row.away);
	const homeLeading = row.home > row.away;
	const awayLeading = row.away > row.home;
	const homeDisplay = formatMatchStatValue(row.home, row.format);
	const awayDisplay = formatMatchStatValue(row.away, row.format);

	return (
		<Box sx={matchStatsRowSx}>
			<Box sx={matchStatsValuesRowSx}>
				<Typography sx={matchStatsValueSx('home', homeLeading)}>{homeDisplay}</Typography>
				<Typography sx={matchStatsLabelSx}>{label}</Typography>
				<Typography sx={matchStatsValueSx('away', awayLeading)}>{awayDisplay}</Typography>
			</Box>
			<Box sx={matchStatsBarTrackSx}>
				<Box sx={matchStatsBarHalfSx('home', homePct)} />
				<Box sx={matchStatsBarHalfSx('away', awayPct)} />
			</Box>
		</Box>
	);
}

export default function MatchStatsSection({ stats }: Props): JSX.Element | null {
	const { t } = useTranslation();
	const rows = useMemo(() => (stats ? buildMatchStatRows(stats) : []), [stats]);

	if (!hasMatchTeamStats(stats) || rows.length === 0) {
		return null;
	}

	return (
		<Box sx={matchStatsSectionRootSx}>
			<Typography component="h3" sx={matchStatsSectionTitleSx}>
				{t('wc26.externalResults.matchStats.title')}
			</Typography>
			<Box sx={matchStatsRowsSx}>
				{rows.map((row) => (
					<StatBarRow
						key={row.key}
						row={row}
						label={t(`wc26.externalResults.matchStats.${row.key}`)}
					/>
				))}
			</Box>
		</Box>
	);
}
