import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { editEmail } from '../../features/auth/authSlice';
import CustomButton from '../custom/btn/CustomButton';
import ProfileEditActions from './ProfileEditActions';
import {
	profileAccountActionButtonSx,
	profileEditPanelSx,
	profileFullWidthFieldSx,
} from './profilePageStyles';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';

const ProfileEmail = ({ email }: { email: string | undefined }): JSX.Element => {
	const dispatch = useAppDispatch();
	const [showEmailInput, setShowEmailInput] = useState(false);
	const [newEmail, setNewEmail] = useState(email || '');

	const handleSaveEmail = useCallback(async () => {
		const dispatchResult = await dispatch(editEmail({ newEmail }));
		if (editEmail.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('emailChangeVerificationSent') }));
			setShowEmailInput(false);
		}
		if (editEmail.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, newEmail]);

	const handleEditEmail = (): void => {
		setNewEmail(email || '');
		setShowEmailInput(true);
	};

	const handleCancelEmail = (): void => {
		setNewEmail(email || '');
		setShowEmailInput(false);
	};

	return showEmailInput ? (
		<Box sx={profileEditPanelSx}>
			<TextField
				size="small"
				fullWidth
				label="Email"
				value={newEmail}
				onChange={(e) => setNewEmail(e.target.value)}
				sx={profileFullWidthFieldSx}
			/>
			<ProfileEditActions
				onCancel={handleCancelEmail}
				onSave={() => void handleSaveEmail()}
				saveText={t('btnText.change')}
			/>
		</Box>
	) : (
		<CustomButton
			onClick={handleEditEmail}
			buttonText={t('changeEmail')}
			sx={profileAccountActionButtonSx}
		/>
	);
};

export default ProfileEmail;
