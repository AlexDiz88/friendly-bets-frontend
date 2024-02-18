import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import {
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	Typography,
} from '@mui/material';
import Bet from './types/Bet';
import BetEditForm from './BetEditForm';
import NotificationSnackbar from '../../components/utils/NotificationSnackbar';
import { deleteBet } from './betsSlice';
import { removeExtraLabels, transformGameResult } from '../../components/utils/GameScoreValidation';

export default function BetEditButtons({ bet }: { bet: Bet }): JSX.Element {
	const dispatch = useAppDispatch();
	const [showEditForm, setShowEditForm] = useState(false);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [transformedGameResult, setTransformedGameResult] = useState<string>('');
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarDuration, setSnackbarduration] = useState(1500);

	const handleBetDeleteSave = useCallback(async () => {
		setOpenDeleteDialog(false);
		const dispatchResult = await dispatch(
			deleteBet({ betId: bet.id, seasonId: bet.seasonId, leagueId: bet.leagueId })
		);

		if (deleteBet.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage('Ставка успешно аннулирована');
		}
		if (deleteBet.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarduration(3000);
			setSnackbarSeverity('error');
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, bet.id, bet.seasonId, bet.leagueId]);

	const handleEditBet = (): void => {
		setShowEditForm(!showEditForm);
		const result = transformGameResult(removeExtraLabels(bet.gameResult || ''));
		setTransformedGameResult(result);
	};

	const handleDeleteBetOpenDialog = (): void => {
		setOpenDeleteDialog(!openDeleteDialog);
	};

	const handleCloseDialog = (): void => {
		setOpenDeleteDialog(false);
	};

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<Box>
			<Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
				<Button sx={{ mr: 1 }} variant="contained" color="info" onClick={() => handleEditBet()}>
					<Typography
						variant="button"
						fontWeight="600"
						fontSize="0.8rem"
						fontFamily="Shantell Sans"
					>
						Редактировать
					</Typography>
				</Button>
				<Button variant="contained" color="warning" onClick={() => handleDeleteBetOpenDialog()}>
					<Typography
						variant="button"
						fontWeight="600"
						fontSize="0.8rem"
						fontFamily="Shantell Sans"
					>
						Аннулировать
					</Typography>
				</Button>
			</Box>
			{showEditForm && bet.betStatus !== 'EMPTY' && (
				<BetEditForm
					bet={bet}
					transformedGameResult={transformedGameResult}
					handleEditBet={handleEditBet}
				/>
			)}
			{/* // TODO сделать отдельную форму для пустой ставки ? */}
			{showEditForm && bet.betStatus === 'EMPTY' && (
				<Box sx={{ color: 'brown', fontWeight: 600, m: 1 }}>
					Редактирование пустых ставок в разработке
				</Box>
			)}
			<Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<DialogContentText sx={{ fontWeight: '600', fontSize: '1rem' }}>
						<Box component="span">
							Ставка будет аннулирована и больше не будет доступна для просмотра и редактирования.
						</Box>
						<br />
						<Box component="span" sx={{ color: 'brown', fontWeight: 600 }}>
							Внимание!! Это действие нельзя откатить после подтверждения!
						</Box>
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button sx={{ mr: 1 }} variant="outlined" color="info" onClick={handleCloseDialog}>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							Отмена
						</Typography>
					</Button>
					<Button variant="contained" color="warning" onClick={handleBetDeleteSave} autoFocus>
						<Typography
							variant="button"
							fontWeight="600"
							fontSize="0.9rem"
							fontFamily="Shantell Sans"
						>
							Аннулировать
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
					duration={snackbarDuration}
				/>
			</Box>
		</Box>
	);
}
