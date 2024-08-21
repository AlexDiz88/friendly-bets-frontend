/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Box, Dialog, DialogActions, DialogContent } from '@mui/material';
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
import { getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
import { playersStatsFullRecalculation } from './statsSlice';

export default function StatsRecalculating({
	startLoading,
	stopLoading,
}: {
	startLoading: () => void;
	stopLoading: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const [openRecalculatePlayerStatsDialog, setOpenRecalculatePlayerStatsDialog] = useState(false);
	const [openRecalculateTeamStatsDialog, setOpenRecalculateTeamStatsDialog] = useState(false);

	const handleSubmitFullRecalculation = useCallback(
		async (event?: React.FormEvent) => {
			setOpenRecalculatePlayerStatsDialog(false);
			event?.preventDefault();
			startLoading();
			if (activeSeasonId) {
				const dispatchResult = await dispatch(playersStatsFullRecalculation(activeSeasonId));

				if (playersStatsFullRecalculation.fulfilled.match(dispatchResult)) {
					dispatch(showSuccessSnackbar({ message: t('statsWasSuccessfullyRecalculated') }));
				}
				if (playersStatsFullRecalculation.rejected.match(dispatchResult)) {
					dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
				}
				stopLoading();
			}
		},
		[dispatch, activeSeasonId]
	);

	const handleSubmitStatsByTeamsRecalculation = useCallback(
		async (event?: React.FormEvent) => {
			setOpenRecalculateTeamStatsDialog(false);
			event?.preventDefault();
			startLoading();
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
						dispatch(showSuccessSnackbar({ message: t('statsWasSuccessfullyRecalculated') }));
					} else {
						const errorMessage = await response.text();
						dispatch(
							showErrorSnackbar({ message: errorMessage || t('errorByStatsRecalculating') })
						);
					}
				} catch (error) {
					dispatch(showErrorSnackbar({ message: t('errorByStatsRecalculating') }));
				}
				stopLoading();
			}
		},
		[activeSeasonId]
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
					<Box sx={{ fontWeight: '600', fontSize: '1rem' }}>
						{t('mainStatsWillBeRecalculated')}
						<Box sx={{ color: 'brown', fontWeight: 600 }}>{t('thisActionCannotBeCanceled')}</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={handleCloseDialog} />
					<CustomSuccessButton onClick={handleSubmitFullRecalculation} />
				</DialogActions>
			</Dialog>

			<Dialog open={openRecalculateTeamStatsDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<Box sx={{ fontWeight: '600', fontSize: '1rem' }}>
						{t('teamStatsWillBeRecalculated')}
						<Box sx={{ color: 'brown', fontWeight: 600 }}>{t('thisActionCannotBeCanceled')}</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={handleCloseDialog} />
					<CustomSuccessButton onClick={handleSubmitStatsByTeamsRecalculation} />
				</DialogActions>
			</Dialog>
		</Box>
	);
}
