/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Box, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { getActiveSeasonId } from '../features/admin/seasons/seasonsSlice';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { playersStatsFullRecalculation } from '../features/stats/statsSlice';
import CustomButton from './custom/btn/CustomButton';
import CustomCancelButton from './custom/btn/CustomCancelButton';
import CustomSuccessButton from './custom/btn/CustomSuccessButton';
import NotificationSnackbar from './utils/NotificationSnackbar';

export default function AllStatsRecalculating(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const [openRecalculatePlayerStatsDialog, setOpenRecalculatePlayerStatsDialog] = useState(false);
	const [openRecalculateTeamStatsDialog, setOpenRecalculateTeamStatsDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleSubmitFullRecalculation = useCallback(
		async (event?: React.FormEvent) => {
			setOpenRecalculatePlayerStatsDialog(false);
			event?.preventDefault();
			if (activeSeasonId) {
				const dispatchResult = await dispatch(playersStatsFullRecalculation(activeSeasonId));

				if (playersStatsFullRecalculation.fulfilled.match(dispatchResult)) {
					setOpenSnackbar(true);
					setSnackbarSeverity('success');
					setSnackbarMessage(t('statsWasSuccessfullyRecalculated'));
				}
				if (playersStatsFullRecalculation.rejected.match(dispatchResult)) {
					setOpenSnackbar(true);
					setSnackbarSeverity('error');
					if (dispatchResult.error.message) {
						setSnackbarMessage(dispatchResult.error.message || t('errorByStatsRecalculating'));
					}
				}
			}
		},
		[dispatch, activeSeasonId]
	);

	const handleSubmitStatsByTeamsRecalculation = useCallback(
		async (event?: React.FormEvent) => {
			setOpenRecalculateTeamStatsDialog(false);
			event?.preventDefault();
			if (activeSeasonId) {
				try {
					let url = `${
						import.meta.env.VITE_PRODUCT_SERVER
					}/api/stats/season/${activeSeasonId}/recalculation/teams`;
					if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
						url = `/api/stats/season/${activeSeasonId}/recalculation/teams`;
					}
					const response = await fetch(`${url}`);

					if (response.ok) {
						setOpenSnackbar(true);
						setSnackbarSeverity('success');
						setSnackbarMessage(t('statsWasSuccessfullyRecalculated'));
					} else {
						const errorMessage = await response.text();
						setOpenSnackbar(true);
						setSnackbarSeverity('error');
						setSnackbarMessage(errorMessage || t('errorByStatsRecalculating'));
					}
				} catch (error) {
					setOpenSnackbar(true);
					setSnackbarSeverity('error');
					setSnackbarMessage(t('errorByStatsRecalculating'));
				}
			}
		},
		[dispatch, activeSeasonId]
	);

	const handleRecalculatePlayerStatsDialog = (): void => {
		setOpenRecalculatePlayerStatsDialog(!openRecalculatePlayerStatsDialog);
	};

	const handleRecalculateTeamStatsDialog = (): void => {
		setOpenRecalculateTeamStatsDialog(!openRecalculateTeamStatsDialog);
	};

	const handleCloseDialog = (): void => {
		setOpenRecalculatePlayerStatsDialog(false);
		setOpenRecalculateTeamStatsDialog(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId());
		}
	}, [dispatch]);

	return (
		<Box sx={{ mt: 0, py: 2 }}>
			<Box sx={{ fontSize: 22, fontWeight: 600, mb: 1.5 }}>{t('dbManagement')}</Box>
			<Box>
				<CustomButton
					sx={{ mb: 2, backgroundColor: 'brown' }}
					onClick={handleRecalculatePlayerStatsDialog}
					buttonText={t('mainStatsRecalculating')}
				/>
			</Box>
			<Box>
				<CustomButton
					sx={{ backgroundColor: 'brown' }}
					onClick={handleRecalculateTeamStatsDialog}
					buttonText={t('teamStatsRecalculating')}
				/>
			</Box>
			<Dialog open={openRecalculatePlayerStatsDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
						<Box component="span">{t('mainStatsWillBeRecalculated')}</Box>
						<br />
						<Box component="span" sx={{ color: 'brown', fontWeight: 600 }}>
							{t('warning.thisActionCannotBeCanceled')}
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={handleCloseDialog} />
					<CustomSuccessButton onClick={handleSubmitFullRecalculation} />
				</DialogActions>
			</Dialog>

			<Dialog open={openRecalculateTeamStatsDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
						<Box component="span">{t('teamStatsWillBeRecalculated')}</Box>
						<br />
						<Box component="span" sx={{ color: 'brown', fontWeight: 600 }}>
							{t('warning.thisActionCannotBeCanceled')}
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={handleCloseDialog} />
					<CustomSuccessButton onClick={handleSubmitStatsByTeamsRecalculation} />
				</DialogActions>
			</Dialog>

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
