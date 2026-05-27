import { Alert, Box } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import * as api from '../../features/auth/api';
import CustomButton from '../custom/btn/CustomButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';

export default function ProfileEmailVerification({
	email,
	emailIsConfirmed,
}: {
	email: string | undefined;
	emailIsConfirmed: boolean | undefined;
}): JSX.Element | null {
	const dispatch = useAppDispatch();
	const [sending, setSending] = useState(false);

	const handleResend = useCallback(async () => {
		if (!email?.trim()) {
			return;
		}
		setSending(true);
		try {
			await api.resendVerificationEmail(email.trim().toLowerCase());
			dispatch(showSuccessSnackbar({ message: t('verificationEmailSentIfApplicable') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'unknownError',
				})
			);
		} finally {
			setSending(false);
		}
	}, [dispatch, email]);

	if (emailIsConfirmed !== false) {
		return null;
	}

	return (
		<Box sx={{ width: '100%', maxWidth: 360, mt: 2, mb: 1 }}>
			<Alert severity="warning" sx={{ textAlign: 'left', mb: 1 }}>
				{t('emailNotConfirmedBanner')}
			</Alert>
			<Box sx={{ textAlign: 'center' }}>
				<CustomButton
					onClick={() => void handleResend()}
					buttonText={t('resendVerificationEmail')}
					disabled={sending || !email}
				/>
			</Box>
		</Box>
	);
}
