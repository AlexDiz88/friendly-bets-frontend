import {
	Alert,
	Box,
	Button,
	FormControl,
	Snackbar,
	TextField,
	Typography,
} from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { t } from 'i18next';
import { forwardRef, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import * as api from './api';

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
	<MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function ForgotPassword(): JSX.Element {
	const [email, setEmail] = useState('');
	const [submitted, setSubmitted] = useState(false);
	const [errorMessage, setErrorMessage] = useState<string | undefined>();
	const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

	const handleSubmit = useCallback(async () => {
		setErrorMessage(undefined);
		try {
			await api.forgotPassword(email.trim().toLowerCase());
			setSubmitted(true);
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : 'unknownError');
			setOpenErrorSnackbar(true);
		}
	}, [email]);

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
				<Typography sx={{ fontSize: 30, fontWeight: 600, mb: 2 }}>{t('forgotPasswordPage')}</Typography>
				<Typography sx={{ fontSize: 14, mb: 2, textAlign: 'left' }}>{t('forgotPasswordHint')}</Typography>
				{submitted ? (
					<Alert severity="success" sx={{ textAlign: 'left', mb: 2 }}>
						{t('forgotPasswordSuccess')}
					</Alert>
				) : (
					<>
						<TextField
							fullWidth
							required
							label="E-mail"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							sx={{ mb: 2 }}
						/>
						<Button fullWidth variant="contained" onClick={() => void handleSubmit()} sx={{ height: '3rem' }}>
							<Typography fontFamily="Shantell Sans" fontWeight={600}>
								{t('forgotPasswordSubmit')}
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

export default ForgotPassword;
