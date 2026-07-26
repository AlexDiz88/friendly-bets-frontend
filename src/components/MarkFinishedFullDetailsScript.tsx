import { Box, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import CustomButton from './custom/btn/CustomButton';
import { destructiveActionHintSx } from './custom/btn/customButtonStyles';
import CustomCancelButton from './custom/btn/CustomCancelButton';
import CustomSuccessButton from './custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from './custom/snackbar/snackbarSlice';
import { markFinishedFullDetailsFetched } from '../features/match-results/matchScheduleAdminApi';

export default function MarkFinishedFullDetailsScript({
	startLoading,
	stopLoading,
}: {
	startLoading: () => void;
	stopLoading: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [openDialog, setOpenDialog] = useState(false);

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			setOpenDialog(false);
			startLoading();
			try {
				const result = await markFinishedFullDetailsFetched();
				dispatch(
					showSuccessSnackbar({
						message: t('markFinishedFullDetailsSuccess', {
							matched: result.matchedCount,
							modified: result.modifiedCount,
						}),
					})
				);
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				dispatch(showErrorSnackbar({ message }));
			} finally {
				stopLoading();
			}
		},
		[dispatch, startLoading, stopLoading]
	);

	return (
		<Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
			<CustomButton
				sx={{ width: '100%' }}
				buttonColor="error"
				onClick={() => setOpenDialog(true)}
				buttonText={t('runScript')}
			/>
			<Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
				{t('runScriptMarkFinishedFullDetailsHint')}
			</Typography>
			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogContent>
					<Typography>
						<b>{t('runScript')}?</b>
						<Box component="span" sx={destructiveActionHintSx}>
							<br />
							{t('thisActionCannotBeCanceled')}
						</Box>
					</Typography>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={() => setOpenDialog(false)} />
					<CustomSuccessButton onClick={handleSubmit} />
				</DialogActions>
			</Dialog>
		</Box>
	);
}
