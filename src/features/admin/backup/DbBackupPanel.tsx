import { Box } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { ADMIN_BUTTON_STACK_SX } from '../adminPanelStyles';
import { downloadDbBackupToPc, sendDbBackupToTelegram } from './dbBackupApi';

export default function DbBackupPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const [busy, setBusy] = useState<'telegram' | 'download' | null>(null);

	const handleTelegram = async (): Promise<void> => {
		setBusy('telegram');
		try {
			await sendDbBackupToTelegram();
			dispatch(showSuccessSnackbar({ message: t('dbBackupSentToTelegram') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'dbBackupTelegramSendFailed',
				})
			);
		} finally {
			setBusy(null);
		}
	};

	const handleDownload = async (): Promise<void> => {
		setBusy('download');
		try {
			await downloadDbBackupToPc();
			dispatch(showSuccessSnackbar({ message: t('dbBackupDownloaded') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'dbBackupFailed',
				})
			);
		} finally {
			setBusy(null);
		}
	};

	return (
		<AdminSection title={t('dbBackupTitle')} hint={t('dbBackupHint')}>
			<Box sx={ADMIN_BUTTON_STACK_SX}>
				<CustomSuccessButton
					onClick={() => void handleTelegram()}
					disabled={busy !== null}
					loading={busy === 'telegram'}
					buttonText={t('btnText.sendDbBackupTelegram')}
					sx={{ width: '100%', mr: 0 }}
				/>
				<CustomButton
					onClick={() => void handleDownload()}
					disabled={busy !== null}
					buttonText={
						busy === 'download' ? t('btnText.processing') : t('btnText.downloadDbBackup')
					}
					sx={{ width: '100%' }}
				/>
			</Box>
		</AdminSection>
	);
}
