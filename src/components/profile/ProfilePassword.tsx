import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { editPassword } from '../../features/auth/authSlice';
import CustomButton from '../custom/btn/CustomButton';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';

const ProfilePassword = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
	const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);

	const handleSavePassword = useCallback(async () => {
		const dispatchResult = await dispatch(
			editPassword({ currentPassword, newPassword, newPasswordRepeat })
		);
		if (editPassword.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('passwordWasSuccessfullyUpdated') }));
			setCurrentPassword('');
			setNewPassword('');
			setNewPasswordRepeat('');
			setShowPasswordInput(false);
		}
		if (editPassword.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, currentPassword, newPassword, newPasswordRepeat]);

	const handleToggleCurrentPasswordVisibility = (): void => {
		setShowCurrentPassword((prevShowPassword: boolean) => !prevShowPassword);
	};

	const handleToggleNewPasswordVisibility = (): void => {
		setShowNewPassword((prevShowPassword: boolean) => !prevShowPassword);
	};

	const handleEditPassword = (): void => {
		setShowPasswordInput(true);
	};

	const handleCancelPassword = (): void => {
		setCurrentPassword('');
		setNewPassword('');
		setNewPasswordRepeat('');
		setShowPasswordInput(false);
	};

	return (
		<>
			{showPasswordInput ? (
				<Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
					<TextField
						size="small"
						fullWidth
						required
						id="current-password"
						label={t('currentPassword')}
						type={showCurrentPassword ? 'text' : 'password'}
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						sx={{ mr: 1, mb: 1.5 }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleToggleCurrentPasswordVisibility}
										edge="end"
										tabIndex={-1}
									>
										{showCurrentPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<TextField
						size="small"
						fullWidth
						required
						id="new-password"
						label={t('newPassword')}
						type={showNewPassword ? 'text' : 'password'}
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						sx={{ mr: 1, mb: 1.5 }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleToggleNewPasswordVisibility}
										edge="end"
										tabIndex={-1}
									>
										{showNewPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<TextField
						size="small"
						fullWidth
						required
						id="new-password-repeat"
						label={t('newPasswordRepeat')}
						type={showNewPassword ? 'text' : 'password'}
						value={newPasswordRepeat}
						onChange={(e) => setNewPasswordRepeat(e.target.value)}
						sx={{ mr: 1, mb: 1.5 }}
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={handleToggleNewPasswordVisibility}
										edge="end"
										tabIndex={-1}
									>
										{showNewPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							),
						}}
					/>
					<Box>
						<CustomCancelButton onClick={handleCancelPassword} />
						<CustomSuccessButton onClick={handleSavePassword} buttonText={t('btnText.change')} />
					</Box>
				</Box>
			) : (
				<Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
					<CustomButton onClick={handleEditPassword} buttonText={t('changePassword')} />
				</Box>
			)}
		</>
	);
};

export default ProfilePassword;
