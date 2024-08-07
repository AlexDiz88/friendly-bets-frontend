import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Avatar,
	Box,
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { editEmail, editPassword, editUsername, getProfile } from '../../features/auth/authSlice';
import { selectUser } from '../../features/auth/selectors';
import User from '../../features/auth/types/User';
import CustomButton from '../custom/btn/CustomButton';
import CustomCancelButton from '../custom/btn/CustomCancelButton';
import CustomSuccessButton from '../custom/btn/CustomSuccessButton';
import UploadForm from '../UploadForm';
import NotificationSnackbar from '../utils/NotificationSnackbar';
import pathToAvatarImage from '../utils/pathToAvatarImage';

export default function Profile(): JSX.Element {
	const user: User | undefined = useAppSelector(selectUser);
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const [showEmailInput, setShowEmailInput] = useState(false);
	const [showPasswordInput, setShowPasswordInput] = useState(false);
	const [showNameInput, setShowNameInput] = useState(false);
	const [showMessage, setShowMessage] = useState(false);
	const [newEmail, setNewEmail] = useState(user?.email || '');
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
	const [newName, setNewName] = useState(user?.username || '');
	const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
	const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
	const [showUploadForm, setShowUploadForm] = useState(false);
	const [openSnackbar, setOpenSnackbar] = useState(false);
	const [snackbarSeverity, setSnackbarSeverity] = useState<
		'success' | 'error' | 'warning' | 'info'
	>('info');
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarDuration, setSnackbarDuration] = useState(2000);

	const handleToggleCurrentPasswordVisibility = (): void => {
		setShowCurrentPassword((prevShowPassword: boolean) => !prevShowPassword);
	};

	const handleToggleNewPasswordVisibility = (): void => {
		setShowNewPassword((prevShowPassword: boolean) => !prevShowPassword);
	};

	const handleEditEmail = (): void => {
		setShowEmailInput(true);
	};

	const handleEditPassword = (): void => {
		setShowPasswordInput(true);
	};

	const handleEditName = (): void => {
		setShowNameInput(true);
	};

	const handleCancelEmail = (): void => {
		if (user?.email) {
			setNewEmail(user.email);
		}
		setShowEmailInput(false);
	};

	const handleCancelPassword = (): void => {
		setCurrentPassword('');
		setNewPassword('');
		setNewPasswordRepeat('');
		setShowPasswordInput(false);
	};

	const handleCancelName = (): void => {
		if (user?.username) {
			setNewName(user?.username);
		}
		setShowNameInput(false);
	};

	// сохраняем email
	const handleSaveEmail = useCallback(async () => {
		const dispatchResult = await dispatch(editEmail({ newEmail }));
		if (editEmail.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('emailWasSuccessfullyUpdated'));
			setShowEmailInput(false);
		}
		if (editEmail.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			setSnackbarDuration(3000);
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, newEmail]);

	// сохраняем пароль
	const handleSavePassword = useCallback(async () => {
		const dispatchResult = await dispatch(
			editPassword({ currentPassword, newPassword, newPasswordRepeat })
		);
		if (editPassword.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('passwordWasSuccessfullyUpdated'));
			setCurrentPassword('');
			setNewPassword('');
			setNewPasswordRepeat('');
			setShowPasswordInput(false);
		}
		if (editPassword.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			setSnackbarDuration(3000);
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, currentPassword, newPassword, newPasswordRepeat]);

	// сохраняем имя
	const handleSaveName = useCallback(async () => {
		const dispatchResult = await dispatch(editUsername({ newUsername: newName }));
		if (editUsername.fulfilled.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('success');
			setSnackbarMessage(t('usernameWasSuccessfullyUpdated'));
			setShowNameInput(false);
		}
		if (editUsername.rejected.match(dispatchResult)) {
			setOpenSnackbar(true);
			setSnackbarSeverity('error');
			setSnackbarDuration(6000);
			if (dispatchResult.error.message) {
				setSnackbarMessage(dispatchResult.error.message);
			}
		}
	}, [dispatch, newName]);

	const handleCloseSnackbar = (): void => {
		setOpenSnackbar(false);
	};

	useEffect(() => {
		dispatch(getProfile());
	}, [dispatch, openSnackbar]);

	// редирект неаутентифицированных пользователей
	useEffect(() => {
		const timer = setTimeout(() => {
			if (!user) {
				navigate('/auth/login');
			}
		}, 3000);
		return () => clearTimeout(timer);
	}, [navigate, user]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMessage(true);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	if (!user) {
		return (
			<Box
				sx={{
					p: 5,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '70vh',
				}}
			>
				{showMessage && (
					<Box sx={{ textAlign: 'center', my: 3, fontWeight: 600, color: 'brown' }}>
						Проверка авторизации на доступ к личному кабинету
					</Box>
				)}
				<CircularProgress size={100} color="primary" />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				mx: 2,
				mt: 2,
				mb: 4,
			}}
		>
			<Typography sx={{ borderBottom: 2, pb: 1, mx: 2, px: 7 }}>{t('personalAccount')}</Typography>
			<Box sx={{ p: 2 }}>
				<Avatar
					sx={{ mr: 1, height: '7rem', width: '7rem', border: 1 }}
					alt="user_avatar"
					src={pathToAvatarImage(user.avatar)}
				/>
			</Box>
			{/* TODO: загрузка фото */}
			{showUploadForm && (
				<CustomButton onClick={() => setShowUploadForm(true)} buttonText={t('changePhoto')} />
			)}
			{showUploadForm && <UploadForm onClose={() => setShowUploadForm(false)} />}

			<Typography sx={{ textAlign: 'center', pt: 1, mx: 2 }}>
				<b>Email:</b> {user?.email}
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

			<Typography sx={{ textAlign: 'center', pt: 1, mx: 2 }}>
				<b>{t('username')}:</b> {user?.username}
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
						<CustomCancelButton onClick={handleCancelName} />
						<CustomSuccessButton onClick={handleSaveName} buttonText={t('btnText.change')} />
					</Box>
				</Box>
			) : (
				<Box sx={{ textAlign: 'left', mx: 2, mt: 1, mb: 2 }}>
					<CustomButton onClick={handleEditName} buttonText={t('changeUsername')} />
				</Box>
			)}
			<Box sx={{ mt: 3 }}>
				<Typography sx={{ pb: 1, px: 7, mx: 2, borderBottom: 2 }}>{t('actualSeason')}:</Typography>
				<Typography sx={{ mt: 1, mx: 2, fontWeight: 600, color: 'brown' }}>
					{t('contentInProgress')}
				</Typography>
			</Box>
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
