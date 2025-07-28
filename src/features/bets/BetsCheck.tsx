import { Box, Button, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import CustomBetCheckDialog from '../../components/custom/dialog/CustomBetCheckDialog';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import {
	showErrorSnackbar,
	showInfoSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import useFetchCurrentUser from '../../components/hooks/useFetchCurrentUser';
import useFilterLanguageChange from '../../components/hooks/useFilterLanguageChange';
import { transformToGameResult } from '../../components/utils/gameResultValidation';
import { BET_STATUS_LOST, BET_STATUS_RETURNED, BET_STATUS_WON, BetStatus } from '../../constants';
import { getActiveSeason, getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason, selectActiveSeasonId } from '../admin/seasons/selectors';
import OpenedBetCard from './OpenedBetCard';
import { getOpenedBets, setBetResult } from './betsSlice';
import { selectOpenedBets } from './selectors';
import Bet from './types/Bet';
import GameScore from './types/GameScore';

export default function BetsCheck(): JSX.Element {
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const activeSeason = useAppSelector(selectActiveSeason);
	const dispatch = useAppDispatch();
	const openedBets = useAppSelector(selectOpenedBets);
	const [selectedBet, setSelectedBet] = useState<Bet | undefined>(undefined);
	const [gameResultInput, setGameResultInput] = useState<string>();
	const [gameScore, setGameScore] = useState<GameScore | undefined>(undefined);
	const [inputValues, setInputValues] = useState<Record<string, string>>({});
	const [selectedLeague, setSelectedLeague] = useState(t('all'));
	const [dialogType, setDialogType] = useState<BetStatus | undefined>(undefined);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	useFilterLanguageChange(setSelectedLeague);
	useFetchCurrentUser();

	const handleCloseDialog = (): void => {
		setDialogType(undefined);
	};

	const handleLeagueChange = (leagueName: string): void => {
		setSelectedLeague(leagueName);
	};

	const handleSaveBetCheck = useCallback(
		async (betStatus: string) => {
			handleCloseDialog();

			if (selectedBet) {
				const dispatchResult = await dispatch(
					setBetResult({
						betId: selectedBet.id,
						betResult: { gameScore, betStatus },
					})
				);

				if (setBetResult.fulfilled.match(dispatchResult)) {
					dispatch(showInfoSnackbar({ message: t('betWasSuccessfullyProcessed') }));
					setGameScore(undefined);
					handleLeagueChange(selectedLeague);
				}
				if (setBetResult.rejected.match(dispatchResult)) {
					dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
				}
			}
		},
		[dispatch, gameScore, selectedBet, selectedLeague]
	);

	const handleBetSave = (status: string): void => {
		handleSaveBetCheck(status);
	};

	const handleGameResultChange = (betId: string, value: string): void => {
		setInputValues((prevGameResult) => ({
			...prevGameResult,
			[betId]: value,
		}));
	};

	const openDialog = (type: BetStatus, bet: Bet, result: string): void => {
		setGameResultInput(result);
		const res = transformToGameResult(result);
		setGameScore(res);
		setSelectedBet(bet);
		setDialogType(type);
	};

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId());
		}
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, []);

	useEffect(() => {
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
	}, [activeSeasonId]);

	return (
		<Box>
			{loading ? (
				<CustomLoading />
			) : (
				<Box>
					{loadingError ? (
						<CustomLoadingError />
					) : (
						<Box sx={{ display: 'flex', justifyContent: 'center' }}>
							{activeSeason && (
								<Box>
									<Box sx={{ borderBottom: 2, textAlign: 'center', mx: 3, pb: 0.5, mb: 1.5 }}>
										{t('betsCheck')}
									</Box>

									<Box sx={{ display: 'flex', justifyContent: 'center' }}>
										<Box sx={{ mb: 1 }}>
											<Button
												sx={{
													borderRadius: 0,
													borderBottom: selectedLeague === t('all') ? 1 : 0,
													color: selectedLeague === t('all') ? 'brown' : 'black',
													fontFamily: 'Exo 2',
													px: 0,
													mr: 0.5,
													fontWeight: selectedLeague === t('all') ? 'bold' : 'normal',
												}}
												onClick={() => handleLeagueChange(t('all'))}
											>
												<Typography
													variant="button"
													fontWeight="inherit"
													fontSize="0.9rem"
													fontFamily="Shantell Sans"
												>
													{t('all')}
												</Typography>
											</Button>
										</Box>
										{activeSeason.leagues &&
											activeSeason.leagues.map((l) => (
												<Box key={l.id} sx={{ mb: 1 }}>
													<Button
														key={l.leagueCode}
														sx={{
															borderRadius: 0,
															borderBottom: selectedLeague === l.leagueCode ? 1 : 0,
															color: selectedLeague === l.leagueCode ? 'brown' : 'black',
															fontFamily: 'Exo 2',
															px: 0,
															mr: 0.5,
															fontWeight: selectedLeague === l.leagueCode ? 'bold' : 'normal',
														}}
														onClick={() => handleLeagueChange(l.leagueCode)}
													>
														<Typography
															variant="button"
															fontWeight="inherit"
															fontSize="0.9rem"
															fontFamily="Shantell Sans"
														>
															{t(`leagueShortName.${l.leagueCode}`)}
														</Typography>
													</Button>
												</Box>
											))}
									</Box>

									{openedBets.map((bet) => {
										if (bet.leagueCode === selectedLeague || selectedLeague === t('all')) {
											return (
												<Box key={bet.id}>
													<OpenedBetCard bet={bet} />
													<Box
														sx={{
															mb: 3,
															mt: 0.5,
															ml: 0.5,
															display: 'flex',
															justifyContent: 'center',
														}}
													>
														<Box>
															<Box sx={{ mb: 0.5, px: 0.5 }}>
																<TextField
																	fullWidth
																	required
																	id={`inputValues-${bet.id}`}
																	label={t('gameScore')}
																	variant="outlined"
																	value={inputValues[bet.id] || ''}
																	onChange={(event) =>
																		handleGameResultChange(bet.id, event.target.value)
																	}
																/>
															</Box>
															<Box>
																<CustomCancelButton
																	sx={{ px: 2 }}
																	onClick={() =>
																		openDialog(BET_STATUS_LOST, bet, inputValues[bet.id])
																	}
																	buttonText={t('lost')}
																	textSize="0.8rem"
																/>
																<CustomButton
																	sx={{
																		height: '2rem',
																		mr: 1,
																		bgcolor: 'yellow',
																		color: 'black',
																		px: 2,
																	}}
																	onClick={() =>
																		openDialog(BET_STATUS_RETURNED, bet, inputValues[bet.id])
																	}
																	buttonText={t('returned')}
																	textSize="0.8rem"
																/>
																<CustomSuccessButton
																	sx={{ px: 2 }}
																	onClick={() =>
																		openDialog(BET_STATUS_WON, bet, inputValues[bet.id])
																	}
																	buttonText={t('won')}
																	textSize="0.8rem"
																/>
															</Box>
														</Box>
													</Box>
												</Box>
											);
										}
									})}
								</Box>
							)}

							<CustomBetCheckDialog
								open={dialogType === BET_STATUS_LOST}
								onClose={handleCloseDialog}
								onSave={() => handleBetSave(BET_STATUS_LOST)}
								gameResultInput={gameResultInput}
								bet={selectedBet}
								buttonColor="error"
								buttonText={t('lost')}
							/>

							<CustomBetCheckDialog
								open={dialogType === BET_STATUS_RETURNED}
								onClose={handleCloseDialog}
								onSave={() => handleBetSave(BET_STATUS_RETURNED)}
								gameResultInput={gameResultInput}
								bet={selectedBet}
								buttonText={t('returned')}
								sx={{ bgcolor: '#e6eb16', color: 'black' }}
							/>

							<CustomBetCheckDialog
								open={dialogType === BET_STATUS_WON}
								onClose={handleCloseDialog}
								onSave={() => handleBetSave(BET_STATUS_WON)}
								gameResultInput={gameResultInput}
								bet={selectedBet}
								buttonColor="success"
								buttonText={t('won')}
							/>
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
