import AssessmentIcon from '@mui/icons-material/Assessment';
import MobiledataOffIcon from '@mui/icons-material/MobiledataOff';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useAppSelector } from '../../app/hooks';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import Calendar from '../admin/calendars/types/Calendar';
import { selectActiveSeason } from '../admin/seasons/selectors';

const GameweekStats = ({ calendarNode }: { calendarNode: Calendar }): JSX.Element => {
	const activeSeason = useAppSelector(selectActiveSeason);
	const sortedStats = [...calendarNode.gameweekStats].sort(
		(a, b) => b.totalBalance - a.totalBalance
	);

	return (
		<Box sx={{ maxWidth: '25rem', m: '0 auto', my: 3 }}>
			{calendarNode.isFinished ? (
				<Box>
					<TableContainer
						sx={{
							maxWidth: '100%',
							overflowX: 'auto',
							backgroundColor: '#f5f5f5',
							border: 2,
							borderRadius: 2,
						}}
					>
						<Table>
							<TableHead>
								<TableRow
									sx={{
										fontWeight: 600,
										color: 'whitesmoke',
										background: 'linear-gradient(45deg, #f6d365, #fda085)',
										// background: 'linear-gradient(45deg, #6a11cb, #2575fc)',
										// background: 'linear-gradient(45deg, #ff9a9e, #fad0c4)',
										// background: 'linear-gradient(45deg, #56ccf2, #2f80ed)',
										// background: 'linear-gradient(45deg, #a1c4fd, #c2e9fb)',
									}}
								>
									<TableCell
										align="left"
										sx={{ pl: 1, py: 1.5, borderBottom: 1, minWidth: '40%', lineHeight: 1.2 }}
									>
										<b>{t('playerName')}</b>
									</TableCell>

									<TableCell
										align="center"
										sx={{ width: '15%', px: 0.5, borderBottom: 1, lineHeight: 1.2 }}
									>
										<b>{t('weekChange')}</b>
									</TableCell>

									<TableCell
										align="center"
										sx={{ width: '10%', borderBottom: 1, lineHeight: 1.2, fontSize: '0.85rem' }}
									>
										<b>{t('positionChange')}</b>
									</TableCell>

									<TableCell
										align="center"
										sx={{ width: '20%', px: 0.5, borderBottom: 1, lineHeight: 1.2 }}
									>
										<b>{t('afterGameweek')}</b>
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{sortedStats.map((s) => {
									const player = activeSeason?.players.find((p) => p.id === s.userId);
									const weekBalance = s.balanceChange.toFixed(2);
									const totalBalanceAfterWeek = s.totalBalance.toFixed(2);
									return (
										<TableRow
											key={s.userId}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell component="th" scope="row" align="left">
												<UserAvatar player={player} height={32} sx={{ my: 0.1 }} />
											</TableCell>
											<TableCell align="center">
												<Typography
													sx={{ fontWeight: 600, fontSize: '0.9rem' }}
													color={s.balanceChange >= 0 ? 'green' : 'red'}
												>
													{s.balanceChange >= 0 ? `+${weekBalance}` : weekBalance}
												</Typography>
											</TableCell>

											<TableCell align="center">
												<Box display="flex" justifyContent="center" alignItems="center">
													{s.positionChange > 0 && <MovingIcon sx={{ color: 'green' }} />}
													{s.positionChange < 0 && <TrendingDownIcon sx={{ color: 'red' }} />}
													{s.positionChange === 0 && <MobiledataOffIcon sx={{ color: 'grey' }} />}
													{s.positionChange !== 0 && (
														<Typography sx={{ m: 0, fontWeight: 600, fontSize: '1.rem' }}>
															{Math.abs(s.positionChange)}
														</Typography>
													)}
												</Box>
											</TableCell>

											<TableCell align="center">
												<Typography
													color={s.totalBalance >= 0 ? 'green' : 'red'}
													fontWeight="bold"
													fontSize="1.1rem"
												>
													{s.totalBalance >= 0
														? `+${totalBalanceAfterWeek}`
														: totalBalanceAfterWeek}
												</Typography>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Box>
			) : (
				<>
					<Box
						sx={{
							mx: 1.5,
							borderRadius: 2,
							border: 2,
							background: 'linear-gradient(45deg, #F6D465CF, #FD9F85C2)',
							backdropFilter: 'blur(10px)',
							padding: 3,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							boxShadow: '0px 4px 15px rgba(0, 0, 0, 1)',
							position: 'relative',
							overflow: 'hidden',
							'&:after': {
								content: '""',
								position: 'absolute',
								top: 0,
								right: '200%',
								width: '100%',
								height: '100%',
								background:
									'linear-gradient(120deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%,  rgba(255, 255, 255, 0) 75%, rgba(255, 255, 255, 0) 100%)',
								transform: 'skewX(-35deg)',
								animation: 'shine 5s linear infinite',
							},
						}}
					>
						<AssessmentIcon sx={{ color: '#D22D90', marginRight: 2, scale: '150%' }} />
						<Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>
							{t('statsWillBeAddedWhenGameweekFinished')}
						</Typography>
					</Box>

					<style>{`@keyframes shine {0% { right: 220%; } 100% { right: -250%; }}`}</style>
				</>
			)}
		</Box>
	);
};

export default GameweekStats;
