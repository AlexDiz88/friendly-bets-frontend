import { Dangerous } from '@mui/icons-material';
import {
	Box,
	Button,
	Checkbox,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	IconButton,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import NotificationSnackbar from '../../components/utils/NotificationSnackbar';
import League from '../admin/leagues/types/League';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';
import { selectUser } from '../auth/selectors';
import SimpleUser from '../auth/types/SimpleUser';
import BetInputLeague from './BetInputLeague';
import BetInputOdds from './BetInputOdds';
import BetInputPlayer from './BetInputPlayer';
import BetInputTeams from './BetInputTeams';
import BetInputTitle from './BetInputTitle';
import BetSummaryInfo from './BetSummaryInfo';
import MatchDayForm from './MatchDayForm';
import { addBet, addEmptyBet } from './betsSlice';
import MatchDayInfo from './types/MatchDayInfo';

export default function BetInputContainer(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useSelector(selectUser);
	const navigate = useNavigate();
	const season = useSelector(selectActiveSeason);
	const [showMessage, setShowMessage] = useState(false);
	const [selectedUser, setSelectedUser] = useState<SimpleUser | undefined>(undefined);
	const [selectedLeague, setSelectedLeague] = useState<League>();
	const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
	const [matchDayInfo, setMatchDayInfo] = useState<MatchDayInfo>({
		isPlayoff: false,
		matchDay: '1',
		playoffRound: '',
	});
	const [selectedHomeTeam, setSelectedHomeTeam] = useState<Team | undefined>(undefined);
	const [selectedAwayTeam, setSelectedAwayTeam] = useState<Team | undefined>(undefined);
	const [selectedEmptyBetSize, setSelectedEmptyBetSize] = useState<string>('10');
	const [resetTeams, setResetTeams] = useState(false);
	const [isEmptyBet, setIsEmptyBet] = useState(false);
	const [selectedBetTitle, setSelectedBetTitle] = useState<string>('');
	const [selectedBetOdds, setSelectedBetOdds] = useState<string>('');
	const [selectedBetSize, setSelectedBetSize] = useState<string>('');
	const [showSendButton, setShowSendButton] = useState<boolean>(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarDuration, setSnackbarDuration] = useState(3000);
	const [openDialog, setOpenDialog] = useState(false);
	const [openDialogEmptyBet, setOpenDialogEmptyBet] = useState(false);
	const [openDialogTwoEmptyBet, setOpenDialogTwoEmptyBet] = useState(false);
	const [isNot, setIsNot] = useState(false);

	const scrollToBottom = (): void => {
		window.scrollTo({ top: 100, behavior: 'smooth' });
	};

	// добавление ставки
	const handleSaveClick = useCallback(async () => {
		setOpenDialog(false);
		if (season && selectedUser && selectedHomeTeam && selectedAwayTeam) {
			const betOddsToNumber = Number(selectedBetOdds.trim().replace(',', '.'));
			// TODO добавить проверку на валидность кэфа (наличие пробелов между цифрами итд)
			const dispatchResult = await dispatch(
				addBet({
					newBet: {
						seasonId: season.id,
						leagueId: selectedLeagueId,
						userId: selectedUser?.id,
						isPlayoff: matchDayInfo.isPlayoff,
						matchDay: matchDayInfo.matchDay,
						playoffRound: matchDayInfo.playoffRound,
						homeTeamId: selectedHomeTeam?.id,
						awayTeamId: selectedAwayTeam?.id,
						betTitle: isNot ? `${selectedBetTitle} - нет` : selectedBetTitle,
						betOdds: betOddsToNumber,
						betSize: Number(selectedBetSize),
					},
				})
			);

			if (addBet.fulfilled.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('success');
				setSnackbarMessage('Ставка успешно добавлена');
				setSnackbarDuration(1000);
				setResetTeams(!resetTeams);
				setSelectedHomeTeam(undefined);
				setSelectedAwayTeam(undefined);
				setSelectedBetTitle('');
				setSelectedBetOdds('');
				setIsNot(false);
				await dispatch(getActiveSeason());
			}
			if (addBet.rejected.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('error');
				if (dispatchResult.error.message) {
					setSnackbarMessage(dispatchResult.error.message);
				}
				setSelectedBetTitle('');
				setSelectedBetOdds('');
				setIsNot(false);
			}
		}
	}, [
		dispatch,
		isNot,
		resetTeams,
		season,
		selectedAwayTeam,
		selectedBetOdds,
		selectedBetSize,
		selectedBetTitle,
		selectedHomeTeam,
		selectedLeagueId,
		matchDayInfo,
		selectedUser,
	]);

	// добавление пустой ставки
	const handleSaveEmptyBetClick = useCallback(async () => {
		if (season && selectedUser) {
			const dispatchResult = await dispatch(
				addEmptyBet({
					newEmptyBet: {
						seasonId: season.id,
						leagueId: selectedLeagueId,
						userId: selectedUser.id,
						isPlayoff: matchDayInfo.isPlayoff,
						matchDay: matchDayInfo.matchDay,
						playoffRound: matchDayInfo.playoffRound,
						betSize: Number(selectedEmptyBetSize),
					},
				})
			);

			if (addEmptyBet.fulfilled.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('success');
				if (openDialogEmptyBet) {
					setSnackbarMessage('Пустая ставка успешно добавлена');
				} else {
					setSnackbarMessage('2 пустые ставки успешно добавлены');
				}
			}
			if (addEmptyBet.rejected.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('error');
				if (dispatchResult.error.message) {
					setSnackbarMessage(dispatchResult.error.message);
				}
			}
			setOpenDialogEmptyBet(false);
			setOpenDialogTwoEmptyBet(false);
		}
	}, [
		dispatch,
		openDialogEmptyBet,
		season,
		selectedEmptyBetSize,
		selectedLeagueId,
		matchDayInfo,
		selectedUser,
	]);

	// хэндлеры
	const handleEmptyBet = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setIsEmptyBet(event.target.checked);
	};

	const handleUserSelection = (player: SimpleUser): void => {
		setSelectedUser(player);
	};

	const handleLeagueSelection = (league: League): void => {
		setSelectedLeague(league);
		setSelectedLeagueId(league.id);
		setSelectedHomeTeam(undefined);
		setSelectedAwayTeam(undefined);
		setSelectedBetTitle('');
		setShowSendButton(false);
	};

	const handleMatchDayInfo = (info: MatchDayInfo): void => {
		setMatchDayInfo(info);
	};

	const handleHomeTeamSelection = (homeTeam: Team): void => {
		setSelectedHomeTeam(homeTeam);
	};

	const handleAwayTeamSelection = (awayTeam: Team): void => {
		setSelectedAwayTeam(awayTeam);
	};

	const handleBetCancel = (): void => {
		setSelectedBetTitle('');
		setSelectedBetOdds('');
		setShowSendButton(false);
	};

	const handleBetTitleSelection = (betTitle: string): void => {
		setSelectedBetTitle(betTitle);
		setShowSendButton(true);
		scrollToBottom();
	};

	const handleOddsSelection = (betOdds: string, betSize: string): void => {
		setSelectedBetOdds(betOdds);
		setSelectedBetSize(betSize);
	};

	const handleOpenDialog = (): void => {
		setOpenDialog(true);
	};

	const handleEmptyBetSize = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const size = event.target.value;
		setSelectedEmptyBetSize(size);
	};

	const handleOpenDialogEmptyBet = (): void => {
		setOpenDialogEmptyBet(true);
	};

	const handleSaveTwoEmptyBet = async (): Promise<void> => {
		await handleSaveEmptyBetClick();
		handleSaveEmptyBetClick();
	};

	const handleOpenDialogTwoEmptyBet = (): void => {
		setOpenDialogTwoEmptyBet(true);
	};

	const handleIsNotChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { checked } = event.target;
		setIsNot(checked);
	};

	const handleCloseDialog = (): void => {
		setOpenDialog(false);
		setOpenDialogEmptyBet(false);
		setOpenDialogTwoEmptyBet(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	useEffect(() => {
		dispatch(getActiveSeason());
	}, []);

	// редирект неавторизованных пользователей
	useEffect(() => {
		const timer = setTimeout(() => {
			if (!user) {
				navigate('/');
			} else if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
				navigate('/');
			}
		}, 3000);
		return () => clearTimeout(timer);
	}, [navigate, user]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMessage(true);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	if (!user || (user && user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
		return (
			<Box
				sx={{
					p: 5,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '70vh',
				}}
			>
				{showMessage && (
					<Box sx={{ textAlign: 'center', my: 3, fontWeight: 600, color: 'brown' }}>
						Проверка авторизации на доступ к панели модератора
					</Box>
				)}
				<CircularProgress size={100} color="primary" />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				m: 1,
				mb: 10,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Typography sx={{ textAlign: 'center', borderBottom: 2, pb: 1, mx: 2 }}>
				{t('addBets')}
			</Typography>
			<Typography sx={{ textAlign: 'left', mx: 1, mt: 1, fontWeight: '600' }}>
				{t('emptyBet')}?
				<Switch
					checked={isEmptyBet}
					onChange={handleEmptyBet}
					inputProps={{ 'aria-label': 'controlled' }}
				/>
			</Typography>
			<BetInputPlayer defaultValue={undefined} onUserSelect={handleUserSelection} />
			{selectedUser && (
				<Box>
					<BetInputLeague onLeagueSelect={handleLeagueSelection} />
					{selectedLeague && (
						<MatchDayForm
							key={selectedLeague.id}
							matchDayInfo={{
								isPlayoff: false,
								matchDay: selectedLeague ? selectedLeague.currentMatchDay : '1',
								playoffRound: '',
							}}
							onMatchDayInfo={handleMatchDayInfo}
						/>
					)}
				</Box>
			)}
			{!isEmptyBet && (
				<>
					{selectedLeagueId && matchDayInfo && (
						<BetInputTeams
							defaultHomeTeamName=""
							defaultAwayTeamName=""
							onHomeTeamSelect={handleHomeTeamSelection}
							onAwayTeamSelect={handleAwayTeamSelection}
							leagueId={selectedLeagueId}
							resetTeams={resetTeams}
						/>
					)}
					{selectedHomeTeam && selectedAwayTeam && !selectedBetTitle && (
						<BetInputTitle onBetTitleSelect={handleBetTitleSelection} />
					)}
					{selectedBetTitle && (
						<Box sx={{ my: 2, width: '18.2rem' }}>
							<Box
								sx={{
									display: 'flex',
									justifyContent: 'center',
								}}
							>
								<Typography
									sx={{
										ml: 1,
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										fontSize: '0.85rem',
										width: '19rem',
										height: '2.4rem',
										border: '1px solid rgba(0, 0, 0, 0.23)',
										borderRadius: '4px',
									}}
								>
									{selectedBetTitle}
								</Typography>
								<IconButton sx={{ p: 0 }} onClick={handleBetCancel}>
									<Dangerous
										color="error"
										sx={{ p: 0, mt: -0.75, ml: -0.5, mr: 0.5, fontSize: '3rem' }}
									/>
								</IconButton>
							</Box>
							<Checkbox
								sx={{ pt: 0.5 }}
								checked={isNot}
								onChange={handleIsNotChange}
								inputProps={{ 'aria-label': 'controlled' }}
							/>
							Нет
						</Box>
					)}
					{selectedBetTitle && (
						<BetInputOdds
							defaultBetOdds=""
							defaultBetSize="10"
							onOddsSelect={handleOddsSelection}
						/>
					)}
					{showSendButton && selectedBetOdds && selectedBetSize && (
						<Button
							onClick={handleOpenDialog}
							sx={{ mt: 2, height: '2.5rem', px: 6.6 }}
							variant="contained"
							color="secondary"
							size="large"
						>
							<Typography
								variant="button"
								fontWeight="600"
								fontSize="0.9rem"
								fontFamily="Shantell Sans"
							>
								{t('sendBet')}
							</Typography>
						</Button>
					)}
				</>
			)}
			{selectedLeagueId && isEmptyBet && (
				<>
					<Box
						sx={{
							mt: 2,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							textAlign: 'left',
						}}
					>
						<Typography sx={{ ml: 2, mr: 0.5, fontWeight: '600' }}> {t('amount')}</Typography>
						<Box component="form" autoComplete="off" sx={{ width: '3rem', pt: 0 }}>
							<TextField size="small" value={selectedEmptyBetSize} onChange={handleEmptyBetSize} />
						</Box>
					</Box>
					<Button
						onClick={handleOpenDialogEmptyBet}
						sx={{ mt: 2, height: '2.5rem', px: 2.1, bgcolor: '#525252' }}
						variant="contained"
						size="large"
					>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							{t('sendEmptyBet')}
						</Typography>
					</Button>
					<Button
						onClick={handleOpenDialogTwoEmptyBet}
						sx={{ mt: 3, height: '2.5rem', px: 1.6, bgcolor: '#525252' }}
						variant="contained"
						size="large"
					>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.8rem"
							fontFamily="Shantell Sans"
						>
							{t('sendTwoEmptyBet')}
						</Typography>
					</Button>
				</>
			)}
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontSize: '1rem', width: '14rem' }}>
						<BetSummaryInfo
							message={t('addBet')}
							player={selectedUser}
							leagueCode={selectedLeague?.leagueCode || ''}
							matchDayInfo={matchDayInfo}
							homeTeam={selectedHomeTeam}
							awayTeam={selectedAwayTeam}
							isNot={isNot}
							betTitle={selectedBetTitle}
							betOdds={selectedBetOdds}
							betSize={selectedBetSize}
							gameResult=""
							betStatus=""
						/>
					</DialogContentText>
				</DialogContent>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<DialogActions>
						<CustomCancelButton onClick={handleCloseDialog} />
						<CustomSuccessButton onClick={handleSaveClick} buttonText={t('btnText.accept')} />
					</DialogActions>
				</Box>
			</Dialog>

			<Dialog open={openDialogEmptyBet} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem', width: '14rem' }}>
						{t('addEmptyBet')}
					</DialogContentText>
				</DialogContent>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<DialogActions>
						<CustomCancelButton onClick={handleCloseDialog} />
						<CustomSuccessButton
							onClick={handleSaveEmptyBetClick}
							buttonText={t('btnText.accept')}
						/>
					</DialogActions>
				</Box>
			</Dialog>

			<Dialog open={openDialogTwoEmptyBet} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem', width: '14rem' }}>
						{t('addTwoEmptyBet')}
					</DialogContentText>
				</DialogContent>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<DialogActions>
						<CustomCancelButton onClick={handleCloseDialog} />
						<CustomSuccessButton onClick={handleSaveTwoEmptyBet} buttonText={t('btnText.accept')} />
					</DialogActions>
				</Box>
			</Dialog>

			<Box textAlign="center">
				<NotificationSnackbar
					open={openSnackbar}
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					message={snackbarMessage}
					duration={snackbarDuration}
				/>
			</Box>
		</Box>
	);
}
