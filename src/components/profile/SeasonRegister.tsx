import { SportsSoccer } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
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
import CustomButton from '../custom/btn/CustomButton';
import CustomCalendarDialog from '../custom/dialog/CustomCalendarDialog';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';
import Rules from '../Rules';
import {
	profileAccountActionButtonSx,
	profileItemCardSx,
	profileItemLabelSx,
	profileItemValueRowSx,
	profileItemValueSx,
	profilePageRootSx,
	profilePageTitleSx,
	profilePlayerRowSx,
	profilePlayersListSx,
	profileRegisteredBannerSx,
	profileRegisteredBannerTextSx,
	profileSectionGroupSx,
} from './profilePageStyles';

export default function SeasonRegister(): JSX.Element {
	const scheduledSeason = useAppSelector(selectScheduledSeason);
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectUser);
	const [showRules, setShowRules] = useState(false);
	const [openDialog, setOpenDialog] = useState(false);

	const handleConfirm = useCallback(async () => {
		if (scheduledSeason?.id) {
			const dispatchResult = await dispatch(registrationInSeason({ seasonId: scheduledSeason.id }));

			if (registrationInSeason.fulfilled.match(dispatchResult)) {
				dispatch(showSuccessSnackbar({ message: t('youWereSuccessfullyRegisteredInTournament') }));
				dispatch(getProfile());
			}
			if (registrationInSeason.rejected.match(dispatchResult)) {
				dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
			}
			setOpenDialog(false);
		}
	}, [dispatch, scheduledSeason?.id]);

	const handleOpenDialog = (): void => {
		setOpenDialog(true);
	};

	const handleCloseDialog = (): void => {
		setOpenDialog(false);
	};

	const handleRulesClick = (): void => {
		setShowRules((prev) => !prev);
	};

	useEffect(() => {
		dispatch(getProfile());
		dispatch(getScheduledSeason());
	}, [dispatch, openDialog]);

	const isRegistered =
		currentUser &&
		scheduledSeason?.players.some((player) => player.id === currentUser.id);

	return (
		<Box sx={profilePageRootSx}>
			<Typography sx={profilePageTitleSx}>{t('registerOnTournament')}</Typography>

			{scheduledSeason?.title ? (
				<Box sx={profileSectionGroupSx}>
					<Box sx={profileItemCardSx}>
						<Box sx={profileItemValueRowSx}>
							<SportsSoccer sx={{ fontSize: '1.25rem', color: 'primary.main', flexShrink: 0 }} />
							<Box sx={{ minWidth: 0 }}>
								<Typography sx={profileItemLabelSx}>{t('season')}</Typography>
								<Typography sx={profileItemValueSx}>{scheduledSeason.title}</Typography>
							</Box>
						</Box>

						<Box sx={{ mt: 1.5 }}>
							<Typography sx={profileItemLabelSx}>{t('listOfPlayers')}</Typography>
							<Box sx={profilePlayersListSx}>
								{scheduledSeason.players.map((p) => (
									<Typography key={p.id} sx={profilePlayerRowSx}>
										{p.username}
									</Typography>
								))}
							</Box>
						</Box>

						{isRegistered ? (
							<Box sx={profileRegisteredBannerSx}>
								<Typography sx={profileRegisteredBannerTextSx}>
									{t('congratulations')}
									<br />
									{t('youAreRegistered')}
								</Typography>
							</Box>
						) : (
							<CustomButton
								onClick={handleOpenDialog}
								buttonText={t('participate')}
								buttonColor="primary"
								textSize="1.05rem"
								sx={{ ...profileAccountActionButtonSx, mt: 1.5, height: '2.75rem' }}
							/>
						)}
					</Box>

					<CustomCalendarDialog
						open={openDialog}
						onClose={handleCloseDialog}
						onSave={() => void handleConfirm()}
						title={t('AreYouSureParticipate')}
						buttonAcceptText={t('btnText.accept')}
					/>

					<CustomButton
						onClick={handleRulesClick}
						buttonText={showRules ? t('close') : t('competitionRules')}
						buttonVariant="outlined"
						buttonColor="secondary"
						sx={profileAccountActionButtonSx}
					/>

					{showRules && (
						<Box sx={profileItemCardSx}>
							<Rules />
						</Box>
					)}
				</Box>
			) : (
				<Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '0.9375rem', textAlign: 'left' }}>
					{t('noSeasonsForRegistration')}
				</Typography>
			)}
		</Box>
	);
}
