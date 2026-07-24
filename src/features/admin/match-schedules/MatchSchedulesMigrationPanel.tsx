import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import {
	linkBetsToMatchSchedules,
	migrateGameResultsToMatchSchedules,
} from './matchSchedulesAdminApi';

export default function MatchSchedulesMigrationPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const [migrating, setMigrating] = useState(false);
	const [linking, setLinking] = useState(false);

	const handleMigrate = async (): Promise<void> => {
		setMigrating(true);
		try {
			const result = await migrateGameResultsToMatchSchedules();
			dispatch(
				showSuccessSnackbar({
					message: t('matchSchedulesMigrateSuccess', {
						upserted: result.matchesUpserted,
						errors: result.errors,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'matchSchedulesMigrateFailed',
				})
			);
		} finally {
			setMigrating(false);
		}
	};

	const handleLinkBets = async (): Promise<void> => {
		setLinking(true);
		try {
			const result = await linkBetsToMatchSchedules();
			dispatch(
				showSuccessSnackbar({
					message: t('matchSchedulesLinkBetsSuccess', {
						schedules: result.schedulesProcessed,
						betsLinked: result.betsLinked,
						errors: result.errors,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'matchSchedulesLinkBetsFailed',
				})
			);
		} finally {
			setLinking(false);
		}
	};

	const busy = migrating || linking;

	return (
		<AdminSection title={t('matchSchedulesMigrateTitle')} hint={t('matchSchedulesMigrateHint')}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				<Typography variant="body2" color="text.secondary">
					{t('matchSchedulesMigrateDescription')}
				</Typography>
				<span>
					<CustomSuccessButton
						buttonText={
							migrating ? t('btnText.processing') : t('matchSchedulesMigrateButton')
						}
						onClick={() => void handleMigrate()}
						disabled={busy}
						loading={migrating}
					/>
				</span>
				<Typography variant="body2" color="text.secondary">
					{t('matchSchedulesLinkBetsDescription')}
				</Typography>
				<span>
					<CustomSuccessButton
						buttonText={
							linking ? t('btnText.processing') : t('matchSchedulesLinkBetsButton')
						}
						onClick={() => void handleLinkBets()}
						disabled={busy}
						loading={linking}
					/>
				</span>
			</Box>
		</AdminSection>
	);
}
