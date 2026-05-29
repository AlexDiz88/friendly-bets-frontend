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
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import StatsTableIdentityCell, { STATS_COLLAPSE_MS } from './StatsTableIdentityCell';
import {
	statsBalanceNegativeSx,
	statsBalancePositiveSx,
	statsBalanceCellSx,
	statsBetsCellSx,
	statsBodyDataCellSx,
	statsPercentCellSx,
	statsCollapseRowCellSx,
	statsDetailValueSx,
	statsExpandIconSx,
	statsExpandableRowSx,
	statsExpandedRingSx,
	statsExpandedTitleSx,
	statsIdentityCellSx,
	statsLeadingSx,
	statsPlayerNameSx,
	statsTableBodySx,
	statsTableContainerSx,
	statsTableHeadCellSx,
	statsTableHeadSx,
} from './statsPageStyles';
import PlayerStats from './types/PlayerStats';

function Row({ pStats }: { pStats: PlayerStats }): JSX.Element {
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
						<Box sx={{ margin: 0, textAlign: 'center' }}>
							<Typography component="div" sx={statsExpandedTitleSx}>
								{t('additionalStats')} ({pStats.username})
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableBody>
									<TableRow>
										<TableCell align="center">{t('totalBetsCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('total')}>
											<b>{pStats.totalBets}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsWonCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('won')}>
											<b>{pStats.wonBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsReturnedCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('returned')}>
											<b>{pStats.returnedBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsLostCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('lost')}>
											<b>{pStats.lostBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('emptyBetsCount')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('empty')}>
											<b>{pStats.emptyBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ p: 0, py: 0.5 }}>
											{t('winPercentage')}:
										</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('winRate')}>
											<b>{pStats.winRate.toFixed(1)}%</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('averageCoef')}:</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('avgOdds')}>
											<b>{pStats.averageOdds.toFixed(2)}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ fontSize: '0.82rem', px: 0, py: 0.5 }}>
											{t('averageWinCoef')}:
										</TableCell>
										<TableCell align="center" sx={statsDetailValueSx('avgWinOdds')}>
											<b>{pStats.averageWonBetOdds.toFixed(2)}</b>
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

export default function PlayersStats({
	playersStats,
}: {
	playersStats: PlayerStats[];
}): JSX.Element {
	return (
		<TableContainer component={Paper} elevation={0} sx={statsTableContainerSx}>
			<Table aria-label="collapsible table" size="small">
				<TableHead sx={statsTableHeadSx}>
					<TableRow>
						<TableCell
							align="left"
							sx={[statsTableHeadCellSx, { pl: { xs: 1.5, sm: 3.5 } }] as SxProps<Theme>}
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
						<Row key={pStats.username} pStats={pStats} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
