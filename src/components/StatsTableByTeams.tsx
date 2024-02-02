import { useState } from 'react';
import {
	TableContainer,
	Paper,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Avatar,
	Box,
	Collapse,
	IconButton,
	Typography,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayerStatsByTeams from '../features/stats/types/PlayerStatsByTeams';
import TeamStats from '../features/stats/types/TeamStats';
import pathToLogoImage from './utils/pathToLogoImage';

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
						alt="user_avatar"
						src={pathToLogoImage(tStats.team.fullTitleEn)}
					/>
					<Box
						sx={{
							fontSize: '0.9rem',
							textAlign: 'left',
							maxWidth: '6.5rem',
							textOverflow: 'hidden',
						}}
					>
						{tStats.team.fullTitleRu}
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
								Доп.статистика ({tStats.team.fullTitleRu})
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableBody>
									<TableRow>
										<TableCell align="center">Всего ставок сделано:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#ddd9c4', px: 1, py: 0.5 }}>
											<b>{tStats.betCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">Ставок выиграно:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#e0f3e5', px: 1, py: 0.5 }}>
											<b>{tStats.wonBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">Ставок вернулось:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#f9f8d9', px: 1, py: 0.5 }}>
											<b>{tStats.returnedBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">Ставок проиграно:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#f9d9d9', px: 1, py: 0.5 }}>
											<b>{tStats.lostBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ p: 0, py: 0.5 }}>
											Процент выигранных ставок:
										</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#c3cdf0', px: 1, py: 0.5 }}>
											<b>{tStats.winRate.toFixed(1)}%</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">Средний кэф:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#e0cde9', px: 1, py: 0.5 }}>
											<b>{tStats.averageOdds.toFixed(2)}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ fontSize: '0.82rem', px: 0, py: 0.5 }}>
											Средний кэф(выигранных ставок):
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

export default function StatsTableByTeams({
	playersStatsByTeams,
}: {
	playersStatsByTeams: PlayerStatsByTeams[];
}): JSX.Element {
	return (
		<TableContainer component={Paper} sx={{ pt: 1.5 }}>
			<Table aria-label="collapsible table">
				<TableHead sx={{ bgcolor: '#2d2d32', border: 2 }}>
					<TableRow>
						<TableCell />
						<TableCell align="left" sx={{ color: 'white', fontWeight: 600, py: 0.5 }}>
							Команда
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
							Ставки
						</TableCell>
						<TableCell align="center" sx={{ color: 'white', fontWeight: 600, px: 0.5, py: 0 }}>
							%
						</TableCell>
						<TableCell align="center" sx={{ color: 'white', fontWeight: 600, py: 0.5, px: 0 }}>
							Баланс
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody sx={{ border: 2 }}>
					{playersStatsByTeams.map((pStats) =>
						pStats.teamStats
							.slice()
							.sort((a, b) => b.actualBalance - a.actualBalance)
							.map((tStats) => <Row key={tStats.team.fullTitleRu} tStats={tStats} />)
					)}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
