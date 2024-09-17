import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { editEmail } from '../../features/auth/authSlice';
import CustomButton from '../custom/btn/CustomButton';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';

const ProfileEmail = ({ email }: { email: string | undefined }): JSX.Element => {
	const dispatch = useAppDispatch();
	const [showEmailInput, setShowEmailInput] = useState(false);
	const [newEmail, setNewEmail] = useState(email || '');

	const handleSaveEmail = useCallback(async () => {
		const dispatchResult = await dispatch(editEmail({ newEmail }));
		if (editEmail.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('emailWasSuccessfullyUpdated') }));
			setShowEmailInput(false);
		}
		if (editEmail.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, newEmail]);

	const handleEditEmail = (): void => {
		setShowEmailInput(true);
	};

	const handleCancelEmail = (): void => {
		if (email) {
			setNewEmail(email);
		}
		setShowEmailInput(false);
	};

	return (
		<>
			<Typography sx={{ textAlign: 'center', pt: 1, mx: 2 }}>
				<b>Email:</b> {email}
			</Typography>
			{showEmailInput ? (
				<Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
					<TextField
						size="small"
						value={newEmail}
						onChange={(e) => setNewEmail(e.target.value)}
						sx={{ mr: 1, mb: 1.5 }}
					/>
					<Box>
						<CustomCancelButton onClick={handleCancelEmail} />
						<CustomSuccessButton onClick={handleSaveEmail} buttonText={t('btnText.change')} />
					</Box>
				</Box>
			) : (
				<Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
					<CustomButton onClick={handleEditEmail} buttonText={t('changeEmail')} />
				</Box>
			)}
		</>
	);
};

export default ProfileEmail;
