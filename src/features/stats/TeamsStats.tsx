import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Avatar,
	Box,
	Collapse,
	IconButton,
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
import PlayerStatsByTeams from './types/PlayerStatsByTeams';
import TeamStats from './types/TeamStats';

interface RowProps {
	tStats: TeamStats;
}

function Row({ tStats }: RowProps): JSX.Element {
	const [open, setOpen] = useState(false);

	return (
		<>
			<TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
				<TableCell sx={{ px: 0 }}>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
						sx={{ ml: 0, px: 0 }}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell>
				<TableCell
					component="th"
					scope="row"
					align="center"
					size="small"
					sx={{
						ml: -1.5,
						p: 0,
						height: '2rem',
						display: 'flex',
						alignItems: 'center',
						fontWeight: 600,
					}}
				>
					<Avatar
						sx={{ mx: 0.5, width: 27, height: 27, border: 0 }}
						alt="team_logo"
						src={pathToLogoImage(tStats.team.title)}
					/>
					<Box
						sx={{
							fontSize: '0.9rem',
							textAlign: 'left',
							maxWidth: '6.5rem',
							textOverflow: 'hidden',
						}}
					>
						{t(`teams:${tStats.team.title}`)}
					</Box>
				</TableCell>
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
				<TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
					<Collapse in={open} timeout="auto" unmountOnExit>
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
						<TableCell />
						<TableCell align="left" sx={{ color: 'white', fontWeight: 600, py: 0.5 }}>
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
