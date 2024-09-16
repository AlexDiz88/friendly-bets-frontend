import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { editUsername } from '../../features/auth/authSlice';
import CustomButton from '../custom/btn/CustomButton';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';

const ProfileUsername = ({ username }: { username: string | undefined }): JSX.Element => {
	const dispatch = useAppDispatch();
	const [showNameInput, setShowNameInput] = useState(false);
	const [newName, setNewName] = useState(username || '');

	const handleSaveName = useCallback(async () => {
		const dispatchResult = await dispatch(editUsername({ newUsername: newName }));
		if (editUsername.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('usernameWasSuccessfullyUpdated') }));
			setShowNameInput(false);
		}
		if (editUsername.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [newName]);

	const handleEditName = (): void => {
		setShowNameInput(true);
	};

	const handleCancel = (): void => {
		if (username) {
			setNewName(username);
		}
		setShowNameInput(false);
	};

	return (
		<>
			<Typography sx={{ textAlign: 'center', pt: 1, mx: 2 }}>
				<b>{t('username')}:</b> {username}
			</Typography>
			{showNameInput ? (
				<Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
					<TextField
						size="small"
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						sx={{ mr: 1, mb: 1.5 }}
					/>

					<Box>
						<CustomCancelButton onClick={handleCancel} />
						<CustomSuccessButton onClick={handleSaveName} buttonText={t('btnText.change')} />
					</Box>
				</Box>
			) : (
				<Box sx={{ textAlign: 'left', mx: 2, mt: 1, mb: 2 }}>
					<CustomButton onClick={handleEditName} buttonText={t('changeUsername')} />
				</Box>
			)}
		</>
	);
};

export default ProfileUsername;
