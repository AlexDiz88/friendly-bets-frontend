import { Alert, Box, CircularProgress, Link, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as api from './api';

type VerifyState = 'loading' | 'success' | 'error';

function VerifyEmail(): JSX.Element {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token') ?? '';
	const [state, setState] = useState<VerifyState>('loading');

	useEffect(() => {
		if (!token.trim()) {
			setState('error');
			return;
		}
		void (async () => {
			try {
				await api.confirmEmail(token);
				setState('success');
			} catch {
				setState('error');
			}
		})();
	}, [token]);

	return (
		<Box sx={{ maxWidth: 360, mx: 'auto', mt: 4, px: 2, textAlign: 'center' }}>
			<Typography sx={{ fontSize: 28, fontWeight: 600, mb: 2 }}>{t('verifyEmailPage')}</Typography>
			{state === 'loading' && (
				<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
					<CircularProgress size={32} />
					<Typography>{t('verifyEmailInProgress')}</Typography>
				</Box>
			)}
			{state === 'success' && (
				<Alert severity="success" sx={{ textAlign: 'left' }}>
					{t('verifyEmailSuccess')}
				</Alert>
			)}
			{state === 'error' && (
				<Alert severity="error" sx={{ textAlign: 'left' }}>
					{t('verifyEmailError')}
				</Alert>
			)}
			<Box sx={{ mt: 3, fontSize: 16 }}>
				<Link href="#/auth/login">{t('backToLogin')}</Link>
			</Box>
		</Box>
	);
}

export default VerifyEmail;
