/* eslint-disable react/display-name */
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
import { register, resetRegisterFormError } from './authSlice';
import {
	authCardSx,
	authFieldSx,
	authLinksStackSx,
	authPageRootSx,
	authRegisterLinkSx,
	authSubmitButtonSx,
	authSubtitleSx,
	authTextFieldSx,
	authTitleSx,
} from './authPageStyles';
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

	const clearRegisterError = useCallback(() => {
		dispatch(resetRegisterFormError());
	}, [dispatch]);

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();

			const dispatchResult = await dispatch(
				register({
					email: email.toLowerCase(),
					password,
					passwordRepeat,
				})
			);

			if (register.fulfilled.match(dispatchResult)) {
				setOpenSuccessSnackbar(true);
				setTimeout(() => {
					navigate('/auth/login');
				}, snackbarDuration);
			}
			if (register.rejected.match(dispatchResult)) {
				setOpenErrorSnackbar(true);
			}
		},
		[dispatch, email, navigate, password, passwordRepeat]
	);

	const handleEmailChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setEmail(event.target.value);
			clearRegisterError();
		},
		[clearRegisterError]
	);

	const handlePasswordChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setPassword(event.target.value);
			clearRegisterError();
		},
		[clearRegisterError]
	);

	const handlePasswordRepeatChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setPasswordRepeat(event.target.value);
			clearRegisterError();
		},
		[clearRegisterError]
	);

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key === 'Enter') {
			void handleSubmit();
		}
	};

	const passwordVisibilityAdornment = (
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
	);

	return (
		<Box sx={authPageRootSx} component="section">
			<Box sx={authCardSx} component="form" onSubmit={handleSubmit}>
				<Box sx={authTitleSx}>{t('signUpPage')}</Box>
				<Box sx={authSubtitleSx}>{t('signUpPageSubtitle')}</Box>

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
						autoComplete="new-password"
						sx={authTextFieldSx}
						InputProps={{
							endAdornment: passwordVisibilityAdornment,
						}}
					/>
				</Box>
				<Box sx={authFieldSx}>
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
						autoComplete="new-password"
						sx={authTextFieldSx}
						InputProps={{
							endAdornment: passwordVisibilityAdornment,
						}}
					/>
				</Box>

				<CustomButton
					onClick={() => void handleSubmit()}
					buttonText={t('btnText.signUp')}
					buttonColor="primary"
					textSize="1.05rem"
					sx={authSubmitButtonSx}
				/>

				<Box sx={authLinksStackSx}>
					<Link href="#/auth/login" sx={authRegisterLinkSx} underline="hover">
						{t('haveLogin')}
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
					{t('signUpCheckEmail')}
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
					{t('signUpError')}
					{error && (
						<Box>{t(`error.${error}`, { defaultValue: error })}</Box>
					)}
				</Alert>
			</Snackbar>
		</Box>
	);
}

export default Register;
