import { Close, DoubleArrow, SportsSoccer } from '@mui/icons-material';
import { Box, Dialog, DialogActions, DialogContent, Fab, Icon, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
	getScheduledSeason,
	registrationInSeason,
} from '../../features/admin/seasons/seasonsSlice';
import { selectScheduledSeason } from '../../features/admin/seasons/selectors';
import { getProfile } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/selectors';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
import Rules from '../Rules';
import NotificationSnackbar from '../utils/NotificationSnackbar';

export default function SeasonRegister(): JSX.Element {
	const scheduledSeason = useAppSelector(selectScheduledSeason);
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectUser);
	const [showRules, setShowRules] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [openDialog, setOpenDialog] = useState(false);

	const handleConfirm = useCallback(async () => {
		if (scheduledSeason?.id) {
			const dispatchResult = await dispatch(registrationInSeason({ seasonId: scheduledSeason.id }));

			if (registrationInSeason.fulfilled.match(dispatchResult)) {
				await dispatch(getScheduledSeason());
				setOpenSnackbar(true);
				setSnackbarSeverity('success');
				setSnackbarMessage(t('youWereSuccessfullyRegisteredInTournament'));
				setOpenDialog(false);
			}
			if (registrationInSeason.rejected.match(dispatchResult)) {
				setOpenDialog(false);
				setOpenSnackbar(true);
				setSnackbarSeverity('error');
				if (dispatchResult.error.message) {
					setSnackbarMessage(dispatchResult.error.message);
				}
			}
		}
	}, [dispatch, scheduledSeason]);

	const handleOpenDialog = (): void => {
		setOpenDialog(true);
	};

	const handleCloseDialog = (): void => {
		setOpenDialog(false);
	};

	const handleRulesClick = (): void => {
		setShowRules(!showRules);
	};

	useEffect(() => {
		dispatch(getProfile());
		dispatch(getScheduledSeason());
	}, [dispatch]);

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	return (
		<Box sx={{ textAlign: 'center', mx: 2, mt: 2, mb: 4 }}>
			<Typography sx={{ borderBottom: 2, pb: 1, mx: 2, fontWeight: '600', fontSize: '1.4rem' }}>
				{t('registerOnTournament')}
			</Typography>
			{scheduledSeason && scheduledSeason.title ? (
				<>
					<Typography sx={{ pb: 1, mx: 2, mt: 3, fontWeight: '600', fontSize: '1.1rem' }}>
						<Icon sx={{ pr: 0.5, pb: 0.5, mb: -0.5 }}>
							<SportsSoccer />
						</Icon>
						{t('season')}: {scheduledSeason.title}
					</Typography>
					<Typography sx={{ pb: 1, mx: 2, fontWeight: '600', fontSize: '1.1rem' }}>
						{t('listOfPlayers')}:
					</Typography>
					{scheduledSeason.players.map((p) => (
						<Box key={p.id}>{p.username}</Box>
					))}
					{currentUser && scheduledSeason.players.some((player) => player.id === currentUser.id) ? (
						<Box sx={{ mt: 1, fontSize: '1rem', fontWeight: 600, color: 'green' }}>
							{t('congratulations')}
							<br />
							{t('youAreRegistered')}
						</Box>
					) : (
						<CustomSuccessButton
							sx={{ height: '3rem', px: 5, my: 1.5 }}
							onClick={handleOpenDialog}
							buttonText={t('participate')}
						/>
					)}

					<Dialog open={openDialog} onClose={handleCloseDialog}>
						<DialogContent>
							<Box sx={{ fontWeight: '600', fontSize: '1rem' }}>{t('AreYouSureParticipate')}</Box>
						</DialogContent>
						<DialogActions>
							<Box>
								<CustomCancelButton onClick={handleCloseDialog} />
								<CustomSuccessButton onClick={handleConfirm} buttonText={t('btnText.accept')} />
							</Box>
						</DialogActions>
					</Dialog>
					{!showRules && (
						<Box>
							<Fab variant="extended" sx={{ mt: 2, px: 2 }} onClick={handleRulesClick}>
								<Typography
									variant="button"
									fontWeight="600"
									fontSize="0.9rem"
									fontFamily="Shantell Sans"
								>
									{t('competitionRules')}
								</Typography>
								<DoubleArrow sx={{ ml: 1 }} color="info" />
							</Fab>
						</Box>
					)}
					{showRules && (
						<Box>
							<Fab variant="extended" sx={{ mt: 2, px: 2 }} onClick={handleRulesClick}>
								<Typography
									variant="button"
									fontWeight="600"
									fontSize="0.9rem"
									fontFamily="Shantell Sans"
								>
									{t('close')}
								</Typography>
								<Close sx={{ ml: 1, fontWeight: 600 }} color="error" />
							</Fab>
							<Rules />
						</Box>
					)}
				</>
			) : (
				<Typography sx={{ pb: 1, mx: 2, mt: 2 }}>{t('noSeasonsForRegistration')}</Typography>
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
