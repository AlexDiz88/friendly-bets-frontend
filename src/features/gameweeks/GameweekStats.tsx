import AssessmentIcon from '@mui/icons-material/Assessment';
import MobiledataOffIcon from '@mui/icons-material/MobiledataOff';
import MovingIcon from '@mui/icons-material/Moving';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import {
	Box,
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
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { useAppSelector } from '../../app/hooks';
import UserAvatar from '../../components/custom/avatar/UserAvatar';
import Calendar from '../admin/calendars/types/Calendar';
import { selectActiveSeason } from '../admin/seasons/selectors';
import {
	statsBalanceNegativeSx,
	statsBalancePositiveSx,
	statsTableBodySx,
	statsTableContainerSx,
	statsTableHeadCellSx,
	statsTableHeadSx,
	statsThemePalette,
} from '../stats/statsPageStyles';

const GameweekStats = ({ calendarNode }: { calendarNode: Calendar }): JSX.Element => {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';
	const p = statsThemePalette(theme);
	const activeSeason = useAppSelector(selectActiveSeason);
	const sortedStats = [...calendarNode.gameweekStats].sort(
		(a, b) => b.totalBalance - a.totalBalance
	);

	const tableContainerSx: SxProps<Theme> = isDark
		? ([statsTableContainerSx, { maxWidth: '100%', overflowX: 'auto' }] as SxProps<Theme>)
		: {
				maxWidth: '100%',
				overflowX: 'auto',
				backgroundColor: '#f5f5f5',
				border: 2,
				boxShadow: '1px 4px 7px rgba(0, 0, 60, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.7)',
				borderRadius: 2,
			};

	const headRowLightSx: SxProps<Theme> = {
		fontWeight: 600,
		color: 'whitesmoke',
		background: 'linear-gradient(45deg, #f6d365, #fda085)',
	};

	return (
		<Box sx={{ maxWidth: '25rem', m: '0 auto', my: 2 }}>
			{calendarNode.isFinished ? (
				<Box>
					<TableContainer
						component={isDark ? Paper : 'div'}
						elevation={isDark ? 0 : undefined}
						sx={tableContainerSx}
					>
						<Table size={isDark ? 'small' : 'medium'}>
							<TableHead sx={isDark ? statsTableHeadSx : undefined}>
								<TableRow sx={isDark ? undefined : headRowLightSx}>
									<TableCell
										align="left"
										sx={
											isDark
												? ([
														statsTableHeadCellSx,
														{ pl: 1, py: 1.5, minWidth: '40%', lineHeight: 1.2 },
													] as SxProps<Theme>)
												: {
														pl: 1,
														py: 1.5,
														borderBottom: 1,
														minWidth: '40%',
														lineHeight: 1.2,
													}
										}
									>
										{isDark ? t('playerName') : <b>{t('playerName')}</b>}
									</TableCell>

									<TableCell
										align="center"
										sx={
											isDark
												? ([
														statsTableHeadCellSx,
														{
															width: '10%',
															px: 0.5,
															lineHeight: 1.2,
															fontSize: '0.85rem',
															whiteSpace: 'normal',
														},
													] as SxProps<Theme>)
												: {
														width: '10%',
														px: 0.5,
														borderBottom: 1,
														lineHeight: 1.2,
														fontSize: '0.85rem',
														whiteSpace: 'normal',
													}
										}
									>
										{isDark ? t('weekChange') : <b>{t('weekChange')}</b>}
									</TableCell>

									<TableCell
										align="center"
										sx={
											isDark
												? ([
														statsTableHeadCellSx,
														{
															width: '10%',
															lineHeight: 1.2,
															fontSize: '0.85rem',
															whiteSpace: 'normal',
														},
													] as SxProps<Theme>)
												: {
														width: '10%',
														borderBottom: 1,
														lineHeight: 1.2,
														fontSize: '0.85rem',
														whiteSpace: 'normal',
													}
										}
									>
										{isDark ? t('positionChange') : <b>{t('positionChange')}</b>}
									</TableCell>

									<TableCell
										align="center"
										sx={
											isDark
												? ([
														statsTableHeadCellSx,
														{
															width: '15%',
															px: 0.75,
															lineHeight: 1.2,
															fontSize: '0.85rem',
															whiteSpace: 'normal',
														},
													] as SxProps<Theme>)
												: {
														width: '15%',
														px: 0.5,
														borderBottom: 1,
														lineHeight: 1.2,
														fontSize: '0.85rem',
														whiteSpace: 'normal',
													}
										}
									>
										{isDark ? t('afterGameweek') : <b>{t('afterGameweek')}</b>}
									</TableCell>
								</TableRow>
							</TableHead>
							<TableBody sx={isDark ? statsTableBodySx : undefined}>
								{sortedStats.map((s) => {
									const player = activeSeason?.players.find((p) => p.id === s.userId);
									const weekBalance = s.balanceChange.toFixed(2);
									const totalBalanceAfterWeek = s.totalBalance.toFixed(2);
									const weekPositive = s.balanceChange >= 0;
									const totalPositive = s.totalBalance >= 0;
									return (
										<TableRow
											key={s.userId}
											sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
											<TableCell
												component="th"
												scope="row"
												align="left"
												sx={isDark ? { color: p.name } : undefined}
											>
												<UserAvatar
													player={player}
													height={32}
													sx={
														isDark
															? { my: 0.1, mb: 0, ml: 0, color: p.name }
															: { my: 0.1 }
													}
												/>
											</TableCell>
											<TableCell align="center">
												<Typography
													sx={
														isDark
															? ([
																	weekPositive
																		? statsBalancePositiveSx
																		: statsBalanceNegativeSx,
																	{ fontSize: '0.9rem' },
																] as SxProps<Theme>)
															: { fontWeight: 600, fontSize: '0.9rem' }
													}
													color={isDark ? undefined : weekPositive ? 'green' : 'red'}
												>
													{weekPositive ? `+${weekBalance}` : weekBalance}€
												</Typography>
											</TableCell>

											<TableCell align="center">
												<Box display="flex" justifyContent="center" alignItems="center">
													{s.positionChange > 0 && (
														<MovingIcon
															sx={{ color: isDark ? p.positive : 'green' }}
														/>
													)}
													{s.positionChange < 0 && (
														<TrendingDownIcon
															sx={{ color: isDark ? p.negative : 'red' }}
														/>
													)}
													{s.positionChange === 0 && (
														<MobiledataOffIcon
															sx={{ color: isDark ? p.expandIconMuted : 'grey' }}
														/>
													)}
													{s.positionChange !== 0 && (
														<Typography
															sx={{
																m: 0,
																fontWeight: 600,
																fontSize: '1.rem',
																color: isDark ? p.bodyText : undefined,
															}}
														>
															{Math.abs(s.positionChange)}
														</Typography>
													)}
												</Box>
											</TableCell>

											<TableCell align="center">
												<Typography
													sx={
														isDark
															? ([
																	totalPositive
																		? statsBalancePositiveSx
																		: statsBalanceNegativeSx,
																	{ pr: 0.5 },
																] as SxProps<Theme>)
															: { fontWeight: 'bold', fontSize: '1.05rem', pr: 0.5 }
													}
													color={isDark ? undefined : totalPositive ? 'green' : 'red'}
												>
													{totalPositive
														? `+${totalBalanceAfterWeek}`
														: totalBalanceAfterWeek}
													€
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
							px: 2,
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
							'@keyframes shine': { '0%': { right: '220%' }, '100%': { right: '-250%' } },
						}}
					>
						<AssessmentIcon sx={{ color: '#D22D90', marginRight: 2, scale: '150%' }} />
						<Typography variant="body1" sx={{ color: 'black', fontWeight: 'bold' }}>
							{t('statsWillBeAddedWhenGameweekFinished')}
						</Typography>
					</Box>
				</>
			)}
		</Box>
	);
};

export default GameweekStats;
