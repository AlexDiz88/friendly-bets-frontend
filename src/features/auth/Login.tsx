import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
	Box,
	IconButton,
	InputAdornment,
	Link,
	Snackbar,
	TextField,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { t } from 'i18next';
import { forwardRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import { getProfile, login, resetLoginFormError } from './authSlice';
import {
	authCardSx,
	authFieldSx,
	authLinksStackSx,
	authPageRootSx,
	authRegisterLinkSx,
	authSecondaryLinkSx,
	authSubmitButtonSx,
	authSubtitleSx,
	authTextFieldSx,
	authTitleSx,
} from './authPageStyles';
import { selectLoginFormError } from './selectors';

// eslint-disable-next-line react/display-name
const Alert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function Login(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
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
			void handleSubmit();
		}
	};

	return (
		<Box sx={authPageRootSx} component="section">
			<Box sx={authCardSx} component="form" onSubmit={handleSubmit}>
				<Box sx={authTitleSx}>{t('loginPage')}</Box>
				<Box sx={authSubtitleSx}>{t('loginPageSubtitle')}</Box>

				<Box sx={authFieldSx}>
					<TextField
						fullWidth
						required
						id="email"
						label="E-mail"
						variant="outlined"
						value={email}
						onChange={handleEmailChange}
						onKeyDown={handleKeyDown}
						autoComplete="email"
						sx={authTextFieldSx}
					/>
				</Box>
				<Box sx={authFieldSx}>
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
						autoComplete="current-password"
						sx={authTextFieldSx}
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

				<CustomButton
					onClick={() => void handleSubmit()}
					buttonText={t('login')}
					buttonColor="primary"
					textSize="1.05rem"
					sx={authSubmitButtonSx}
				/>

				<Box sx={authLinksStackSx}>
					<Link href="#/auth/forgot-password" sx={authSecondaryLinkSx} underline="hover">
						{t('forgotPassword')}
					</Link>
					<Link href="#/auth/register" sx={authRegisterLinkSx} underline="hover">
						{t('noAccount')}
					</Link>
				</Box>
			</Box>

			<Snackbar
				anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
				sx={{ justifyContent: 'center', mb: 3 }}
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
				sx={{ justifyContent: 'center', mb: 3 }}
				open={openErrorSnackbar}
				autoHideDuration={snackbarErrorDuration}
				onClose={handleSnackbarClose}
			>
				<Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '15rem' }}>
					{t('loginError')}
					{errorLoginForm && (
						<Box>{t(`error.${errorLoginForm}`, { defaultValue: errorLoginForm })}</Box>
					)}
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default Login;
