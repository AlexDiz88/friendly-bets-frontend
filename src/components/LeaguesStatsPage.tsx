import {
	Avatar,
	Box,
	CircularProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getActiveSeasonId } from '../features/admin/seasons/seasonsSlice';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import SeasonResponseError from '../features/admin/seasons/types/SeasonResponseError';
import { selectPlayersStatsByLeagues } from '../features/stats/selectors';
import { getAllPlayersStatsByLeagues } from '../features/stats/statsSlice';
import LeagueStats from '../features/stats/types/LeagueStats';
import StatsTable from './StatsTable';
import pathToLogoImage from './utils/pathToLogoImage';

export default function LeaguesStatsPage(): JSX.Element {
	const navigate = useNavigate();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const statsByLeagues: LeagueStats[] = useAppSelector(selectPlayersStatsByLeagues);
	const dispatch = useAppDispatch();
	const [selectedLeague, setSelectedLeague] = useState<LeagueStats | undefined>(undefined);
	const [selectedLeagueName, setSelectedLeagueName] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats = selectedLeague
		? [...selectedLeague.playersStats].sort((a, b) => b.actualBalance - a.actualBalance)
		: [];

	const handleLeagueChange = (event: SelectChangeEvent): void => {
		const leagueName = event.target.value;
		const league = statsByLeagues.find((l) => l.simpleLeague.leagueCode === leagueName);
		setSelectedLeagueName(leagueName);
		setSelectedLeague(league || undefined);
	};

	useEffect(() => {
		if (statsByLeagues?.length === 1) {
			setSelectedLeagueName(statsByLeagues[0].simpleLeague.leagueCode);
			setSelectedLeague(statsByLeagues[0]);
		}
	}, [statsByLeagues]);

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId())
				.unwrap()
				.then(() => {
					setLoading(false);
				})
				.catch((error: SeasonResponseError) => {
					if (error.message === 'Сезон со статусом ACTIVE не найден') {
						navigate('/no-active-season');
					} else {
						setLoadingError(true);
					}
					setLoading(false);
				});
		}
	}, []);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllPlayersStatsByLeagues(activeSeasonId))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeasonId, dispatch]);

	return (
		<Box>
			{loading ? (
				<Box
					sx={{
						height: '70vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>{t('loading')}</Box>
					<CircularProgress sx={{ mt: 5 }} size={100} color="primary" />
				</Box>
			) : (
				<Box>
					{loadingError ? (
						<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>
							{t('loadingError')}
						</Box>
					) : (
						<Box
							sx={{
								maxWidth: '25rem',
								margin: '0 auto',
								mt: -1.5,
								pt: 0,
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
							}}
						>
							<Box
								sx={{
									p: 1,
									textAlign: 'center',
									fontWeight: 600,
									fontSize: '0.95rem',
								}}
							>
								{t('chooseLeagueForDetailedStatistik')}
							</Box>
							<Select
								size="small"
								sx={{ minWidth: '12rem', mx: 1, mb: 1 }}
								labelId="league-stats-label"
								id="league-stats-select"
								value={selectedLeagueName}
								onChange={handleLeagueChange}
							>
								{statsByLeagues.map((stats) => (
									<MenuItem
										key={stats.simpleLeague.leagueCode}
										value={stats.simpleLeague.leagueCode}
										sx={{ ml: -0.5, minWidth: '11rem' }}
									>
										<div
											style={{
												display: 'flex',
												alignItems: 'center',
											}}
										>
											<Avatar
												variant="square"
												sx={{ width: 27, height: 27 }}
												alt="league_logo"
												src={pathToLogoImage(stats.simpleLeague.leagueCode)}
											/>
											<Typography sx={{ mx: 1, fontSize: '1rem' }}>
												{t(`leagueFullName.${stats.simpleLeague.leagueCode}`)}
											</Typography>
										</div>
									</MenuItem>
								))}
							</Select>
							<StatsTable playersStats={sortedPlayersStats} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
