import { Box, TextField } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { editUsername } from '../../features/auth/authSlice';
import CustomButton from '../custom/btn/CustomButton';
import ProfileEditActions from './ProfileEditActions';
import {
	profileAccountActionButtonSx,
	profileEditPanelSx,
	profileFullWidthFieldSx,
} from './profilePageStyles';
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
	}, [dispatch, newName]);

	const handleEditName = (): void => {
		setNewName(username || '');
		setShowNameInput(true);
	};

	const handleCancel = (): void => {
		setNewName(username || '');
		setShowNameInput(false);
	};

	return showNameInput ? (
		<Box sx={profileEditPanelSx}>
			<TextField
				size="small"
				fullWidth
				label={t('username')}
				value={newName}
				onChange={(e) => setNewName(e.target.value)}
				sx={profileFullWidthFieldSx}
			/>
			<ProfileEditActions
				onCancel={handleCancel}
				onSave={() => void handleSaveName()}
				saveText={t('btnText.change')}
			/>
		</Box>
	) : (
		<CustomButton
			onClick={handleEditName}
			buttonText={t('changeUsername')}
			sx={profileAccountActionButtonSx}
		/>
	);
};

export default ProfileUsername;
