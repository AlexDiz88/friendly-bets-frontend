import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import { showErrorSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { getSeasonsWithoutDates } from './seasonDatesApi';
import SeasonDatesAssignInline from './SeasonDatesAssignInline';
import { SeasonWithoutDates } from './types/Season';

export default function SeasonDateAssignment(): JSX.Element {
	const dispatch = useAppDispatch();
	const [seasons, setSeasons] = useState<SeasonWithoutDates[]>([]);
	const [showList, setShowList] = useState(false);
	const [loading, setLoading] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const page = await getSeasonsWithoutDates();
			setSeasons(page.seasons);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('seasonDatesLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		load();
	}, [load]);

	const missingCount = seasons.length;

	return (
		<AdminSection title={t('seasonDateAssignment')} hint={t('seasonDateAssignmentHint')}>
			<CustomButton
				sx={{ width: '100%', mb: showList ? 1.5 : 0 }}
				onClick={() => setShowList(!showList)}
				buttonColor={missingCount > 0 ? 'warning' : 'info'}
				buttonVariant="outlined"
				buttonText={
					showList
						? t('hideSeasonsWithoutDates')
						: t('showSeasonsWithoutDates', { count: missingCount })
				}
			/>

			{showList && (
				<Box>
					{loading && (
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
							{t('loading')}
						</Typography>
					)}
					{!loading && missingCount === 0 && (
						<Typography variant="body2" color="success.main" sx={{ textAlign: 'center', py: 1 }}>
							{t('allSeasonsHaveDates')}
						</Typography>
					)}
					{seasons.map((s) => (
						<Box key={s.seasonId} sx={{ mb: 1 }}>
							<SeasonDatesAssignInline season={s} onAssigned={load} />
						</Box>
					))}
				</Box>
			)}
		</AdminSection>
	);
}
