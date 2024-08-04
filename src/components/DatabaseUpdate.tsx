import { Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { dbUpdate } from '../features/admin/seasons/seasonsSlice';
import CustomButton from './custom/btn/CustomButton';
import CustomCancelButton from './custom/btn/CustomCancelButton';
import CustomSuccessButton from './custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from './custom/snackbar/snackbarSlice';

export default function DatabaseUpdate(): JSX.Element {
	const dispatch = useAppDispatch();
	const [openDialog, setOpenDialog] = useState(false);

	const handleDbUpdateSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			setOpenDialog(false);
			const dispatchResult = await dispatch(dbUpdate());

			if (dbUpdate.fulfilled.match(dispatchResult)) {
				dispatch(showSuccessSnackbar({ message: t('databaseWasSuccessfullyUpdated') }));
			}
			if (dbUpdate.rejected.match(dispatchResult)) {
				dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
			}
		},
		[dispatch]
	);

	const handleDbUpdate = (): void => {
		setOpenDialog(true);
	};

	const handleCloseDialog = (): void => {
		setOpenDialog(false);
	};

	return (
		<Box sx={{ m: '0 auto', textAlign: 'center', width: '20rem', mb: 2, pb: 2, borderBottom: 2 }}>
			<CustomButton
				sx={{ backgroundColor: 'brown' }}
				onClick={handleDbUpdate}
				buttonText={t('dbUpdate')}
			/>
			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<Typography>
						<b>{t('dbUpdate')}?</b>
						<Box component="span" sx={{ color: 'brown', fontWeight: 600 }}>
							<br />
							{t('thisActionCannotBeCanceled')}
						</Box>
					</Typography>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={handleCloseDialog} />
					<CustomSuccessButton onClick={handleDbUpdateSubmit} />
				</DialogActions>
			</Dialog>
		</Box>
	);
}
