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
} from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import StatsTableIdentityCell from './StatsTableIdentityCell';
import { statsPlayerNameSx } from './statsPageStyles';
import PlayerStatsByTeams from './types/PlayerStatsByTeams';
import TeamStats from './types/TeamStats';

interface RowProps {
	tStats: TeamStats;
}

const expandableRowSx = (open: boolean) =>
	({
		'& > *': { borderBottom: 'unset' },
		cursor: 'pointer',
		userSelect: 'none',
		WebkitTapHighlightColor: 'transparent',
		transition: 'background-color 0.35s ease',
		bgcolor: open ? 'rgba(25, 118, 210, 0.06)' : 'transparent',
	}) as const;

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
				sx={expandableRowSx(open)}
				tabIndex={0}
			>
				<StatsTableIdentityCell
					expanded={open}
					avatarVariant="square"
					leading={
						<KeyboardArrowDownIcon
							sx={{
								fontSize: 22,
								transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
							}}
						/>
					}
					avatarSrc={pathToLogoImage(tStats.team.title)}
					avatarAlt="team_logo"
					avatarSize={27}
					label={t(`teams:${tStats.team.title}`)}
					labelSx={statsPlayerNameSx}
				/>
				<TableCell align="center" sx={{ px: 0, mx: 0 }}>
					[{tStats.wonBetCount}-{tStats.returnedBetCount}-{tStats.lostBetCount}]
				</TableCell>
				<TableCell align="center" sx={{ px: 0 }}>
					{tStats.winRate.toFixed(0)}
				</TableCell>
				<TableCell
					align="center"
					sx={{
						px: 0,
						mx: 0,
						fontSize: '1rem',
						fontWeight: 600,
						color: tStats.actualBalance >= 0 ? 'green' : 'red',
					}}
				>
					{tStats.actualBalance.toFixed(2)}€
				</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={4}
					sx={{ py: 0, borderTop: 0 }}
					style={{ paddingBottom: 0, paddingTop: 0 }}
				>
					<Collapse in={open} timeout={400} unmountOnExit>
						<Box sx={{ margin: 0, textAlign: 'center' }}>
							<Typography sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 0.5 }} component="div">
								{t('additionalStats')} ({tStats.team.title})
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableBody>
									<TableRow>
										<TableCell align="center">{t('totalBetsCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#ddd9c4', px: 1, py: 0.5 }}>
											<b>{tStats.betCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsWonCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#e0f3e5', px: 1, py: 0.5 }}>
											<b>{tStats.wonBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsReturnedCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#f9f8d9', px: 1, py: 0.5 }}>
											<b>{tStats.returnedBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsLostCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#f9d9d9', px: 1, py: 0.5 }}>
											<b>{tStats.lostBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ p: 0, py: 0.5 }}>
											{t('winPercentage')}:
										</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#c3cdf0', px: 1, py: 0.5 }}>
											<b>{tStats.winRate.toFixed(1)}%</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('averageCoef')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#e0cde9', px: 1, py: 0.5 }}>
											<b>{tStats.averageOdds.toFixed(2)}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ fontSize: '0.82rem', px: 0, py: 0.5 }}>
											{t('averageWinCoef')}:
										</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#d3edf2', px: 1, py: 0.5 }}>
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
		<TableContainer component={Paper} sx={{ pt: 1.5 }}>
			<Table aria-label="collapsible table">
				<TableHead sx={{ bgcolor: '#2d2d32', border: 2 }}>
					<TableRow>
						<TableCell align="left" sx={{ color: 'white', fontWeight: 600, py: 0.5, pl: 3.5 }}>
							{t('team')}
						</TableCell>
						<TableCell
							align="center"
							sx={{
								fontSize: '0.75rem',
								color: 'white',
								fontWeight: 600,
								px: 0,
								py: 0.5,
							}}
						>
							{t('bets')}
						</TableCell>
						<TableCell align="center" sx={{ color: 'white', fontWeight: 600, px: 0.5, py: 0 }}>
							%
						</TableCell>
						<TableCell align="center" sx={{ color: 'white', fontWeight: 600, py: 0.5, px: 0 }}>
							{t('balance')}
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody sx={{ border: 2 }}>
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
