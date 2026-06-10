import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import { showErrorSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { getAllSeasons, getSeasonsWithoutDates } from './seasonDatesApi';
import SeasonDatesAssignInline from './SeasonDatesAssignInline';
import Season from './types/Season';
import { SeasonWithoutDates } from './types/Season';

export default function SeasonDateAssignment(): JSX.Element {
	const dispatch = useAppDispatch();
	const [seasonsWithoutDates, setSeasonsWithoutDates] = useState<SeasonWithoutDates[]>([]);
	const [allSeasons, setAllSeasons] = useState<Season[]>([]);
	const [showMissingList, setShowMissingList] = useState(false);
	const [showEditList, setShowEditList] = useState(false);
	const [loadingMissing, setLoadingMissing] = useState(false);
	const [loadingAll, setLoadingAll] = useState(false);

	const loadMissing = useCallback(async () => {
		setLoadingMissing(true);
		try {
			const page = await getSeasonsWithoutDates();
			setSeasonsWithoutDates(page.seasons);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('seasonDatesLoadError'),
				})
			);
		} finally {
			setLoadingMissing(false);
		}
	}, [dispatch]);

	const loadAll = useCallback(async () => {
		setLoadingAll(true);
		try {
			const page = await getAllSeasons();
			setAllSeasons(page.seasons);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('seasonDatesLoadError'),
				})
			);
		} finally {
			setLoadingAll(false);
		}
	}, [dispatch]);

	useEffect(() => {
		void loadMissing();
		void loadAll();
	}, [loadMissing, loadAll]);

	const missingCount = seasonsWithoutDates.length;
	const allCount = allSeasons.length;

	const handleMissingAssigned = (): void => {
		void loadMissing();
		void loadAll();
	};

	const handleEditAssigned = (): void => {
		void loadAll();
		void loadMissing();
	};

	return (
		<AdminSection title={t('seasonDateAssignment')} hint={t('seasonDateAssignmentHint')}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				<CustomButton
					sx={{ width: '100%' }}
					onClick={() => setShowMissingList(!showMissingList)}
					buttonColor={missingCount > 0 ? 'warning' : 'info'}
					buttonVariant="outlined"
					buttonText={
						showMissingList
							? t('hideSeasonsWithoutDates')
							: t('showSeasonsWithoutDates', { count: missingCount })
					}
				/>

				{showMissingList && (
					<Box>
						{loadingMissing && (
							<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
								{t('loading')}
							</Typography>
						)}
						{!loadingMissing && missingCount === 0 && (
							<Typography variant="body2" color="success.main" sx={{ textAlign: 'center', py: 1 }}>
								{t('allSeasonsHaveDates')}
							</Typography>
						)}
						{seasonsWithoutDates.map((s) => (
							<Box key={s.seasonId} sx={{ mb: 1 }}>
								<SeasonDatesAssignInline
									seasonId={s.seasonId}
									title={s.title}
									status={s.status}
									missingDates
									onAssigned={handleMissingAssigned}
								/>
							</Box>
						))}
					</Box>
				)}

				<CustomButton
					sx={{ width: '100%' }}
					onClick={() => setShowEditList(!showEditList)}
					buttonColor="info"
					buttonVariant="outlined"
					buttonText={
						showEditList
							? t('hideSeasonsForDateEdit')
							: t('showSeasonsForDateEdit', { count: allCount })
					}
				/>

				{showEditList && (
					<Box>
						{loadingAll && (
							<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
								{t('loading')}
							</Typography>
						)}
						{!loadingAll && allCount === 0 && (
							<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
								{t('noSeasonsYet')}
							</Typography>
						)}
						{allSeasons
							.slice()
							.reverse()
							.map((s) => (
								<Box key={`${s.id}-${s.startDate ?? ''}-${s.endDate ?? ''}`} sx={{ mb: 1 }}>
									<SeasonDatesAssignInline
										seasonId={s.id}
										title={s.title}
										status={s.status}
										initialStartDate={s.startDate ?? ''}
										initialEndDate={s.endDate ?? ''}
										missingDates={!s.startDate || !s.endDate}
										onAssigned={handleEditAssigned}
									/>
								</Box>
							))}
					</Box>
				)}
			</Box>
		</AdminSection>
	);
}
