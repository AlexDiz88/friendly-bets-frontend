import { useState, useCallback } from 'react';
import { useAppDispatch } from '../app/hooks';
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material';
import NotificationSnackbar from './utils/NotificationSnackbar';
import { dbRework } from '../features/admin/seasons/seasonsSlice';

export default function DatabaseUpdate(): JSX.Element {
	const dispatch = useAppDispatch();
	const [openDialog, setOpenDialog] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');

	const handleDbUpdateSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			setOpenDialog(false);
			const dispatchResult = await dispatch(dbRework());

			if (dbRework.fulfilled.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('success');
				setSnackbarMessage('База данных успешно обновлена');
			}
			if (dbRework.rejected.match(dispatchResult)) {
				setOpenSnackbar(true);
				setSnackbarSeverity('error');
				if (dispatchResult.error.message) {
					setSnackbarMessage(dispatchResult.error.message);
				}
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

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<Box sx={{ mb: 1, mt: 0.5, pb: 1.5 }}>
			<Button
				disabled
				onClick={handleDbUpdate}
				sx={{ height: '2.5rem', px: 5 }}
				variant="contained"
				type="submit"
				color="warning"
				size="large"
			>
				<Typography variant="button" fontWeight="600" fontSize="0.9rem" fontFamily="Shantell Sans">
					Обновить базу данных
				</Typography>
			</Button>

			<Dialog open={openDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<Typography sx={{ fontSize: '0.9rem' }}>
						<b>Обновить базу данных?</b>
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button sx={{ mr: 1 }} variant="outlined" color="error" onClick={handleCloseDialog}>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							Отмена
						</Typography>
					</Button>
					<Button variant="contained" color="success" onClick={handleDbUpdateSubmit} autoFocus>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							Подтвердить
						</Typography>
					</Button>
				</DialogActions>
			</Dialog>

			<Box textAlign="center">
				<NotificationSnackbar
					open={openSnackbar}
					onClose={handleCloseSnackbar}
					severity={snackbarSeverity}
					message={snackbarMessage}
					duration={2000}
				/>
			</Box>
		</Box>
	);
}
