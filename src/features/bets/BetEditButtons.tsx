import { Box, Dialog, DialogActions, DialogContent } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import { removeExtraLabels, transformGameResult } from '../../components/utils/GameScoreValidation';
import NotificationSnackbar from '../../components/utils/NotificationSnackbar';
import BetEditForm from './BetEditForm';
import { deleteBet } from './betsSlice';
import Bet from './types/Bet';

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
	const [snackbarDuration, setSnackbarDuration] = useState(1500);

	const handleBetDeleteSave = useCallback(async () => {
		setOpenDeleteDialog(false);
		const dispatchResult = await dispatch(
			deleteBet({ betId: bet.id, seasonId: bet.seasonId, leagueId: bet.leagueId })
		);

		if (deleteBet.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('betWasSuccessfullyDeleted'));
		}
		if (deleteBet.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarDuration(3000);
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
				<CustomButton
					sx={{ height: '2rem', mr: 1 }}
					onClick={handleEditBet}
					buttonText={t('btnText.edit')}
				/>
				<CustomButton
					sx={{ height: '2rem' }}
					onClick={handleDeleteBetOpenDialog}
					buttonColor="warning"
					buttonText={t('btnText.delete')}
				/>
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
				<Box sx={{ color: 'brown', fontWeight: 600, m: 1, maxWidth: '18rem' }}>
					{t('editEmptyBetsInProgress')}
				</Box>
			)}
			<Dialog open={openDeleteDialog} onClose={handleCloseDialog}>
				<DialogContent>
					<Box sx={{ fontWeight: '600', fontSize: '1rem' }}>
						<Box sx={{ mb: 1.5 }}>{t('deleteBetInfo')}</Box>
						<Box sx={{ color: 'brown', fontWeight: 600 }}>{t('deleteBetAttention')}</Box>
					</Box>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={handleCloseDialog} />
					<CustomButton
						sx={{ height: '2rem' }}
						onClick={handleBetDeleteSave}
						buttonColor="warning"
						buttonText={t('btnText.delete')}
					/>
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
