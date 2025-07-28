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
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import {
	gameScoreInputStringValidation,
	transformToGameResult,
} from '../../components/utils/gameResultValidation';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import {
	BET_STATUS_EMPTY,
	BET_STATUS_LOST,
	BET_STATUS_OPENED,
	BET_STATUS_RETURNED,
	BET_STATUS_WON,
} from '../../constants';
import CalendarNode from '../admin/calendars/CalendarNode';
import {
	getAllSeasonCalendarNodes,
	getSeasonCalendarHasBetsNodes,
} from '../admin/calendars/calendarsSlice';
import { selectAllCalendarNodes } from '../admin/calendars/selectors';
import Calendar from '../admin/calendars/types/Calendar';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
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
import BetTitle from './types/BetTitle';
import GameScore from './types/GameScore';

const statuses = [BET_STATUS_WON, BET_STATUS_RETURNED, BET_STATUS_LOST];

export default function BetEditForm({
	bet,
	gameResultAsString,
	handleEditBet,
}: {
	bet: Bet;
	gameResultAsString: string;
	handleEditBet: (showEditForm: boolean) => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const calendarNodes = useAppSelector(selectAllCalendarNodes);
	const [calendar, setCalendar] = useState<Calendar | undefined>();
	const [updatedUser, setUpdatedUser] = useState<SimpleUser>(bet.player);
	const [updatedMatchDay, setUpdatedMatchDay] = useState<string>(bet.matchDay);
	const [updatedHomeTeam, setUpdatedHomeTeam] = useState<Team | undefined>(bet.homeTeam);
	const [updatedAwayTeam, setUpdatedAwayTeam] = useState<Team | undefined>(bet.awayTeam);
	const [updatedBetTitle, setUpdatedBetTitle] = useState<BetTitle | undefined>(bet.betTitle);
	const [updatedBetOdds, setUpdatedBetOdds] = useState<string | undefined>(bet.betOdds?.toString());
	const [updatedBetSize, setUpdatedBetSize] = useState<string>(bet.betSize.toString());
	const [updatedBetStatus, setUpdatedBetStatus] = useState<string>(bet.betStatus);
	const [updatedGameResult, setUpdatedGameResult] = useState<GameScore | undefined>(bet.gameScore);
	const [gameResultInput, setGameResultInput] = useState<string>(gameResultAsString);
	const [betUpdateOpenDialog, setBetUpdateOpenDialog] = useState<boolean>(false);

	const scrollToTop = (): void => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const handleBetUpdateSave = useCallback(async () => {
		setBetUpdateOpenDialog(false);
		const betOddsToNumber = Number(updatedBetOdds?.trim().replace(',', '.'));
		const dispatchResult = await dispatch(
			updateBet({
				editedBetId: bet.id,
				editedBet: {
					seasonId: bet.seasonId,
					leagueId: bet.leagueId,
					userId: updatedUser.id,
					matchDay: updatedMatchDay,
					homeTeamId: updatedHomeTeam?.id,
					awayTeamId: updatedAwayTeam?.id,
					betTitle: updatedBetTitle
						? updatedBetTitle
						: { code: 0, label: 'EMPTY BET', isNot: false },
					betOdds: betOddsToNumber,
					betSize: Number(updatedBetSize),
					betStatus: updatedBetStatus,
					gameResult: updatedGameResult,
					prevCalendarNodeId: bet.calendarNodeId,
					calendarNodeId: calendar?.id,
				},
			})
		);

		if (updateBet.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('betWasSuccessfullyEdited') }));
			if (activeSeasonId) {
				dispatch(getSeasonCalendarHasBetsNodes(activeSeasonId));
			}
			setTimeout(() => {
				handleEditBet(false);
				scrollToTop();
			}, 700);
		}
		if (updateBet.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [
		bet,
		calendar,
		updatedUser,
		updatedMatchDay,
		updatedHomeTeam,
		updatedAwayTeam,
		updatedBetTitle,
		updatedBetOdds,
		updatedBetSize,
		updatedBetStatus,
		updatedGameResult,
		handleEditBet,
	]);
	// конец добавления ставки

	const handleUserSelection = (selectedUser: SimpleUser): void => {
		setUpdatedUser(selectedUser);
	};

	const handleMatchDaySelection = (matchDayTitle: string): void => {
		setUpdatedMatchDay(matchDayTitle);
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
		setUpdatedBetTitle(undefined);
	};

	const handleBetTitleSelection = (code: number, label: string): void => {
		setUpdatedBetTitle({ code, label, isNot: updatedBetTitle?.isNot ?? false });
	};

	const handleIsNotChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const { checked } = event.target;
		if (updatedBetTitle) {
			setUpdatedBetTitle({ ...updatedBetTitle, isNot: checked });
		}
	};

	const handleBetStatusSelection = (event: SelectChangeEvent): void => {
		setUpdatedBetStatus(event.target.value);
	};

	const handleGameResultInputChange = (value: string): void => {
		setGameResultInput(value);
	};

	const handleBetUpdateOpenDialog = (inputStr: string): void => {
		const checkedGameResult = gameScoreInputStringValidation(inputStr);
		const gameResultObj = transformToGameResult(checkedGameResult);
		setUpdatedGameResult(gameResultObj);
		setBetUpdateOpenDialog(true);
	};

	const handleCloseDialog = (): void => {
		setBetUpdateOpenDialog(false);
	};

	const handleCloseForm = (): void => {
		handleEditBet(false);
	};

	useEffect(() => {
		const res = calendarNodes.find((c) =>
			c.leagueMatchdayNodes.some((n) => {
				if (n.leagueCode === bet.leagueCode) {
					return n.matchDay === updatedMatchDay;
				}
			})
		);
		setCalendar(res);
	}, [calendarNodes, bet, updatedMatchDay]);

	useEffect(() => {
		if (bet.seasonId) {
			dispatch(getAllSeasonCalendarNodes(bet.seasonId));
		}
	}, []);

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
			<Box>
				<Typography sx={{ m: 0.5, fontSize: '0.85rem' }}>
					<b>BetID:</b> {bet.id}
				</Typography>
			</Box>
			<BetInputPlayer defaultValue={bet.player} onUserSelect={handleUserSelection} />
			<MatchDayForm matchDay={bet.matchDay} onMatchDay={handleMatchDaySelection} />
			{calendar ? <CalendarNode calendar={calendar} /> : <CalendarNode noCalendar />}
			<BetInputTeams
				defaultHomeTeamName={bet.homeTeam?.title}
				defaultAwayTeamName={bet.awayTeam?.title}
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
							{getFullBetTitle(updatedBetTitle)}
						</Typography>
						<IconButton onClick={handleBetCancel}>
							<Dangerous color="error" sx={{ mt: -1.75, ml: -1.5, fontSize: '3rem' }} />
						</IconButton>
					</Box>
					<Checkbox
						sx={{ pt: 0.5 }}
						checked={updatedBetTitle?.isNot ?? false}
						onChange={handleIsNotChange}
						inputProps={{ 'aria-label': 'controlled' }}
					/>
					{t('not')}
				</Box>
			)}

			<BetInputOdds
				defaultBetOdds={bet.betOdds?.toString()}
				defaultBetSize={bet.betSize.toString()}
				onOddsSelect={handleOddsSelection}
			/>

			{bet.betStatus !== BET_STATUS_OPENED && bet.betStatus !== BET_STATUS_EMPTY && (
				<Box sx={{ textAlign: 'left' }}>
					<Typography sx={{ mx: 1, mt: 1, fontWeight: '600' }}>{t('betStatus')}</Typography>
					<Select
						autoWidth
						size="small"
						sx={{
							minWidth: '15rem',
							mb: 1,
							bgcolor:
								updatedBetStatus === BET_STATUS_WON
									? '#daf3db'
									: updatedBetStatus === BET_STATUS_RETURNED
									? '#f8f9d6'
									: updatedBetStatus === BET_STATUS_LOST
									? '#f3dada'
									: updatedBetStatus === BET_STATUS_OPENED
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
							value={gameResultInput}
							onChange={(event) => handleGameResultInputChange(event.target.value)}
						/>
					</Box>
				</Box>
			)}

			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, mb: 1 }}>
				<CustomCancelButton onClick={handleCloseForm} />
				<CustomButton
					sx={{ height: '2rem' }}
					onClick={() => handleBetUpdateOpenDialog(gameResultInput)}
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
							matchDay={updatedMatchDay}
							homeTeam={updatedHomeTeam}
							awayTeam={updatedAwayTeam}
							betTitle={updatedBetTitle}
							betOdds={updatedBetOdds || ''}
							betSize={updatedBetSize}
							betStatus={updatedBetStatus}
							gameResultInput={gameResultInput}
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
		</Box>
	);
}
