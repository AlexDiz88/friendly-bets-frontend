import {
	Avatar,
	Box,
	CircularProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getActiveSeason, getActiveSeasonId } from '../features/admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../features/admin/seasons/selectors';
import SeasonResponseError from '../features/admin/seasons/types/SeasonResponseError';
import { selectAllStatsByTeamsInSeason } from '../features/stats/selectors';
import { getAllStatsByTeamsInSeason } from '../features/stats/statsSlice';
import StatsTableByTeams from './StatsTableByTeams';
import pathToAvatarImage from './utils/pathToAvatarImage';
import pathToLogoImage from './utils/pathToLogoImage';

export default function TeamsStatsPage(): JSX.Element {
	const navigate = useNavigate();
	const activeSeason = useAppSelector(selectActiveSeason);
	const statsByTeams = useAppSelector(selectAllStatsByTeamsInSeason);
	const dispatch = useAppDispatch();
	const [selectedLeagueName, setSelectedLeagueName] = useState<string>('');
	const [selectedPlayerName, setSelectedPlayerName] = useState<string>('Все');
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const filteredStats =
		selectedPlayerName === 'Все'
			? statsByTeams.filter(
					(stats) => stats.leagueStats && stats.leagueNameRu === selectedLeagueName
			  )
			: statsByTeams.filter(
					(stats) =>
						!stats.leagueStats &&
						stats.username === selectedPlayerName &&
						stats.leagueNameRu === selectedLeagueName
			  );

	const handleLeagueChange = (event: SelectChangeEvent): void => {
		const leagueName = event.target.value;
		setSelectedLeagueName(leagueName);
	};

	const handlePlayerChange = (event: SelectChangeEvent): void => {
		const playerName = event.target.value;
		setSelectedPlayerName(playerName);
	};

	useEffect(() => {
		if (statsByTeams && statsByTeams.length > 0) {
			setSelectedLeagueName(statsByTeams[0].leagueNameRu || '');
		}
	}, [statsByTeams]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, []);

	useEffect(() => {
		if (!activeSeason) {
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
	}, [dispatch]);

	useEffect(() => {
		if (activeSeason) {
			dispatch(getAllStatsByTeamsInSeason(activeSeason.id))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeason]);

	return (
		<Box>
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
						<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>
							Подождите идёт загрузка данных
						</Box>
						<CircularProgress sx={{ mt: 5 }} size={100} color="primary" />
					</Box>
				) : (
					<Box>
						{loadingError ? (
							<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>
								Ошибка загрузки. Попробуйте обновить страницу
							</Box>
						) : (
							<Box
								sx={{
									maxWidth: '25rem',
									margin: '0 auto',
									mt: -2,
									pt: 2.5,
									boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'center',
									}}
								>
									<Select
										autoWidth
										size="small"
										sx={{ minWidth: '7rem', ml: -0.2 }}
										labelId="league-title-label"
										id="league-title-select"
										value={selectedLeagueName}
										onChange={handleLeagueChange}
									>
										{activeSeason &&
											activeSeason.leagues &&
											activeSeason.leagues.map((l) => (
												<MenuItem
													sx={{ ml: -0.5, minWidth: '6.5rem' }}
													key={l.id}
													value={l.displayNameRu}
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
															src={pathToLogoImage(l.shortNameEn)}
														/>
														<Typography sx={{ mx: 1, fontSize: '1rem' }}>
															{l.shortNameRu}
														</Typography>
													</div>
												</MenuItem>
											))}
									</Select>

									<Select
										autoWidth
										size="small"
										sx={{ minWidth: '11.5rem', ml: 0.5 }}
										labelId="player-title-label"
										id="player-title-select"
										value={selectedPlayerName}
										onChange={handlePlayerChange}
									>
										<MenuItem key="Все" sx={{ ml: -0.5, minWidth: '11rem' }} value="Все">
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
													src="/upload/avatars/cool_man.jpg"
												/>

												<Typography sx={{ mx: 1, fontSize: '1rem' }}>Все</Typography>
											</div>
										</MenuItem>
										{activeSeason &&
											activeSeason.players
												.slice()
												.sort((a, b) =>
													a.username && b.username ? a.username.localeCompare(b.username) : 0
												)
												.map((p) => (
													<MenuItem
														key={p.id}
														sx={{ ml: -1, minWidth: '6.5rem' }}
														value={p.username}
													>
														<div
															style={{
																display: 'flex',
																alignItems: 'center',
															}}
														>
															<Avatar
																sx={{ width: 27, height: 27 }}
																alt="user_avatar"
																src={pathToAvatarImage(p.avatar)}
															/>

															<Typography sx={{ mx: 1, fontSize: '1rem' }}>{p.username}</Typography>
														</div>
													</MenuItem>
												))}
									</Select>
								</Box>
								<StatsTableByTeams playersStatsByTeams={filteredStats} />
							</Box>
						)}
					</Box>
				)}
			</Box>
		</Box>
	);
}
