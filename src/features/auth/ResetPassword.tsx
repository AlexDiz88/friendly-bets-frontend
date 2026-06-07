import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Alert,
	Box,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { t } from 'i18next';
import { forwardRef, useCallback, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import * as api from './api';

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
	<MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function ResetPassword(): JSX.Element {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token') ?? '';
	const [password, setPassword] = useState('');
	const [passwordRepeat, setPasswordRepeat] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [success, setSuccess] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();
	const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

	const handleSubmit = useCallback(async () => {
		if (password !== passwordRepeat) {
			setErrorMessage('enteredPasswordsNotEqual');
			setOpenErrorSnackbar(true);
			return;
		}
		setErrorMessage(undefined);
		try {
			await api.resetPassword({ token, password, passwordRepeat });
			setSuccess(true);
			setTimeout(() => navigate('/auth/login'), 2000);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : 'unknownError');
			setOpenErrorSnackbar(true);
		}
	}, [navigate, password, passwordRepeat, token]);

	if (!token.trim()) {
		return (
			<Box sx={{ maxWidth: 360, mx: 'auto', mt: 4, px: 2, textAlign: 'center' }}>
				<Alert severity="error">{t('verifyEmailError')}</Alert>
				<Box sx={{ mt: 3 }}>
					<Link to="/auth/login">{t('backToLogin')}</Link>
				</Box>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				margin: '0 auto',
				textAlign: 'center',
				width: '14rem',
				display: 'flex',
				justifyContent: 'center',
				mt: 3,
			}}
		>
			<FormControl>
				<Typography sx={{ fontSize: 30, fontWeight: 600, mb: 2 }}>{t('resetPasswordPage')}</Typography>
				{success ? (
					<Alert severity="success" sx={{ textAlign: 'left', mb: 2 }}>
						{t('resetPasswordSuccess')}
					</Alert>
				) : (
					<>
						<TextField
							fullWidth
							required
							type={showPassword ? 'text' : 'password'}
							label={t('newPassword')}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							sx={{ mb: 2 }}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton onClick={() => setShowPassword((v) => !v)} edge="end" tabIndex={-1}>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
						<TextField
							fullWidth
							required
							type={showPassword ? 'text' : 'password'}
							label={t('passwordRepeat')}
							value={passwordRepeat}
							onChange={(e) => setPasswordRepeat(e.target.value)}
							sx={{ mb: 2 }}
						/>
						<Button fullWidth variant="contained" onClick={() => void handleSubmit()} sx={{ height: '3rem' }}>
							<Typography fontFamily="Shantell Sans" fontWeight={600}>
								{t('resetPasswordSubmit')}
							</Typography>
						</Button>
					</>
				)}
				<Box sx={{ mt: 3, fontSize: 16 }}>
					<Link to="/auth/login">{t('backToLogin')}</Link>
				</Box>
			</FormControl>
			<Snackbar
				open={openErrorSnackbar}
				autoHideDuration={5000}
				onClose={() => setOpenErrorSnackbar(false)}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
			>
				<SnackbarAlert severity="error" onClose={() => setOpenErrorSnackbar(false)}>
					{errorMessage && t(`error.${errorMessage}`, { defaultValue: errorMessage })}
				</SnackbarAlert>
			</Snackbar>
		</Box>
	);
}

export default ResetPassword;
