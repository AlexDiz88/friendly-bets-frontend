import { Box, Chip, Link, Typography, useMediaQuery } from '@mui/material';
import type { SystemStyleObject } from '@mui/system';
import type { Theme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26GroupStandingsCard from './Wc26GroupStandingsCard';
import { useWc26FifaStandings } from './useWc26FifaData';
import type { Wc26FifaBestThirdRow, Wc26FifaGroupTable, Wc26FifaStandingRow } from './wc26FifaApi';
import { WC26_GROUP_LETTERS } from './wc26PageViews';
import {
	wc26StandingsGroupChipBarSx,
	wc26StandingsGroupChipRowSx,
	wc26StandingsGroupLetterChipExtraSx,
	wc26StandingsWideChipExtraSx,
	wc26StageChipSx,
} from './wc26PageStyles';

export type Wc26StandingsGroupFilter = 'all' | 'best_third' | (typeof WC26_GROUP_LETTERS)[number];

const GROUP_CHIP_ROW1 = WC26_GROUP_LETTERS.slice(0, 6);
const GROUP_CHIP_ROW2 = WC26_GROUP_LETTERS.slice(6);
const FIFA_TIEBREAKER_URL =
	'https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/groups-how-teams-qualify-tie-breakers';
const TIEBREAKER_KEYS = [
	'tiebreaker1',
	'tiebreaker2',
	'tiebreaker3',
	'tiebreaker4',
	'tiebreaker5',
	'tiebreaker6',
	'tiebreaker7',
] as const;

function bestThirdToTable(rows: Wc26FifaBestThirdRow[]): Wc26FifaGroupTable {
	const standingRows: Wc26FifaStandingRow[] = rows.map((row) => ({
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
		liveNow: false,
	}));

	return {
		group: 'best_third',
		rows: standingRows,
	};
}

interface Wc26StandingsViewProps {
	groupFilter: Wc26StandingsGroupFilter;
	onGroupFilterChange: (value: Wc26StandingsGroupFilter) => void;
}

export default function Wc26StandingsView({
	groupFilter,
	onGroupFilterChange,
}: Wc26StandingsViewProps): JSX.Element {
	const { t } = useTranslation();
	const { data, loading, error } = useWc26FifaStandings(groupFilter);

	const legend = useMemo(
		() => [
			{ key: 'direct', color: '#00a86b', label: t('wc26.standings.legendDirect') },
			{ key: 'bestThird', color: '#ffd700', label: t('wc26.standings.legendBestThird') },
		],
		[t]
	);

	const mergeChipSx = (
		selected: boolean,
		extra: Record<string, unknown>
	): ((theme: Theme) => SystemStyleObject<Theme>) =>
		(theme: Theme) => {
			const base = wc26StageChipSx(selected);
			const resolved = typeof base === 'function' ? base(theme) : base;
			const merged = {
				...(Array.isArray(resolved) ? {} : resolved),
				...extra,
			};
			return merged as SystemStyleObject<Theme>;
		};

	const renderWideChip = (value: Wc26StandingsGroupFilter, label: string): JSX.Element => (
		<Chip
			key={value}
			label={label}
			onClick={() => onGroupFilterChange(value)}
			sx={mergeChipSx(groupFilter === value, wc26StandingsWideChipExtraSx)}
		/>
	);

	const renderLetterChip = (value: Wc26StandingsGroupFilter): JSX.Element => (
		<Chip
			key={value}
			label={value}
			onClick={() => onGroupFilterChange(value)}
			sx={mergeChipSx(groupFilter === value, wc26StandingsGroupLetterChipExtraSx)}
		/>
	);

	const visibleGroups = data?.groups ?? [];
	const bestThirdTable = data?.bestThirdPlaces?.length
		? bestThirdToTable(data.bestThirdPlaces)
		: null;
	const showOnlyBestThird = groupFilter === 'best_third';
	const twoColumnGroupsGrid = useMediaQuery('(min-width:800px)');
	const showTwoColumnGroups = groupFilter === 'all' && twoColumnGroupsGrid;

	return (
		<Box>
			<Box sx={{ ...wc26StandingsGroupChipBarSx, mb: 1 }}>
				<Box sx={wc26StandingsGroupChipRowSx}>
					{renderWideChip('all', t('wc26.standings.allGroups'))}
					{GROUP_CHIP_ROW1.map((letter) => renderLetterChip(letter))}
				</Box>
				<Box sx={wc26StandingsGroupChipRowSx}>
					{GROUP_CHIP_ROW2.map((letter) => renderLetterChip(letter))}
					{renderWideChip('best_third', t('wc26.standings.bestThirdChip'))}
				</Box>
			</Box>

			{groupFilter !== 'best_third' ? (
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
			) : null}

			{error ? (
				<Typography variant="body2" color="error" sx={{ textAlign: 'center', py: 2 }}>
					{t(`error.${error}`, { defaultValue: error })}
				</Typography>
			) : null}

			{loading && !data ? (
				<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
					{t('wc26.standings.loading')}
				</Typography>
			) : null}

			{showOnlyBestThird && bestThirdTable ? (
				<Wc26GroupStandingsCard
					table={bestThirdTable}
					title={t('wc26.standings.bestThirdTitle')}
					showSourceGroup
				/>
			) : (
				<>
					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: '1fr',
							gap: 1,
							...(groupFilter === 'all' && {
								'@media (min-width: 800px)': {
									gridTemplateColumns: '1fr 1fr',
								},
							}),
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

					{groupFilter === 'all' && bestThirdTable ? (
						<Box sx={{ mt: 1.5 }}>
							<Wc26GroupStandingsCard
								table={bestThirdTable}
								title={t('wc26.standings.bestThirdTitle')}
								showSourceGroup
							/>
						</Box>
					) : null}
				</>
			)}

			{!error && (!loading || data) ? (
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
						{t('wc26.standings.tiebreakerPositions')}{' '}
						<Link
							href={FIFA_TIEBREAKER_URL}
							target="_blank"
							rel="noopener noreferrer"
							underline="hover"
							color="inherit"
							sx={{ fontWeight: 600 }}
						>
							{t('wc26.standings.tiebreakerSource')}
						</Link>
					</Typography>
				</Box>
			) : null}

		</Box>
	);
}
