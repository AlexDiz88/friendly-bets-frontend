import { Dangerous } from '@mui/icons-material';
import {
	Box,
	Checkbox,
	Dialog,
	DialogActions,
	DialogContent,
	IconButton,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import GameScoreValidation from '../../components/utils/GameScoreValidation';
import NotificationSnackbar from '../../components/utils/NotificationSnackbar';
import Team from '../admin/teams/types/Team';
import SimpleUser from '../auth/types/SimpleUser';
import BetInputOdds from './BetInputOdds';
import BetInputPlayer from './BetInputPlayer';
import BetInputTeams from './BetInputTeams';
import BetInputTitle from './BetInputTitle';
import BetSummaryInfo from './BetSummaryInfo';
import MatchDayForm from './MatchDayForm';
import { updateBet } from './betsSlice';
import Bet from './types/Bet';
import MatchDayInfo from './types/MatchDayInfo';

const statuses = ['WON', 'RETURNED', 'LOST'];

export default function BetEditForm({
	bet,
	transformedGameResult,
	handleEditBet,
}: {
	bet: Bet;
	transformedGameResult: string;
	handleEditBet: (showEditForm: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [updatedUser, setUpdatedUser] = useState<SimpleUser>(bet.player);
	const [updatedIsPlayoff, setUpdatedIsPlayoff] = useState<boolean>(bet.isPlayoff);
	const [updatedMatchDay, setUpdatedMatchDay] = useState<string>(bet.matchDay);
	const [updatedPlayoffRound, setUpdatedPlayoffRound] = useState<string>(bet.playoffRound);
	// TODO передать/посчитать пробелы в transformedGameResult и передать в MatchdayForm
	const [updatedHomeTeam, setUpdatedHomeTeam] = useState<Team>(bet.homeTeam);
	const [updatedAwayTeam, setUpdatedAwayTeam] = useState<Team>(bet.awayTeam);
	const [updatedBetTitle, setUpdatedBetTitle] = useState<string>(
		bet.betTitle.endsWith(t('not')) ? bet.betTitle.split(t('not'))[0].trim() : bet.betTitle
	);
	const [isNot, setIsNot] = useState<boolean>(bet.betTitle.endsWith(t('not')));
	const [updatedBetOdds, setUpdatedBetOdds] = useState<string>(bet.betOdds.toString());
	const [updatedBetSize, setUpdatedBetSize] = useState<string>(bet.betSize.toString());
	const [updatedBetStatus, setUpdatedBetStatus] = useState<string>(bet.betStatus);
	const [updatedGameResult, setUpdatedGameResult] = useState<string>(bet.gameResult || '');
	const [inputGameResult, setInputGameResult] = useState<string>(transformedGameResult);
	const [betUpdateOpenDialog, setBetUpdateOpenDialog] = useState<boolean>(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarDuration, setSnackbarDuration] = useState(1500);

	const scrollToTop = (): void => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};
	// TODO: исправить проблему в редактировании ставки при смене флага плейофф + общая проверка

	const handleBetUpdateSave = useCallback(async () => {
		setBetUpdateOpenDialog(false);
		const betOddsToNumber = Number(updatedBetOdds.trim().replace(',', '.'));
		// TODO добавить проверку на валидность кэфа (наличие пробелов между цифрами итд)
		const dispatchResult = await dispatch(
			updateBet({
				betId: bet.id,
				newBet: {
					seasonId: bet.seasonId,
					leagueId: bet.leagueId,
					userId: updatedUser.id,
					isPlayoff: updatedIsPlayoff,
					matchDay: updatedMatchDay,
					playoffRound: updatedPlayoffRound,
					homeTeamId: updatedHomeTeam.id,
					awayTeamId: updatedAwayTeam.id,
					betTitle: isNot ? `${updatedBetTitle}${t('not')}` : updatedBetTitle,
					betOdds: betOddsToNumber,
					betSize: Number(updatedBetSize),
					betStatus: updatedBetStatus,
					gameResult: updatedGameResult,
				},
			})
		);

		if (updateBet.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('betWasSuccessfullyEdited'));
			setTimeout(() => {
				handleEditBet(false);
				scrollToTop();
			}, 700);
		}
		if (updateBet.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarDuration(3000);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [
		updatedBetOdds,
		dispatch,
		bet.id,
		bet.seasonId,
		bet.leagueId,
		updatedUser.id,
		updatedIsPlayoff,
		updatedMatchDay,
		updatedPlayoffRound,
		updatedHomeTeam.id,
		updatedAwayTeam.id,
		isNot,
		updatedBetTitle,
		updatedBetSize,
		updatedBetStatus,
		updatedGameResult,
		handleEditBet,
	]);
	// конец добавления ставки

	const handleUserSelection = (selectedUser: SimpleUser): void => {
		setUpdatedUser(selectedUser);
	};

	const handleMatchDaySelection = (matchDayInfo: MatchDayInfo): void => {
		setUpdatedIsPlayoff(matchDayInfo.isPlayoff);
		setUpdatedMatchDay(matchDayInfo.matchDay);
		setUpdatedPlayoffRound(matchDayInfo.playoffRound);
	};

	const handleHomeTeamSelection = (homeTeam: Team): void => {
		setUpdatedHomeTeam(homeTeam);
	};

	const handleAwayTeamSelection = (awayTeam: Team): void => {
		setUpdatedAwayTeam(awayTeam);
	};

	const handleOddsSelection = (betOdds: string, betSize: string): void => {
		setUpdatedBetOdds(betOdds);
		setUpdatedBetSize(betSize);
	};

	const handleBetCancel = (): void => {
		setUpdatedBetTitle('');
	};

	const handleBetTitleSelection = (betTitle: string): void => {
		setUpdatedBetTitle(betTitle);
	};

	const handleIsNotChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { checked } = event.target;
		setIsNot(checked);
	};

	const handleBetStatusSelection = (event: SelectChangeEvent): void => {
		setUpdatedBetStatus(event.target.value);
	};

	const handleGameResultChange = (value: string): void => {
		setInputGameResult(value);
	};

	const handleBetUpdateOpenDialog = (inputBet: string): void => {
		const res = GameScoreValidation(inputBet);
		setUpdatedGameResult(res);
		setBetUpdateOpenDialog(true);
	};

	const handleCloseDialog = (): void => {
		setBetUpdateOpenDialog(false);
	};

	const handleCloseForm = (): void => {
		handleEditBet(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<Box
			sx={{
				maxWidth: '25rem',
				minWidth: '19rem',
				border: 2,
				mx: 0.5,
				mb: 1.5,
				p: 0.5,
				borderRadius: 2,
				bgcolor: 'white',
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
			}}
		>
			<BetInputPlayer defaultValue={bet.player} onUserSelect={handleUserSelection} />
			<MatchDayForm
				matchDayInfo={{
					isPlayoff: bet.isPlayoff,
					matchDay: bet.matchDay,
					playoffRound: bet.playoffRound,
				}}
				onMatchDayInfo={handleMatchDaySelection}
			/>
			<BetInputTeams
				defaultHomeTeamName={bet.homeTeam.title}
				defaultAwayTeamName={bet.awayTeam.title}
				onHomeTeamSelect={handleHomeTeamSelection}
				onAwayTeamSelect={handleAwayTeamSelection}
				leagueId={bet.leagueId}
				resetTeams={false}
			/>

			{!updatedBetTitle && <BetInputTitle onBetTitleSelect={handleBetTitleSelection} />}
			{updatedBetTitle && (
				<Box sx={{ my: 2, width: '18.2rem' }}>
					<Box sx={{ display: 'flex' }}>
						<Typography
							sx={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								fontSize: '0.85rem',
								width: '17rem',
								height: '2.3rem',
								border: '1px solid rgba(0, 0, 0, 0.23)',
								borderRadius: '4px',
							}}
						>
							{updatedBetTitle}
						</Typography>
						<IconButton onClick={handleBetCancel}>
							<Dangerous color="error" sx={{ mt: -1.75, ml: -1.5, fontSize: '3rem' }} />
						</IconButton>
					</Box>
					<Checkbox
						sx={{ pt: 0.5 }}
						checked={isNot}
						onChange={handleIsNotChange}
						inputProps={{ 'aria-label': 'controlled' }}
					/>
					{t('not')}
				</Box>
			)}

			<BetInputOdds
				defaultBetOdds={bet.betOdds.toString()}
				defaultBetSize={bet.betSize.toString()}
				onOddsSelect={handleOddsSelection}
			/>

			{bet.betStatus !== 'OPENED' && bet.betStatus !== 'EMPTY' && (
				<Box sx={{ textAlign: 'left' }}>
					<Typography sx={{ mx: 1, mt: 1, fontWeight: '600' }}>{t('betStatus')}</Typography>
					<Select
						autoWidth
						size="small"
						sx={{
							minWidth: '15rem',
							mb: 1,
							bgcolor:
								updatedBetStatus === 'WON'
									? '#daf3db'
									: updatedBetStatus === 'RETURNED'
									? '#f8f9d6'
									: updatedBetStatus === 'LOST'
									? '#f3dada'
									: updatedBetStatus === 'OPENED'
									? '#e0dfe4'
									: 'white',
						}}
						labelId="player-username-label"
						id="player-username-select"
						value={updatedBetStatus}
						onChange={handleBetStatusSelection}
					>
						{statuses &&
							statuses.map((status) => (
								<MenuItem sx={{ mx: 0, minWidth: '14.5rem' }} key={status} value={status}>
									<Box style={{ display: 'flex', alignItems: 'center' }}>
										<Typography sx={{ mx: 1, fontSize: '1rem', fontWeight: 600 }}>
											{status}
										</Typography>
									</Box>
								</MenuItem>
							))}
					</Select>

					<Box sx={{ my: 0.5, px: 0.5 }}>
						<TextField
							fullWidth
							required
							id={`gameResult-${bet.id}`}
							label={t('gameScore')}
							variant="outlined"
							value={inputGameResult}
							onChange={(event) => handleGameResultChange(event.target.value)}
						/>
					</Box>
				</Box>
			)}

			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, mb: 1 }}>
				<CustomCancelButton onClick={handleCloseForm} />
				<CustomButton
					sx={{ height: '2rem' }}
					onClick={() => handleBetUpdateOpenDialog(inputGameResult)}
					buttonText={t('btnText.update')}
					buttonColor="secondary"
				/>
			</Box>

			<Dialog open={betUpdateOpenDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<Box sx={{ fontWeight: '600', fontSize: '1rem' }}>
						<BetSummaryInfo
							message={t('changeBet')}
							player={updatedUser}
							leagueCode={bet.leagueCode}
							matchDayInfo={{
								isPlayoff: updatedIsPlayoff,
								matchDay: updatedMatchDay,
								playoffRound: updatedPlayoffRound,
							}}
							homeTeam={updatedHomeTeam}
							awayTeam={updatedAwayTeam}
							isNot={isNot}
							betTitle={updatedBetTitle}
							betOdds={updatedBetOdds}
							betSize={updatedBetSize}
							betStatus={updatedBetStatus}
							gameResult={updatedGameResult}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={handleCloseDialog} />
					<CustomSuccessButton
						sx={{ height: '2rem' }}
						onClick={handleBetUpdateSave}
						buttonText={t('btnText.update')}
					/>
				</DialogActions>
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
