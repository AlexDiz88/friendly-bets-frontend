import { Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import LeagueAvatar from '../../components/custom/avatar/LeagueAvatar';
import TeamsAvatars from '../../components/custom/avatar/TeamsAvatars';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import ScoreSelector from '../../components/custom/selectors/ScoreSelector';
import {
	showErrorSnackbar,
	showInfoSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import useFetchCurrentUser from '../../components/hooks/useFetchCurrentUser';
import { getActiveSeason, getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason, selectActiveSeasonId } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';
import { getOpenedBets, sendGameResults } from './betsSlice';
import { selectOpenedBets } from './selectors';
import { ExternalMatchdayData } from './types/ExternalMatchData';
import GameResult from './types/GameResult';
import GameScore from './types/GameScore';

interface MatchInfo {
	key: string;
	leagueId: string;
	leagueCode: string;
	matchDay: string;
	homeTeam: Team;
	awayTeam: Team;
}

export default function BetsAutoCheck(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const activeSeason = useAppSelector(selectActiveSeason);
	const openedBets = useAppSelector(selectOpenedBets);

	const [inputValues, setInputValues] = useState<Record<string, GameScore>>({});
	const [selectedMatchKey, setSelectedMatchKey] = useState<string | null>(null);
	const [scoreValidities, setScoreValidities] = useState<Record<string, boolean>>({});
	const [scoreErrors, setScoreErrors] = useState<Record<string, string | null>>({});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	useFetchCurrentUser();

	const [selectedLeague, setSelectedLeague] = useState(t('all'));
	const handleLeagueChange = (leagueCode: string): void => {
		setSelectedLeague(leagueCode);
	};

	const uniqueGames = useMemo(() => {
		const set = new Set<string>();
		const matches: MatchInfo[] = [];

		for (const bet of openedBets) {
			if (bet.homeTeam && bet.awayTeam) {
				const key = `${bet.leagueId}_${bet.homeTeam.id}_${bet.awayTeam.id}`;
				if (!set.has(key)) {
					set.add(key);
					matches.push({
						key,
						leagueId: bet.leagueId,
						leagueCode: bet.leagueCode,
						matchDay: bet.matchDay,
						homeTeam: bet.homeTeam,
						awayTeam: bet.awayTeam,
					});
				}
			}
		}
		return matches;
	}, [openedBets]);

	const handleScoreChange = (key: string, value: GameScore | null): void => {
		setInputValues((prev) => {
			if (value === null) {
				const updated = { ...prev };
				delete updated[key];

				setScoreErrors((prevErrors) => {
					const updatedErrors = { ...prevErrors };
					delete updatedErrors[key];
					return updatedErrors;
				});

				setScoreValidities((prevValidities) => {
					const updatedValidities = { ...prevValidities };
					delete updatedValidities[key];
					return updatedValidities;
				});

				return updated;
			}

			return {
				...prev,
				[key]: value,
			};
		});
	};

	const fetchExternalResults = async (matchday: number): Promise<ExternalMatchdayData> => {
		const apiKey = process.env.FOOTBALL_DATA_API_KEY;
		if (!apiKey) throw new Error('FOOTBALL_DATA_API_KEY is not defined');

		const url = `http://api.football-data.org/v4/competitions/PL/matches?matchday=${matchday}`;
		const res = await fetch(url, {
			headers: { 'X-Auth-Token': apiKey },
		});

		const data = await res.json();
		return data;
	};

	useEffect(() => {
		if (!activeSeasonId) return;
		const interval = setInterval(fetchExternalResults, 300_000);
		return () => clearInterval(interval);
	}, [activeSeasonId, uniqueGames, inputValues]);

	const handleSubmitResults = async (): Promise<void> => {
		setIsSubmitting(true);
		const gameResults: GameResult[] = [];

		for (const game of uniqueGames) {
			const gameScore = inputValues[game.key];
			if (!gameScore) continue;

			gameResults.push({
				leagueId: game.leagueId,
				homeTeamId: game.homeTeam.id,
				awayTeamId: game.awayTeam.id,
				gameScore,
			});
		}

		if (!activeSeasonId) {
			setIsSubmitting(false);
			throw new Error('Активный сезон не определен');
		}
		const dispatchResult = await dispatch(
			sendGameResults({ seasonId: activeSeasonId, gameResults })
		);

		setIsSubmitting(false);

		if (sendGameResults.fulfilled.match(dispatchResult)) {
			dispatch(showInfoSnackbar({ message: t('betsWereSuccessfullyProcessed') }));
			setInputValues({});
		} else {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	};

	useEffect(() => {
		if (!activeSeasonId) dispatch(getActiveSeasonId());
		if (!activeSeason) dispatch(getActiveSeason());
	}, []);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getOpenedBets({ seasonId: activeSeasonId }))
				.then(() => setLoading(false))
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeasonId]);

	if (loading) return <CustomLoading />;
	if (loadingError) return <CustomLoadingError />;

	return (
		<>
			{isSubmitting ? (
				<CustomLoading text={t('processing')} />
			) : (
				<Box
					sx={{
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						flexDirection: 'column',
					}}
				>
					<Typography textAlign="center" mt={1} sx={{ fontFamily: 'Exo 2' }}>
						{t('enterMatchResults')}
					</Typography>

					{activeSeason && activeSeason.leagues && (
						<Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 2 }}>
							<Button
								sx={{
									borderRadius: 0,
									borderBottom: selectedLeague === t('all') ? 1 : 0,
									color: selectedLeague === t('all') ? 'brown' : 'black',
									fontFamily: "'Exo 2'",
									px: 0.5,
									mr: 1,
									fontWeight: selectedLeague === t('all') ? 'bold' : 'normal',
								}}
								onClick={() => handleLeagueChange(t('all'))}
							>
								{t('all')}
							</Button>

							{activeSeason.leagues.map((l) => (
								<Button
									key={l.leagueCode}
									sx={{
										borderRadius: 0,
										borderBottom: selectedLeague === l.leagueCode ? 1 : 0,
										color: selectedLeague === l.leagueCode ? 'brown' : 'black',
										fontFamily: "'Exo 2'",
										px: 0.5,
										mr: 1,
										fontWeight: selectedLeague === l.leagueCode ? 'bold' : 'normal',
									}}
									onClick={() => handleLeagueChange(l.leagueCode)}
								>
									{t(`leagueShortName.${l.leagueCode}`)}
								</Button>
							))}
						</Box>
					)}

					{/* фильтр по selectedLeague */}
					{uniqueGames
						.filter((g) => selectedLeague === t('all') || g.leagueCode === selectedLeague)
						.map((game) => {
							const isSelected = selectedMatchKey === game.key;
							const currentInput = inputValues[game.key];

							return (
								<Box
									key={game.key}
									sx={{
										px: 2,
										py: 1,
										my: 1.5,
										width: '100%',
										maxWidth: '26rem',
										transition: '0.2s',
										border: '2px solid',
										borderRadius: 2,
										bgcolor: isSelected ? '#FFEDD9B9' : '#EDD1C03F',
										boxShadow: '1px 4px 7px rgba(0, 0, 60, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.7)',
									}}
								>
									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
										flexDirection="column"
									>
										<LeagueAvatar
											leagueCode={game.leagueCode}
											matchDay={game.matchDay}
											height={22}
											sx={{ fontSize: '0.85rem', mb: 0.5 }}
										/>
										<TeamsAvatars homeTeam={game.homeTeam} awayTeam={game.awayTeam} height={32} />
									</Box>

									{currentInput && (
										<Typography
											sx={{
												display: 'flex',
												justifyContent: 'center',
												mt: 1,
												color: scoreErrors[game.key] ? '#B00020' : '#1F8300FF',
												fontWeight: 600,
												fontSize: '1.05rem',
											}}
										>
											{t('enteredScore')} - {currentInput.fullTime} ({currentInput.firstTime}
											{currentInput.overTime ? `, доп. ${currentInput.overTime}` : ''}
											{currentInput.penalty ? `, пен. ${currentInput.penalty}` : ''})
										</Typography>
									)}

									{scoreErrors[game.key] && (
										<Typography
											sx={{
												textAlign: 'center',
												mt: 0.5,
												color: '#B00020',
												fontWeight: 500,
												fontSize: '0.9rem',
											}}
										>
											{scoreErrors[game.key]}
										</Typography>
									)}

									<Box>
										{!isSelected ? (
											<Box
												sx={{
													display: 'flex',
													justifyContent: 'center',
													mt: 1,
												}}
											>
												<CustomButton
													buttonText={t('btnText.enterScore')}
													onClick={() => setSelectedMatchKey(game.key)}
													buttonColor="info"
													buttonSize="small"
													textSize="0.75rem"
													sx={{ mr: 2 }}
												/>
												<CustomButton
													buttonText={t('btnText.resetScore')}
													onClick={() => handleScoreChange(game.key, null)}
													buttonColor="warning"
													buttonSize="small"
													textSize="0.75rem"
												/>
											</Box>
										) : (
											<>
												<ScoreSelector
													key={game.key}
													keyId={game.key}
													initialValue={inputValues[game.key]}
													onSave={(val) => handleScoreChange(game.key, val)}
													onValidationChange={(isValid) =>
														setScoreValidities((prev) => ({
															...prev,
															[game.key]: isValid,
														}))
													}
													onValidationError={(error) =>
														setScoreErrors((prev) => ({
															...prev,
															[game.key]: error,
														}))
													}
												/>
												<Box mt={1} display="flex" justifyContent="flex-end">
													<CustomButton
														buttonText={t('btnText.reset')}
														onClick={() => {
															handleScoreChange(game.key, null);
															setSelectedMatchKey(null);
														}}
														buttonSize="small"
														sx={{ bgcolor: '#DB3833FF', mr: 1 }}
													/>
													<CustomButton
														buttonText={t('btnText.accept')}
														onClick={() => setSelectedMatchKey(null)}
														buttonSize="small"
														buttonColor="success"
													/>
												</Box>
											</>
										)}
									</Box>
								</Box>
							);
						})}

					{openedBets.length > 0 ? (
						<CustomButton
							onClick={handleSubmitResults}
							buttonText={t('sendGameResults')}
							buttonColor="secondary"
							disabled={
								Object.keys(inputValues).length === 0 ||
								Object.entries(inputValues).some(([key]) => scoreValidities[key] === false)
							}
							sx={{ mt: 2 }}
						/>
					) : (
						<Box sx={{ color: '#731212FF', fontWeight: 600, mt: 3 }}>{t('noBets')}</Box>
					)}
				</Box>
			)}
		</>
	);
}
