import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
	Box,
	CircularProgress,
	Collapse,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	type SxProps,
	type Theme,
} from '@mui/material';
import { t } from 'i18next';
import { useMemo, useState } from 'react';
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import Calendar from '../admin/calendars/types/Calendar';
import PlayerBalanceChart from './PlayerBalanceChart';
import PlayerFormPills from './PlayerFormPills';
import PlayerHighlightCards from './PlayerHighlightCards';
import PlayerOutcomesBar from './PlayerOutcomesBar';
import { buildPlayerGameweekChartPoints } from './playerGameweekChart';
import { playerStatsExpandBodySx } from './playerStatsChartStyles';
import StatsTableIdentityCell, { STATS_COLLAPSE_MS } from './StatsTableIdentityCell';
import {
	statsBalanceCellSx,
	statsBalanceNegativeSx,
	statsBalancePositiveSx,
	statsBetsCellSx,
	statsCollapseRowCellSx,
	statsExpandableRowSx,
	statsExpandedRingSx,
	statsExpandedTitleSx,
	statsExpandIconSx,
	statsIdentityCellSx,
	statsLeadingSx,
	statsPercentCellSx,
	statsPlayerNameSx,
	statsTableBodySx,
	statsTableContainerSx,
	statsTableHeadCellSx,
	statsTableHeadSx,
} from './statsPageStyles';
import PlayerStats from './types/PlayerStats';
import PlayerHighlight from './types/PlayerHighlight';
import useSeasonGameweeksOverview from './useSeasonGameweeksOverview';
import useSeasonPlayerHighlights from './useSeasonPlayerHighlights';

function Row({
	pStats,
	nodes,
	chartLoading,
	chartError,
	highlight,
	highlightsLoading,
	onExpand,
}: {
	pStats: PlayerStats;
	nodes: Calendar[];
	chartLoading: boolean;
	chartError: string | undefined;
	highlight: PlayerHighlight | undefined;
	highlightsLoading: boolean;
	onExpand: () => void;
}): JSX.Element {
	const [open, setOpen] = useState(false);
	const points = useMemo(
		() => buildPlayerGameweekChartPoints(nodes, pStats.userId),
		[nodes, pStats.userId]
	);

	const toggleOpen = (): void => {
		setOpen((prev) => {
			if (!prev) {
				onExpand();
			}
			return !prev;
		});
	};

	return (
		<>
			<TableRow
				hover
				aria-expanded={open}
				aria-label={t('expandRow')}
				onClick={toggleOpen}
				onKeyDown={(e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						e.preventDefault();
						toggleOpen();
					}
				}}
				sx={statsExpandableRowSx(open)}
				tabIndex={0}
			>
				<StatsTableIdentityCell
					expanded={open}
					leading={<KeyboardArrowDownIcon sx={statsExpandIconSx(open)} />}
					leadingSx={statsLeadingSx(open)}
					cellSx={statsIdentityCellSx(open)}
					expandedRingSx={statsExpandedRingSx}
					avatarSrc={avatarBase64Converter(pStats.avatar)}
					avatarAlt="user_avatar"
					avatarSize={50}
					label={pStats.username}
					labelSx={statsPlayerNameSx}
				/>
				<TableCell align="center" sx={statsBetsCellSx}>
					{pStats.betCount} ({pStats.totalBets})
				</TableCell>
				<TableCell align="center" sx={statsPercentCellSx}>
					{pStats.winRate.toFixed(0)}
				</TableCell>
				<TableCell
					align="center"
					sx={
						[
							statsBalanceCellSx,
							pStats.actualBalance >= 0 ? statsBalancePositiveSx : statsBalanceNegativeSx,
						] as SxProps<Theme>
					}
				>
					{pStats.actualBalance.toFixed(2)}€
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={4}
					sx={statsCollapseRowCellSx}
					style={{ paddingBottom: 0, paddingTop: 0 }}
				>
					<Collapse in={open} timeout={STATS_COLLAPSE_MS} unmountOnExit>
						<Box sx={playerStatsExpandBodySx}>
							<Typography component="div" sx={statsExpandedTitleSx}>
								{t('additionalStats')} ({pStats.username})
							</Typography>
							<PlayerOutcomesBar pStats={pStats} />
							{highlightsLoading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center', py: 1.25 }}>
									<CircularProgress size={22} />
								</Box>
							) : (
								<>
									<PlayerFormPills form={highlight?.recentForm ?? []} />
									<PlayerHighlightCards highlight={highlight} />
								</>
							)}
							<PlayerBalanceChart
								points={points}
								loading={chartLoading}
								error={chartError}
								userId={pStats.userId}
							/>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

export default function PlayersStats({
	playersStats,
	seasonId,
}: {
	playersStats: PlayerStats[];
	seasonId?: string;
}): JSX.Element {
	const [chartsRequested, setChartsRequested] = useState(false);
	const { nodes, loading, error } = useSeasonGameweeksOverview(seasonId, chartsRequested);
	const { highlightsByUserId, loading: highlightsLoading } = useSeasonPlayerHighlights(
		seasonId,
		chartsRequested
	);

	return (
		<TableContainer component={Paper} elevation={0} sx={statsTableContainerSx}>
			<Table aria-label="collapsible table" size="small">
				<TableHead sx={statsTableHeadSx}>
					<TableRow>
						<TableCell
							align="left"
							sx={[statsTableHeadCellSx, { pl: 3 }] as SxProps<Theme>}
						>
							{t('playerName')}
						</TableCell>
						<TableCell
							align="center"
							sx={
								[statsTableHeadCellSx, { fontSize: '0.75rem', px: 0.2 }] as SxProps<Theme>
							}
						>
							{t('totalBets')}
						</TableCell>
						<TableCell align="center" sx={[statsTableHeadCellSx, { px: 0.2 }] as SxProps<Theme>}>
							%
						</TableCell>
						<TableCell align="center" sx={[statsTableHeadCellSx, { px: 0.2 }] as SxProps<Theme>}>
							{t('balance')}
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody sx={statsTableBodySx}>
					{playersStats.map((pStats) => (
						<Row
							key={pStats.userId || pStats.username}
							pStats={pStats}
							nodes={nodes}
							chartLoading={chartsRequested && loading}
							chartError={chartsRequested ? error : undefined}
							highlight={highlightsByUserId[pStats.userId]}
							highlightsLoading={chartsRequested && highlightsLoading}
							onExpand={() => setChartsRequested(true)}
						/>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
