import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	MenuItem,
	Select,
	SelectChangeEvent,
	Stack,
	Tab,
	Tabs,
	Typography,
} from '@mui/material';
import { selectActiveSeason, selectActiveSeasonId } from '../admin/seasons/selectors';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeason, getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import BetCard from './BetCard';
import CompleteBetCard from './CompleteBetCard';
import EmptyBetCard from './EmptyBetCard';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import pathToAvatarImage from '../../components/utils/pathToAvatarImage';
import { getCompletedBets, getOpenedBets } from './betsSlice';
import { selectCompletedBets, selectOpenedBets, selectTotalPages } from './selectors';
import { t } from 'i18next';
import SeasonResponseError from '../admin/seasons/types/SeasonResponseError';

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

function CustomTabPanel(props: TabPanelProps): JSX.Element {
	const { children, value, index } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Box>{children}</Box>
				</Box>
			)}
		</div>
	);
}

CustomTabPanel.defaultProps = {
	children: null,
};

function a11yProps(index: number): { id: string; 'aria-controls': string } {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

export default function BetsList(): JSX.Element {
	const navigate = useNavigate();
	const activeSeason = useAppSelector(selectActiveSeason);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const openedBets = useAppSelector(selectOpenedBets);
	const completedBets = useAppSelector(selectCompletedBets);
	const [filteredBets, setFilteredBets] = useState(openedBets);
	const totalPages = useAppSelector(selectTotalPages);
	const dispatch = useAppDispatch();
	const [value, setValue] = useState(0);
	const [selectedLeagueName, setSelectedLeagueName] = useState<string>('Все');
	const [selectedPlayerName, setSelectedPlayerName] = useState<string>('Все');
	const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
	const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
	const [page, setPage] = useState<number>(1);

	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const filterOpenedBets = (leagueName: string, playerName: string): void => {
		let filtered = openedBets;
		if (playerName === 'Все' && leagueName !== 'Все') {
			filtered = openedBets.filter((bet) => bet.leagueDisplayNameRu === leagueName);
		}
		if (playerName !== 'Все' && leagueName === 'Все') {
			filtered = openedBets.filter((bet) => bet.player.username === playerName);
		}
		if (playerName !== 'Все' && leagueName !== 'Все') {
			filtered = openedBets.filter(
				(bet) => bet.leagueDisplayNameRu === leagueName && bet.player.username === playerName
			);
		}
		setFilteredBets(filtered);
	};

	const handleLeagueChange = (event: SelectChangeEvent): void => {
		const leagueName = event.target.value;
		setSelectedLeagueName(leagueName);
		if (value === 0) {
			filterOpenedBets(leagueName, selectedPlayerName);
		}
		if (value === 1) {
			setPage(1);
			if (activeSeason) {
				const selectedLeague = activeSeason.leagues.find(
					(league) => league.displayNameRu === leagueName
				);

				if (selectedLeague) {
					const leagueId = selectedLeague.id;
					setSelectedLeagueId(leagueId);
				} else {
					setSelectedLeagueId('');
				}
			}
		}
	};

	const handlePlayerChange = (event: SelectChangeEvent): void => {
		const playerName = event.target.value;
		setSelectedPlayerName(playerName);
		if (value === 0) {
			filterOpenedBets(selectedLeagueName, playerName);
		}
		if (value === 1) {
			setPage(1);
			if (activeSeason) {
				const selectedPlayer = activeSeason.players.find((p) => p.username === playerName);
				if (selectedPlayer) {
					const playerId = selectedPlayer.id;
					setSelectedPlayerId(playerId);
				} else {
					setSelectedPlayerId('');
				}
			}
		}
	};

	const handleBetsTypeChange = (event: React.SyntheticEvent, newValue: number): void => {
		setValue(newValue);
		setSelectedLeagueName('Все');
		setSelectedPlayerName('Все');
		setSelectedLeagueId('');
		setSelectedPlayerId('');
		setPage(1);
	};

	const handlePageChange = (pageNumber: number): void => {
		setPage(pageNumber);
	};

	useEffect(() => {
		setFilteredBets(openedBets);
	}, [openedBets]);

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
	}, [dispatch]);

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId());
		}
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, []);

	useEffect(() => {
		if (value === 0) {
			setLoading(false);
			if (activeSeasonId) {
				dispatch(getOpenedBets({ seasonId: activeSeasonId }))
					.then(() => {
						setLoading(false);
					})
					.catch(() => {
						setLoadingError(true);
						setLoading(false);
					});
			}
			setLoading(true);
			setPage(1);
		}
	}, [dispatch, value, activeSeasonId]);

	useEffect(() => {
		if (value === 1) {
			let pageSize = '14';
			if (selectedPlayerName === 'Все' && selectedLeagueName !== 'Все') {
				pageSize = '7';
			}
			if (selectedPlayerName !== 'Все' && selectedLeagueName === 'Все') {
				pageSize = '4';
			}
			if (selectedPlayerName !== 'Все' && selectedLeagueName !== 'Все') {
				pageSize = '4';
			}
			if (activeSeasonId) {
				dispatch(
					getCompletedBets({
						seasonId: activeSeasonId,
						playerId: selectedPlayerId,
						leagueId: selectedLeagueId,
						pageSize,
						pageNumber: page - 1,
					})
				)
					.then(() => {
						setLoading(false);
					})
					.catch(() => {
						setLoadingError(true);
						setLoading(false);
					});
			}
			setLoading(true);
		}
	}, [dispatch, value, selectedPlayerName, selectedLeagueName, activeSeasonId, page]);

	return (
		<Box>
			<Box sx={{ display: 'flex', justifyContent: 'center' }}>
				<Tabs
					sx={{ mb: 1, mt: -2 }}
					value={value}
					onChange={handleBetsTypeChange}
					aria-label="basic tabs example"
				>
					<Tab
						component="span"
						sx={{
							fontWeight: 600,
							textTransform: 'none',
							fontSize: '1rem',
							pb: 0.5,
						}}
						label={t('openedBets')}
						id={a11yProps(0).id}
						aria-controls={a11yProps(0)['aria-controls']}
					/>
					<Tab
						component="span"
						sx={{
							fontWeight: 600,
							textTransform: 'none',
							fontSize: '1rem',
							pb: 0.5,
						}}
						label={t('completedBets')}
						id={a11yProps(1).id}
						aria-controls={a11yProps(1)['aria-controls']}
					/>
				</Tabs>
			</Box>

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
					<CircularProgress sx={{ mt: 5 }} size={100} color="primary" />
				</Box>
			) : (
				<>
					<Box sx={{ display: 'flex', justifyContent: 'center' }}>
						<Select
							autoWidth
							size="small"
							sx={{ minWidth: '7rem', ml: -0.2 }}
							labelId="league-title-label"
							id="league-title-select"
							value={selectedLeagueName}
							onChange={handleLeagueChange}
						>
							<MenuItem key="Все" sx={{ ml: -0.5, minWidth: '6.5rem' }} value="Все">
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
										// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
										src={`${import.meta.env.PUBLIC_URL || ''}/upload/logo/total.png`}
									/>

									<Typography sx={{ mx: 1, fontSize: '1rem' }}>Все</Typography>
								</div>
							</MenuItem>
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
												src={pathToLogoImage(l.displayNameEn)}
											/>
											<Typography sx={{ mx: 1, fontSize: '1rem' }}>{l.shortNameRu}</Typography>
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
										<MenuItem key={p.id} sx={{ ml: -1, minWidth: '6.5rem' }} value={p.username}>
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
					<Box>
						{loadingError ? (
							<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>
								Ошибка загрузки. Попробуйте обновить страницу
							</Box>
						) : (
							<Box>
								<Box sx={{ width: '100%' }}>
									<Box sx={{ mt: -2 }}>
										<CustomTabPanel value={value} index={0}>
											<Box
												sx={{
													display: 'flex',
													alignItems: 'center',
													flexDirection: 'column',
												}}
											>
												{filteredBets &&
													filteredBets.map((bet) => (
														<Box key={bet.id}>
															<BetCard bet={bet} />
														</Box>
													))}
											</Box>
										</CustomTabPanel>

										<CustomTabPanel value={value} index={1}>
											<Box
												sx={{
													display: 'flex',
													flexDirection: 'column',
													alignItems: 'center',
												}}
											>
												{completedBets &&
													Array.isArray(completedBets) &&
													completedBets.length > 0 &&
													completedBets.map((bet) => (
														<Box key={bet.id}>
															{bet.betStatus === 'EMPTY' ? (
																<EmptyBetCard bet={bet} />
															) : (
																<CompleteBetCard bet={bet} />
															)}
														</Box>
													))}
											</Box>
											<Stack
												sx={{
													marginTop: 2,
													display: 'flex',
													flexDirection: 'row',
													justifyContent: 'center',
												}}
											>
												<Button
													sx={{
														width: 60,
														padding: '10px 50px',
														backgroundColor: '#e2e7fd',
														color: 'black',
													}}
													variant="contained"
													disabled={page === 1}
													onClick={() => handlePageChange(page - 1)}
												>
													<Typography sx={{ fontSize: 20 }}>&lt;</Typography>
												</Button>
												<Button
													sx={{
														width: 60,
														padding: '10px 50px',
														margin: '0 15px',
														backgroundColor: '#afafaf',
													}}
													variant="contained"
													onClick={() => handlePageChange(page)}
												>
													<Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: 'Exo 2' }}>
														{page}
													</Typography>
												</Button>
												<Button
													sx={{
														width: 60,
														padding: '10px 50px',
														backgroundColor: '#e2e7fd',
														color: 'black',
													}}
													variant="contained"
													disabled={page === totalPages}
													onClick={() => handlePageChange(page + 1)}
												>
													<Typography sx={{ fontSize: 20 }}>&gt;</Typography>
												</Button>
											</Stack>
										</CustomTabPanel>
									</Box>
								</Box>
							</Box>
						)}
					</Box>
				</>
			)}
		</Box>
	);
}
