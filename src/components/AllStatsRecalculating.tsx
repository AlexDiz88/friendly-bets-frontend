/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useCallback, useEffect, useState } from 'react';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import NotificationSnackbar from './utils/NotificationSnackbar';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { playersStatsFullRecalculation } from '../features/stats/statsSlice';
import { getActiveSeasonId } from '../features/admin/seasons/seasonsSlice';

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
					setSnackbarMessage('Статистика успешно пересчитана');
				}
				if (playersStatsFullRecalculation.rejected.match(dispatchResult)) {
					setOpenSnackbar(true);
					setSnackbarSeverity('error');
					if (dispatchResult.error.message) {
						setSnackbarMessage(dispatchResult.error.message);
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
						setSnackbarMessage('Статистика успешно пересчитана');
					} else {
						const errorMessage = await response.text();
						setOpenSnackbar(true);
						setSnackbarSeverity('error');
						setSnackbarMessage(errorMessage || 'Произошла ошибка при пересчете статистики');
					}
				} catch (error) {
					setOpenSnackbar(true);
					setSnackbarSeverity('error');
					setSnackbarMessage('Произошла ошибка при пересчете статистики');
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
		<Box sx={{ mb: 1, mt: 0.5, pb: 1.5 }}>
			<Box>
				<Button
					onClick={() => handleRecalculatePlayerStatsDialog()}
					sx={{ height: '3.5rem', maxWidth: '14rem', px: 3 }}
					variant="contained"
					type="submit"
					color="secondary"
					size="large"
				>
					<Typography
						variant="button"
						fontWeight="600"
						fontSize="0.9rem"
						fontFamily="Shantell Sans"
					>
						Пересчёт общей статистики
					</Typography>
				</Button>
			</Box>
			<Box>
				<Button
					onClick={() => handleRecalculateTeamStatsDialog()}
					sx={{ height: '3.5rem', maxWidth: '14rem', px: 3, mt: 2 }}
					variant="contained"
					type="submit"
					color="secondary"
					size="large"
				>
					<Typography
						variant="button"
						fontWeight="600"
						fontSize="0.9rem"
						fontFamily="Shantell Sans"
					>
						Пересчёт статистики по командам
					</Typography>
				</Button>
			</Box>
			<Dialog open={openRecalculatePlayerStatsDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
						<Box component="span">Будет пересчитана статистика по всем участникам сезона</Box>
						<br />
						<Box component="span" sx={{ color: 'brown', fontWeight: 600 }}>
							Внимание!! Это действие нельзя откатить после подтверждения!
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button sx={{ mr: 1 }} variant="contained" color="error" onClick={handleCloseDialog}>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							Отмена
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="success"
						onClick={handleSubmitFullRecalculation}
						autoFocus
					>
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

			<Dialog open={openRecalculateTeamStatsDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
						<Box component="span">Будет пересчитана статистика по всем командам сезона</Box>
						<br />
						<Box component="span" sx={{ color: 'brown', fontWeight: 600 }}>
							Внимание!! Это действие нельзя откатить после подтверждения!
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button sx={{ mr: 1 }} variant="contained" color="error" onClick={handleCloseDialog}>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							Отмена
						</Typography>
					</Button>
					<Button
						variant="contained"
						color="success"
						onClick={handleSubmitStatsByTeamsRecalculation}
						autoFocus
					>
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
					duration={3000}
				/>
			</Box>
		</Box>
	);
}
