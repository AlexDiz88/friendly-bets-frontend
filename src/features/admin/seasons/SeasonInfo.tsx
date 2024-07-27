import {
	AssistantPhoto,
	EventNote,
	NoteAdd,
	PauseCircle,
	PlayCircle,
	PlaylistAddCircle,
} from '@mui/icons-material';
import { Box, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import AddLeagueInSeason from '../leagues/AddLeagueInSeason';
import { changeSeasonStatus, getActiveSeason, getActiveSeasonId, getSeasons } from './seasonsSlice';
import { selectStatuses } from './selectors';
import Season from './types/Season';

export default function SeasonInfo({
	data: { id, title, status, leagues },
}: {
	data: Season;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const statuses = useAppSelector(selectStatuses);
	const [seasonStatus, setSeasonStatus] = useState<string>(status);
	const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);
	const [showLeaguesList, setShowLeaguesList] = useState<boolean>(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleLeaguesClick = (): void => {
		setShowStatusOptions(false);
		setShowLeaguesList(!showLeaguesList);
	};

	const handleStatusChange = (event: SelectChangeEvent): void => {
		setSeasonStatus(event.target.value);
	};

	const handleStatusChangeClick = (): void => {
		setShowStatusOptions(!showStatusOptions);
		setShowLeaguesList(false);
	};

	const handleCancelClick = (): void => {
		setShowStatusOptions(false);
		setShowLeaguesList(false);
		setSeasonStatus(status);
	};

	const handleLeagueListShow = (isShow: boolean): void => {
		setShowLeaguesList(isShow);
	};

	const handleSaveClick = useCallback(async () => {
		const dispatchResult = await dispatch(changeSeasonStatus({ id, status: seasonStatus }));
		if (changeSeasonStatus.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('seasonStatusWasSuccessfullyUpdated'));
			setShowStatusOptions(false);
			setSeasonStatus(seasonStatus);
		}
		if (changeSeasonStatus.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
		dispatch(getSeasons());
		dispatch(getActiveSeasonId());
		dispatch(getActiveSeason());
	}, [dispatch, id, seasonStatus]);

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<Box
			sx={{
				border: 2,
				borderRadius: 2,
				mb: 2,
				px: 1,
				boxShadow: '0px 2px 18px rgba(0, 0, 0, 0.25), 0px 4px 18px rgba(0, 0, 0, 0.25)',
			}}
		>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
				<EventNote sx={{ m: 1 }} fontSize="large" color="info" />
				<b>{title}</b>
				<Box>
					{status === 'CREATED' && (
						<IconButton>
							<NoteAdd fontSize="large" color="disabled" />
						</IconButton>
					)}
					{status === 'SCHEDULED' && (
						<IconButton>
							<PlaylistAddCircle fontSize="large" color="secondary" />
						</IconButton>
					)}
					{status === 'ACTIVE' && (
						<IconButton>
							<PlayCircle fontSize="large" color="success" />
						</IconButton>
					)}
					{status === 'PAUSED' && (
						<IconButton>
							<PauseCircle fontSize="large" color="warning" />
						</IconButton>
					)}
					{status === 'FINISHED' && (
						<IconButton>
							<AssistantPhoto fontSize="large" color="error" />
						</IconButton>
					)}
				</Box>
			</Box>
			<Box>
				<InputLabel id="season-status-label">
					{t('actualStatus')}: {status}
				</InputLabel>
				{!showStatusOptions && (
					<Box sx={{ my: 1, display: 'flex', justifyContent: 'center' }}>
						<CustomButton
							sx={{ border: 2, mr: 0.5 }}
							onClick={() => handleStatusChangeClick()}
							buttonColor="info"
							buttonVariant="outlined"
							buttonSize="small"
							buttonText={t('changeStatus')}
						/>
						<CustomButton
							onClick={() => handleLeaguesClick()}
							buttonColor="info"
							buttonSize="small"
							buttonText={t('leaguesList')}
						/>
					</Box>
				)}
				{showStatusOptions && (
					<>
						<Select
							fullWidth
							sx={{ my: 1 }}
							labelId="season-status-label"
							id="season-status-select"
							value={seasonStatus}
							onChange={handleStatusChange}
							size="small"
						>
							{statuses.map((s) => (
								<MenuItem key={s} value={s}>
									{s}
								</MenuItem>
							))}
						</Select>
						<Box sx={{ pb: 1 }}>
							<CustomCancelButton onClick={handleCancelClick} />
							<CustomSuccessButton onClick={handleSaveClick} buttonText={t('btnText.change')} />
						</Box>
					</>
				)}
				{showLeaguesList && (
					<AddLeagueInSeason
						seasonId={id}
						leagues={leagues}
						handleLeagueListShow={handleLeagueListShow}
					/>
				)}
			</Box>
			<Box textAlign="center">
				<NotificationSnackbar
					open={openSnackbar}
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					message={snackbarMessage}
					duration={3000}
				/>
			</Box>
		</Box>
	);
}
