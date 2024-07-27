/* eslint-disable react/display-name */
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
import { login, register } from './authSlice';
import { selectRegisterFormError } from './selectors';

const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
	<MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function Register(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const error = useAppSelector(selectRegisterFormError);
	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [passwordRepeat, setPasswordRepeat] = useState<string>('');
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [openSuccessSnackbar, setOpenSuccessSnackbar] = useState(false);
	const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
	const snackbarDuration = 1500;
	const snackbarErrorDuration = 5000;

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
				register({
					email,
					password,
					passwordRepeat,
				})
			);

			if (register.fulfilled.match(dispatchResult)) {
				setOpenSuccessSnackbar(true);
				await dispatch(login({ email, password }));
				setTimeout(() => {
					navigate('/my/profile');
				}, snackbarDuration);
			}
			if (register.rejected.match(dispatchResult)) {
				setOpenErrorSnackbar(true);
			}
		},
		[dispatch, email, navigate, password, passwordRepeat]
	);

	const handleNameChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value);
	}, []);

	const handlePasswordChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value);
	}, []);

	const handlePasswordRepeatChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setPasswordRepeat(event.target.value);
	}, []);

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
						{t('signUpPage')}
					</Box>
					<Box sx={{ my: 2 }}>
						<TextField
							fullWidth
							required
							id="email"
							label="E-mail"
							variant="outlined"
							value={email}
							onChange={handleNameChange}
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
						<TextField
							fullWidth
							required
							id="password-repeat"
							label={t('passwordRepeat')}
							variant="outlined"
							type={showPassword ? 'text' : 'password'}
							value={passwordRepeat}
							onChange={handlePasswordRepeatChange}
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
								fontSize="1.1rem"
								fontFamily="Shantell Sans"
							>
								{t('btnText.signUp')}
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
							{t('signUpSuccess')}
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
							{error && (
								<Box>
									{t('signUpError')} {error}
								</Box>
							)}
						</Alert>
					</Snackbar>
				</FormControl>
			</Box>
			<Box sx={{ fontSize: 16, mt: 3, textAlign: 'center' }}>
				<Link href="#/auth/login">{t('haveLogin')}</Link>
			</Box>
		</>
	);
}

export default Register;
