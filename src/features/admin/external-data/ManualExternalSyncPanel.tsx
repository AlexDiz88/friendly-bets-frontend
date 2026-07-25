import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import LeagueSelect from '../../../components/selectors/LeagueSelect';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { getActiveSeason } from '../seasons/seasonsSlice';
import { selectActiveSeason } from '../seasons/selectors';
import { syncExternalLive, syncExternalSchedule } from './externalDataAdminApi';

const SCHEDULE_LEAGUE_CODES = new Set(['EPL', 'BL', 'CL', 'LE', 'EC', 'WC']);

export default function ManualExternalSyncPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const [scheduleLeagueCode, setScheduleLeagueCode] = useState('EPL');
	const [liveLeagueCode, setLiveLeagueCode] = useState('EPL');
	const [syncingSchedule, setSyncingSchedule] = useState(false);
	const [syncingLive, setSyncingLive] = useState(false);

	useEffect(() => {
		if (!activeSeason) {
			void dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	const allLeagues = useMemo(() => activeSeason?.leagues ?? [], [activeSeason?.leagues]);
	const scheduleLeagues = useMemo(
		() => allLeagues.filter((l) => SCHEDULE_LEAGUE_CODES.has(l.leagueCode)),
		[allLeagues]
	);

	const effectiveScheduleLeague = useMemo(() => {
		if (scheduleLeagues.some((l) => l.leagueCode === scheduleLeagueCode)) {
			return scheduleLeagueCode;
		}
		return scheduleLeagues[0]?.leagueCode ?? '';
	}, [scheduleLeagues, scheduleLeagueCode]);

	const effectiveLiveLeague = useMemo(() => {
		if (allLeagues.some((l) => l.leagueCode === liveLeagueCode)) {
			return liveLeagueCode;
		}
		return allLeagues[0]?.leagueCode ?? '';
	}, [allLeagues, liveLeagueCode]);

	const handleScheduleSync = async (): Promise<void> => {
		if (!effectiveScheduleLeague) {
			return;
		}
		setSyncingSchedule(true);
		try {
			const result = await syncExternalSchedule(effectiveScheduleLeague);
			dispatch(
				showSuccessSnackbar({
					message: t('soccer365SyncScheduleSuccess', {
						upserted: result.upserted,
						skipped: result.skippedUnmapped,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalScheduleSyncFailed',
				})
			);
		} finally {
			setSyncingSchedule(false);
		}
	};

	const handleLiveSync = async (): Promise<void> => {
		if (!effectiveLiveLeague) {
			return;
		}
		setSyncingLive(true);
		try {
			const result = await syncExternalLive(effectiveLiveLeague);
			dispatch(
				showSuccessSnackbar({
					message: t('externalDataLiveSyncSuccess', {
						updated: result.updated,
						finished: result.finishedDetected,
					}),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalDataLiveSyncFailed',
				})
			);
		} finally {
			setSyncingLive(false);
		}
	};

	return (
		<AdminSection title={t('manualExternalSyncTitle')} hint={t('manualExternalSyncHint')}>
			<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
				{t('externalDataScheduleSyncTitle')}
			</Typography>
			{scheduleLeagues.length > 0 ? (
				<Box sx={{ mb: 1 }}>
					<LeagueSelect
						leagues={scheduleLeagues}
						value={effectiveScheduleLeague}
						onChange={(e) => setScheduleLeagueCode(String(e.target.value))}
						withoutAll
						compact
					/>
				</Box>
			) : null}
			<CustomSuccessButton
				onClick={() => void handleScheduleSync()}
				disabled={syncingSchedule || !effectiveScheduleLeague}
				loading={syncingSchedule}
				buttonText={t('soccer365SyncSchedule')}
				sx={{ width: '100%', mb: 2.5, mr: 0 }}
			/>

			<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
				{t('externalDataLiveSyncTitle')}
			</Typography>
			{allLeagues.length > 0 ? (
				<Box sx={{ mb: 1 }}>
					<LeagueSelect
						leagues={allLeagues}
						value={effectiveLiveLeague}
						onChange={(e) => setLiveLeagueCode(String(e.target.value))}
						withoutAll
						fullLeagueNames
					/>
				</Box>
			) : null}
			<CustomSuccessButton
				onClick={() => void handleLiveSync()}
				disabled={syncingLive || !effectiveLiveLeague}
				loading={syncingLive}
				buttonText={t('externalDataLiveSyncNow')}
				sx={{ width: '100%', mr: 0 }}
			/>
		</AdminSection>
	);
}
