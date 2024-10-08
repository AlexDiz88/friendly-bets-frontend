import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	Button,
	FormControl,
	IconButton,
	InputAdornment,
	Link,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { t } from 'i18next';
import { forwardRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getProfile, login, resetLoginFormError } from './authSlice';
import { selectError, selectLoginFormError } from './selectors';

// eslint-disable-next-line react/display-name
const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const error = useAppSelector(selectError);
	const errorLoginForm = useAppSelector(selectLoginFormError);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
	const snackbarDuration = 1000;
	const snackbarErrorDuration = 3000;

	const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string): void => {
		if (reason === 'clickaway') {
			return;
		}
		setOpenSuccessSnackbar(false);
		setOpenErrorSnackbar(false);
	};

	const handleTogglePasswordVisibility = (): void => {
		setShowPassword((prevShowPassword: boolean) => !prevShowPassword);
	};

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			const dispatchResult = await dispatch(
				login({
					email: email.toLowerCase(),
					password,
				})
			);

			if (login.fulfilled.match(dispatchResult)) {
				await dispatch(getProfile());
				setOpenSuccessSnackbar(true);
				setTimeout(() => {
					navigate('/');
				}, snackbarDuration);
			}
			if (login.rejected.match(dispatchResult)) {
				setOpenErrorSnackbar(true);
			}
		},
		[dispatch, email, navigate, password]
	);

	const handleEmailChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setEmail(event.target.value);
			dispatch(resetLoginFormError());
		},
		[dispatch]
	);

	const handlePasswordChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setPassword(event.target.value);
			dispatch(resetLoginFormError());
		},
		[dispatch]
	);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === 'Enter') {
			handleSubmit();
		}
	};

	return (
		<>
			<Box
				sx={{
					margin: '0 auto',
					textAlign: 'center',
					width: '14rem',
					display: 'flex',
					justifyContent: 'center',
				}}
			>
				<FormControl>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'center',
							fontSize: 30,
							fontWeight: 600,
							textAlign: 'center',
							mt: 3,
							mb: 2,
						}}
					>
						{t('loginPage')}
					</Box>
					<Box sx={{ my: 2 }}>
						<TextField
							fullWidth
							required
							id="email"
							label="E-mail"
							variant="outlined"
							value={email}
							onChange={handleEmailChange}
							onKeyDown={handleKeyDown}
						/>
					</Box>
					<Box sx={{ my: 2 }}>
						<TextField
							fullWidth
							required
							id="password"
							label={t('password')}
							variant="outlined"
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={handlePasswordChange}
							onKeyDown={handleKeyDown}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleTogglePasswordVisibility}
											edge="end"
											tabIndex={-1}
										>
											{showPassword ? <VisibilityOff /> : <Visibility />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Box>
					<Box sx={{ my: 2 }}>
						<Button
							onClick={handleSubmit}
							fullWidth
							sx={{ height: '3rem' }}
							variant="contained"
							type="submit"
							size="large"
						>
							<Typography
								variant="button"
								fontWeight="600"
								fontSize="1.2rem"
								fontFamily="Shantell Sans"
							>
								{t('login')}
							</Typography>
						</Button>
					</Box>

					<Snackbar
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
						sx={{
							justifyContent: 'center',
							mb: 3,
						}}
						open={openSuccessSnackbar}
						autoHideDuration={snackbarDuration}
						onClose={handleSnackbarClose}
					>
						<Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '15rem' }}>
							{t('loginSuccess')}
						</Alert>
					</Snackbar>
					<Snackbar
						anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
						sx={{
							justifyContent: 'center',
							mb: 3,
						}}
						open={openErrorSnackbar}
						autoHideDuration={snackbarErrorDuration}
						onClose={handleSnackbarClose}
					>
						<Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '15rem' }}>
							{t('loginError')}
							{errorLoginForm && <Box>{errorLoginForm}</Box>}
						</Alert>
					</Snackbar>
				</FormControl>
			</Box>
			<Box sx={{ mt: 3, fontSize: 16, textAlign: 'center' }}>
				<Link href="#/auth/register">{t('noAccount')}</Link>
			</Box>
			{/* {error && <CustomErrorMessage message={error} />} */}
		</>
	);
}

export default Login;
