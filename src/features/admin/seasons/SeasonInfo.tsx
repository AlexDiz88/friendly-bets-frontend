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
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
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
			dispatch(showSuccessSnackbar({ message: t('seasonStatusWasSuccessfullyUpdated') }));
			setShowStatusOptions(false);
			setSeasonStatus(seasonStatus);
		}
		if (changeSeasonStatus.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
		dispatch(getSeasons());
		dispatch(getActiveSeasonId());
		dispatch(getActiveSeason());
	}, [id, seasonStatus]);

	return (
		<Box
			sx={{
				border: 1,
				borderColor: 'divider',
				borderRadius: 2,
				mb: 1.5,
				p: 1.5,
				bgcolor: 'background.default',
			}}
		>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
				<EventNote sx={{ flexShrink: 0 }} fontSize="medium" color="info" />
				<Box component="span" sx={{ flex: 1, fontWeight: 600, fontSize: '0.9375rem', textAlign: 'left' }}>
					{title}
				</Box>
				<Box sx={{ flexShrink: 0 }}>
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
					<Box sx={{ my: 1, display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
						<CustomButton
							sx={{ flex: 1, minWidth: '7rem' }}
							onClick={() => handleStatusChangeClick()}
							buttonColor="info"
							buttonVariant="outlined"
							buttonSize="small"
							buttonText={t('changeStatus')}
						/>
						<CustomButton
							sx={{ flex: 1, minWidth: '7rem' }}
							onClick={() => handleLeaguesClick()}
							buttonColor="info"
							buttonVariant="outlined"
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
		</Box>
	);
}
