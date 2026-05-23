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
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import StatsTableIdentityCell from './StatsTableIdentityCell';
import PlayerStats from './types/PlayerStats';

const expandableRowSx = (open: boolean) =>
	({
		'& > *': { borderBottom: 'unset' },
		cursor: 'pointer',
		userSelect: 'none',
		WebkitTapHighlightColor: 'transparent',
		transition: 'background-color 0.35s ease',
		bgcolor: open ? 'rgba(25, 118, 210, 0.06)' : 'transparent',
	}) as const;

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
				sx={expandableRowSx(open)}
				tabIndex={0}
			>
				<StatsTableIdentityCell
					expanded={open}
					leading={
						<KeyboardArrowDownIcon
							sx={{
								fontSize: 24,
								transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
								transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
							}}
						/>
					}
					avatarSrc={avatarBase64Converter(pStats.avatar)}
					avatarAlt="user_avatar"
					avatarSize={50}
					label={pStats.username}
					labelSx={{ fontSize: '0.9rem', maxWidth: '4.8rem' }}
				/>
				<TableCell align="center" sx={{ px: 0.25 }}>
					{pStats.betCount} ({pStats.totalBets})
				</TableCell>
				<TableCell align="center" sx={{ px: 0.25 }}>
					{pStats.winRate.toFixed(0)}
				</TableCell>
				<TableCell
					align="center"
					sx={{
						px: 1,
						fontSize: '1rem',
						fontWeight: 600,
						color: pStats.actualBalance >= 0 ? 'green' : 'red',
					}}
				>
					{pStats.actualBalance.toFixed(2)}€
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
								{t('additionalStats')} ({pStats.username})
							</Typography>
							<Table size="small" aria-label="purchases">
								<TableBody>
									<TableRow>
										<TableCell align="center">{t('totalBetsCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#ddd9c4', px: 1, py: 0.5 }}>
											<b>{pStats.totalBets}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsWonCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#e0f3e5', px: 1, py: 0.5 }}>
											<b>{pStats.wonBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsReturnedCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#f9f8d9', px: 1, py: 0.5 }}>
											<b>{pStats.returnedBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('betsLostCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#f9d9d9', px: 1, py: 0.5 }}>
											<b>{pStats.lostBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('emptyBetsCount')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#e0dfe4', px: 1, py: 0.5 }}>
											<b>{pStats.emptyBetCount}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ p: 0, py: 0.5 }}>
											{t('winPercentage')}:
										</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#c3cdf0', px: 1, py: 0.5 }}>
											<b>{pStats.winRate.toFixed(1)}%</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center">{t('averageCoef')}:</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#e0cde9', px: 1, py: 0.5 }}>
											<b>{pStats.averageOdds.toFixed(2)}</b>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell align="center" sx={{ fontSize: '0.82rem', px: 0, py: 0.5 }}>
											{t('averageWinCoef')}:
										</TableCell>
										<TableCell align="center" sx={{ bgcolor: '#d3edf2', px: 1, py: 0.5 }}>
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
		<TableContainer component={Paper}>
			<Table aria-label="collapsible table">
				<TableHead sx={{ bgcolor: '#2d2d32', border: 2 }}>
					<TableRow>
						<TableCell
							align="left"
							sx={{ color: 'white', fontWeight: 600, py: 0.5, pl: 3.5, borderColor: 'black' }}
						>
							{t('playerName')}
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
							{t('totalBets')}
						</TableCell>
						<TableCell align="center" sx={{ color: 'white', fontWeight: 600, px: 0.5, py: 0.5 }}>
							%
						</TableCell>
						<TableCell align="center" sx={{ color: 'white', fontWeight: 600, py: 0.5 }}>
							{t('balance')}
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody sx={{ border: 2 }}>
					{playersStats.map((pStats) => (
						<Row key={pStats.username} pStats={pStats} />
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
}
