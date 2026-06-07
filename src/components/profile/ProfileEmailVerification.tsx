import { Alert, Box } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import * as api from '../../features/auth/api';
import CustomButton from '../custom/btn/CustomButton';
import { profileVerificationBannerSx } from './profilePageStyles';
import { showErrorSnackbar, showSuccessSnackbar } from '../custom/snackbar/snackbarSlice';

/** Временно: повторная отправка письма до настройки почты на бэкенде. */
const SHOW_RESEND_VERIFICATION_EMAIL = false;

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
		<Box sx={profileVerificationBannerSx}>
			<Alert severity="warning" sx={{ textAlign: 'left', mb: SHOW_RESEND_VERIFICATION_EMAIL ? 1 : 0 }}>
				{t('emailNotConfirmedBanner')}
			</Alert>
			{SHOW_RESEND_VERIFICATION_EMAIL && (
				<Box sx={{ textAlign: 'left' }}>
					<CustomButton
						onClick={() => void handleResend()}
						buttonText={t('resendVerificationEmail')}
						disabled={sending || !email}
						sx={{ width: { xs: '100%', sm: 'auto' } }}
					/>
				</Box>
			)}
		</Box>
	);
}
