import { Box, FormControl, Grid, List, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import NotificationSnackbar from '../../../components/utils/NotificationSnackbar';
import SeasonInfo from './SeasonInfo';
import { addSeason, getLeagueCodeList, getSeasonStatusList, getSeasons } from './seasonsSlice';
import { selectSeasons } from './selectors';
import Season from './types/Season';

export default function SeasonsManagement(): JSX.Element {
	const dispatch = useAppDispatch();
	const seasons: Season[] = useAppSelector(selectSeasons);
	const [seasonTitle, setSeasonTitle] = useState<string>('');
	const [seasonBetCount, setSeasonBetCount] = useState<string>('');
	const [showCreateSeason, setShowCreateSeason] = useState(false);
	const [showAllSeasons, setShowAllSeasons] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			const dispatchResult = await dispatch(
				addSeason({
					title: seasonTitle,
					betCountPerMatchDay: Number(seasonBetCount),
				})
			);

			if (addSeason.fulfilled.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('success');
				setSnackbarMessage(t('seasonWasSuccessfullyCreated'));
				setSeasonTitle('');
				setSeasonBetCount('');
				setShowCreateSeason(false);
				setShowAllSeasons(true);
				dispatch(getSeasons());
			}
			if (addSeason.rejected.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('error');
				if (dispatchResult.error.message) {
					setSnackbarMessage(dispatchResult.error.message);
				}
			}
		},
		[dispatch, seasonBetCount, seasonTitle]
	);

	const handleShowAllSeasons = (): void => {
		dispatch(getSeasonStatusList());
		dispatch(getLeagueCodeList());
		dispatch(getSeasons());
		setShowAllSeasons(true);
	};

	const handleHideAllSeasons = (): void => {
		setShowAllSeasons(false);
	};

	const handleShowCreateNewSeason = (): void => {
		setShowCreateSeason(!showCreateSeason);
	};

	const handleSeasonTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setSeasonTitle(event.target.value);
	};

	const handleSeasonBetCountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setSeasonBetCount(event.target.value);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<Box sx={{ margin: '0 auto', textAlign: 'center', width: '20rem', borderBottom: 2 }}>
			<Box sx={{ fontSize: 22, fontWeight: 600, my: 1.5 }}>{t('SeasonsManagement')}</Box>
			<CustomButton
				sx={{ px: 2, mb: 2 }}
				onClick={() => handleShowCreateNewSeason()}
				buttonColor="secondary"
				buttonText={t('newSeason')}
			/>
			{showCreateSeason && (
				<>
					<FormControl fullWidth sx={{ px: 2 }}>
						<Box sx={{ fontSize: 18, fontWeight: 600 }}>{t('addNewSeason')}</Box>
						<Box sx={{ my: 1 }}>
							<TextField
								fullWidth
								required
								id="season-title"
								label={t('SeasonName')}
								value={seasonTitle}
								onChange={handleSeasonTitleChange}
							/>
						</Box>
						<Box sx={{ mb: 2, maxWidth: '11.5rem' }}>
							<TextField
								required
								type="number"
								id="season-bets-count"
								label={t('BetsCountPerMatchday')}
								size="small"
								value={seasonBetCount}
								onChange={handleSeasonBetCountChange}
							/>
						</Box>
						<Box sx={{ mb: 2 }}>
							<CustomCancelButton onClick={handleShowCreateNewSeason} />
							<CustomSuccessButton onClick={handleSubmit} buttonText={t('btnText.create')} />
						</Box>
					</FormControl>
				</>
			)}

			{!showCreateSeason && (
				<Box sx={{ mb: 2 }}>
					{!showAllSeasons && (
						<Box sx={{ mb: 2 }}>
							<CustomButton
								onClick={() => handleShowAllSeasons()}
								buttonText={t('showAllSeasons')}
							/>
						</Box>
					)}
					{showAllSeasons && (
						<Box>
							<CustomButton onClick={() => handleHideAllSeasons()} buttonText={t('hide')} />
						</Box>
					)}
					{showAllSeasons && (
						<Grid item xs={2} md={2} sx={{ mb: 1 }}>
							{!!seasons.length && (
								<>
									<Typography sx={{ mt: 1.5, mb: 0.5 }}>{t('allSeasonsList')}:</Typography>
									<List>
										{seasons
											.slice()
											.reverse()
											.map((season) => (
												<SeasonInfo key={season.id} data={season} />
											))}
									</List>
								</>
							)}
						</Grid>
					)}
				</Box>
			)}

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
