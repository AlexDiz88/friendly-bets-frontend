import { Dangerous } from '@mui/icons-material';
import { Box, Checkbox, IconButton, Switch, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomBetInputDialog from '../../components/custom/dialog/CustomBetInputDialog';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import useFetchCurrentUser from '../../components/hooks/useFetchCurrentUser';
import CalendarNode from '../admin/calendars/CalendarNode';
import { getAllSeasonCalendarNodes } from '../admin/calendars/calendarsSlice';
import { selectAllCalendarNodes } from '../admin/calendars/selectors';
import Calendar from '../admin/calendars/types/Calendar';
import League from '../admin/leagues/types/League';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import Team from '../admin/teams/types/Team';
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
	const season = useAppSelector(selectActiveSeason);
	const calendarNodes = useAppSelector(selectAllCalendarNodes);
	const [calendar, setCalendar] = useState<Calendar | undefined>();
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
	const [openDialog, setOpenDialog] = useState(false);
	const [openDialogEmptyBet, setOpenDialogEmptyBet] = useState(false);
	const [openDialogTwoEmptyBet, setOpenDialogTwoEmptyBet] = useState(false);
	const [isNot, setIsNot] = useState(false);

	useFetchCurrentUser();

	const scrollToBottom = (): void => {
		window.scrollTo({ top: 100, behavior: 'smooth' });
	};

	// добавление ставки
	const handleSaveClick = useCallback(async () => {
		setOpenDialog(false);
		if (season && selectedUser && selectedHomeTeam && selectedAwayTeam) {
			const betOddsToNumber = Number(selectedBetOdds.trim().replace(',', '.'));
			// TODO: добавить проверку на валидность кэфа (наличие пробелов между цифрами итд)
			const matchDayCode =
				matchDayInfo.matchDay === t('playoffRound.final') ? 'final' : matchDayInfo.matchDay;

			const dispatchResult = await dispatch(
				addBet({
					newBet: {
						seasonId: season.id,
						leagueId: selectedLeagueId,
						userId: selectedUser?.id,
						isPlayoff: matchDayInfo.isPlayoff,
						matchDay: matchDayCode,
						playoffRound: matchDayInfo.playoffRound,
						homeTeamId: selectedHomeTeam?.id,
						awayTeamId: selectedAwayTeam?.id,
						betTitle: isNot ? `${selectedBetTitle}${t('not')}` : selectedBetTitle,
						betOdds: betOddsToNumber,
						betSize: Number(selectedBetSize),
						calendarNodeId: calendar?.id,
					},
				})
			);

			if (addBet.fulfilled.match(dispatchResult)) {
				dispatch(showSuccessSnackbar({ message: t('betWasSuccessfullyAdded') }));
				setResetTeams(!resetTeams);
				setSelectedHomeTeam(undefined);
				setSelectedAwayTeam(undefined);
			}
			if (addBet.rejected.match(dispatchResult)) {
				dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
			}
			setSelectedBetTitle('');
			setSelectedBetOdds('');
			setIsNot(false);
		}
	}, [
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
		t,
		calendar,
	]);

	// добавление пустой ставки
	const handleSaveEmptyBet = useCallback(async () => {
		if (season && selectedUser) {
			const matchDayCode =
				matchDayInfo.matchDay === t('playoffRound.final') ? 'final' : matchDayInfo.matchDay;
			const dispatchResult = await dispatch(
				addEmptyBet({
					newEmptyBet: {
						seasonId: season.id,
						leagueId: selectedLeagueId,
						userId: selectedUser.id,
						isPlayoff: matchDayInfo.isPlayoff,
						matchDay: matchDayCode,
						playoffRound: matchDayInfo.playoffRound,
						betSize: Number(selectedEmptyBetSize),
						calendarNodeId: calendar?.id,
					},
				})
			);

			if (addEmptyBet.fulfilled.match(dispatchResult)) {
				if (openDialogEmptyBet) {
					dispatch(showSuccessSnackbar({ message: t('emptyBetWasSuccessfullyAdded') }));
				} else {
					dispatch(showSuccessSnackbar({ message: t('twoEmptyBetsWasSuccessfullyAdded') }));
				}
			}
			if (addEmptyBet.rejected.match(dispatchResult)) {
				dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
			}
			setOpenDialogEmptyBet(false);
			setOpenDialogTwoEmptyBet(false);
		}
	}, [
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
		await handleSaveEmptyBet();
		handleSaveEmptyBet();
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

	useEffect(() => {
		const res = calendarNodes.find((c) =>
			c.leagueMatchdayNodes.some((n) => {
				if (n.leagueCode === selectedLeague?.leagueCode) {
					if (matchDayInfo.isPlayoff && matchDayInfo.matchDay !== t('playoffRound.final')) {
						return (
							n.matchDay === matchDayInfo.matchDay && n.playoffRound === matchDayInfo.playoffRound
						);
					}
					if (matchDayInfo.matchDay === t('playoffRound.final')) {
						return n.matchDay === 'final';
					}
					return n.matchDay === matchDayInfo.matchDay;
				}
			})
		);
		setCalendar(res);
	}, [selectedLeague, matchDayInfo]);

	useEffect(() => {
		if (season) {
			dispatch(getAllSeasonCalendarNodes(season?.id));
		}
	}, [season]);

	useEffect(() => {
		if (!season) {
			dispatch(getActiveSeason());
		}
	}, []);

	return (
		<Box
			sx={{
				m: 1,
				mb: 10,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				minWidth: '15rem',
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
						<>
							<MatchDayForm
								key={selectedLeague.id}
								matchDayInfo={{
									isPlayoff: false,
									matchDay: selectedLeague ? selectedLeague.currentMatchDay : '1',
									playoffRound: '',
								}}
								onMatchDayInfo={handleMatchDayInfo}
							/>
							{calendar ? <CalendarNode calendar={calendar} /> : <CalendarNode noCalendar />}
						</>
					)}
				</Box>
			)}
			{!isEmptyBet && (
				<>
					{selectedLeagueId && matchDayInfo && (
						<BetInputTeams
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
							<Box sx={{ display: 'flex', justifyContent: 'center' }}>
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
							{t('not')}
						</Box>
					)}
					{selectedBetTitle && <BetInputOdds onOddsSelect={handleOddsSelection} />}
					{showSendButton && selectedBetOdds && selectedBetSize && (
						<CustomButton
							sx={{ mt: 3, height: '3rem', px: 6 }}
							onClick={handleOpenDialog}
							buttonText={t('sendBet')}
							buttonColor="secondary"
						/>
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
					<CustomButton
						sx={{ mt: 2, height: '2.5rem', px: 2.1, bgcolor: '#525252' }}
						onClick={handleOpenDialogEmptyBet}
						buttonText={t('sendEmptyBet')}
					/>
					<CustomButton
						sx={{ mt: 2, height: '2.5rem', px: 2.1, bgcolor: '#525252' }}
						onClick={handleOpenDialogTwoEmptyBet}
						buttonText={t('sendTwoEmptyBet')}
					/>
				</>
			)}

			<CustomBetInputDialog
				open={openDialog}
				onClose={handleCloseDialog}
				onSave={handleSaveClick}
				summaryComponent={
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
					/>
				}
			/>

			<CustomBetInputDialog
				open={openDialogEmptyBet}
				onClose={handleCloseDialog}
				onSave={handleSaveEmptyBet}
				title={t('addEmptyBet')}
			/>

			<CustomBetInputDialog
				open={openDialogTwoEmptyBet}
				onClose={handleCloseDialog}
				onSave={handleSaveTwoEmptyBet}
				title={t('addTwoEmptyBet')}
			/>
		</Box>
	);
}
