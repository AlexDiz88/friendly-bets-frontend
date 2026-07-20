import { Box, Typography, useMediaQuery } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26GroupStandingsCard from './Wc26GroupStandingsCard';
import { useWc26Standings } from './useWc26ArchiveData';
import type { Wc26BestThirdRow, Wc26GroupTable, Wc26StandingRow } from './wc26ArchiveApi';

const TIEBREAKER_KEYS = [
	'tiebreaker1',
	'tiebreaker2',
	'tiebreaker3',
	'tiebreaker4',
	'tiebreaker5',
	'tiebreaker6',
	'tiebreaker7',
] as const;

function bestThirdToTable(rows: Wc26BestThirdRow[]): Wc26GroupTable {
	const standingRows: Wc26StandingRow[] = rows.map((row) => ({
		rank: row.rank,
		fifaCode: row.fifaCode,
		sourceGroup: row.group,
		played: row.played,
		wins: row.wins,
		draws: row.draws,
		losses: row.losses,
		goalsFor: row.goalsFor,
		goalsAgainst: row.goalsAgainst,
		goalDifference: row.goalDifference,
		points: row.points,
		form: [],
		qualificationStatus: row.qualifies ? 'best_third' : 'eliminated',
	}));

	return {
		group: 'best_third',
		rows: standingRows,
	};
}

export default function Wc26StandingsView(): JSX.Element {
	const { t } = useTranslation();
	const { data, loading, error } = useWc26Standings();

	const visibleGroups = data?.groups ?? [];

	const legend = useMemo(
		() => [
			{ key: 'direct', color: '#00a86b', label: t('wc26.standings.legendDirect') },
			{ key: 'bestThird', color: '#ffd700', label: t('wc26.standings.legendBestThird') },
		],
		[t]
	);
	const bestThirdTable = data?.bestThirdPlaces?.length
		? bestThirdToTable(data.bestThirdPlaces)
		: null;
	const showTwoColumnGroups = useMediaQuery('(min-width:800px)');
	const noData = !loading && !error && visibleGroups.length === 0;

	return (
		<Box>
			<Box
				sx={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					gap: 1,
					mb: 1,
				}}
			>
				{legend.map((item) => (
					<Box key={item.key} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
						<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
						<Typography variant="caption" color="text.secondary">
							{item.label}
						</Typography>
					</Box>
				))}
			</Box>

			{error ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
					{t('wc26.noData')}
				</Typography>
			) : null}

			{loading && !data ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
					{t('wc26.standings.loading')}
				</Typography>
			) : null}

			{noData ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
					{t('wc26.noData')}
				</Typography>
			) : null}

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: '1fr',
					gap: 1,
					'@media (min-width: 800px)': {
						gridTemplateColumns: '1fr 1fr',
					},
				}}
			>
				{visibleGroups.map((table) => (
					<Wc26GroupStandingsCard
						key={table.group}
						table={table}
						twoColumnGrid={showTwoColumnGroups}
					/>
				))}
			</Box>

			{bestThirdTable ? (
				<Box sx={{ mt: 1.5 }}>
					<Wc26GroupStandingsCard
						table={bestThirdTable}
						title={t('wc26.standings.bestThirdTitle')}
					/>
				</Box>
			) : null}

			{!error && !noData && (!loading || data) ? (
				<Box
					component="footer"
					sx={{
						mt: 2,
						pt: 1.5,
						borderTop: '1px solid',
						borderColor: 'divider',
					}}
				>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, mb: 0.5 }}>
						{t('wc26.standings.tiebreakerTitle')}
					</Typography>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.75, lineHeight: 1.45 }}>
						{t('wc26.standings.tiebreakerIntro')}
					</Typography>
					<Box
						component="ol"
						sx={{
							m: 0,
							pl: 2.25,
							'& > li': { mb: 0.35 },
							'& > li::marker': { fontSize: '0.72rem' },
						}}
					>
						{TIEBREAKER_KEYS.map((key) => (
							<Typography key={key} component="li" variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
								{t(`wc26.standings.${key}`)}
							</Typography>
						))}
					</Box>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.85, lineHeight: 1.45 }}>
						{t('wc26.standings.tiebreakerThird')}
					</Typography>
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5, lineHeight: 1.45 }}>
						{t('wc26.standings.tiebreakerPositions')}
					</Typography>
				</Box>
			) : null}
		</Box>
	);
}
