import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {
	Box,
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
import { useState } from 'react';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import StatsTableIdentityCell, { STATS_COLLAPSE_MS } from './StatsTableIdentityCell';
import {
	statsBalanceNegativeSx,
	statsBalancePositiveSx,
	statsBalanceCellSx,
	statsBetsCellSx,
	statsCollapseRowCellSx,
	statsDetailValueSx,
	statsExpandIconSx,
	statsExpandableRowSx,
	statsLeadingSx,
	statsPercentCellSx,
	statsPlayerNameSx,
	statsTableBodySx,
	statsTableContainerSx,
	statsTableHeadCellSx,
	statsTableHeadSx,
	statsExpandedTitleSx,
} from './statsPageStyles';
import PlayerStatsByTeams from './types/PlayerStatsByTeams';
import TeamStats from './types/TeamStats';

interface RowProps {
	tStats: TeamStats;
}

function Row({ tStats }: RowProps): JSX.Element {
	const [open, setOpen] = useState(false);
	const toggleOpen = (): void => setOpen((prev) => !prev);

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
					avatarVariant="square"
					leading={<KeyboardArrowDownIcon sx={statsExpandIconSx(open)} />}
					leadingSx={statsLeadingSx(open)}
					avatarSrc={pathToLogoImage(tStats.team.title)}
					avatarAlt="team_logo"
					avatarSize={24}
					label={t(`teams:${tStats.team.title}`)}
					labelSx={statsPlayerNameSx}
				/>
				<TableCell align="center" sx={statsBetsCellSx}>
					[{tStats.wonBetCount}-{tStats.returnedBetCount}-{tStats.lostBetCount}]
				</TableCell>
				<TableCell align="center" sx={statsPercentCellSx}>
					{tStats.winRate.toFixed(0)}
				</TableCell>
				<TableCell
					align="center"
					sx={
						[
							statsBalanceCellSx,
							tStats.actualBalance >= 0 ? statsBalancePositiveSx : statsBalanceNegativeSx,
						] as SxProps<Theme>
					}
				>
					{tStats.actualBalance.toFixed(2)}€
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={4}
					sx={statsCollapseRowCellSx}
					style={{ paddingBottom: 0, paddingTop: 0 }}
				>
					<Collapse in={open} timeout={STATS_COLLAPSE_MS} unmountOnExit>
						<Box sx={{ margin: 0, textAlign: 'center' }}>
							<Typography component="div" sx={statsExpandedTitleSx}>
								{t('additionalStats')} ({tStats.team.title})
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableBody>
									<TableRow>
										<TableCell align="center">{t('totalBetsCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('total')}>
											<b>{tStats.betCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsWonCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('won')}>
											<b>{tStats.wonBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsReturnedCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('returned')}>
											<b>{tStats.returnedBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsLostCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('lost')}>
											<b>{tStats.lostBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ p: 0, py: 0.5 }}>
											{t('winPercentage')}:
										</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('winRate')}>
											<b>{tStats.winRate.toFixed(1)}%</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('averageCoef')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('avgOdds')}>
											<b>{tStats.averageOdds.toFixed(2)}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ fontSize: '0.82rem', px: 0, py: 0.5 }}>
											{t('averageWinCoef')}:
										</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('avgWinOdds')}>
											<b>{tStats.averageWonBetOdds.toFixed(2)}</b>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</Box>
					</Collapse>
				</TableCell>
			</TableRow>
		</>
	);
}

export default function TeamsStats({
	playersStatsByTeams,
}: {
	playersStatsByTeams: PlayerStatsByTeams;
}): JSX.Element {
	return (
		<TableContainer component={Paper} elevation={0} sx={statsTableContainerSx}>
			<Table aria-label="collapsible table" size="small">
				<TableHead sx={statsTableHeadSx}>
					<TableRow>
						<TableCell
							align="left"
							sx={[statsTableHeadCellSx, { pl: 3.5 }] as SxProps<Theme>}
						>
							{t('team')}
						</TableCell>
						<TableCell
							align="center"
							sx={
								[statsTableHeadCellSx, { fontSize: '0.75rem', px: 0.2 }] as SxProps<Theme>
							}
						>
							{t('bets')}
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
					{playersStatsByTeams.teamStats
						.slice()
						.sort((a, b) => b.actualBalance - a.actualBalance)
						.map((tStats) => (
							<Row key={tStats.team.title} tStats={tStats} />
						))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
