import { Box, Chip, CircularProgress, Typography } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import LeagueSelect from '../../../components/selectors/LeagueSelect';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { getActiveSeason } from '../seasons/seasonsSlice';
import { selectActiveSeason } from '../seasons/selectors';
import { SOCCER365_PROVIDER } from '../teams/teamProviderConstants';
import {
	fetchSoccer365TeamNames,
	Soccer365TeamNameChip,
	syncSoccer365Schedule,
} from './soccer365AdminApi';

const SOCCER365_LEAGUE_CODES = new Set(['EPL', 'BL', 'CL', 'LE', 'EC', 'WC']);

export default function Soccer365TeamNamesPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const [, setSearchParams] = useSearchParams();
	const [leagueCode, setLeagueCode] = useState('EPL');
	const [loadingNames, setLoadingNames] = useState(false);
	const [syncing, setSyncing] = useState(false);
	const [chips, setChips] = useState<Soccer365TeamNameChip[]>([]);
	const [namesLoaded, setNamesLoaded] = useState(false);

	useEffect(() => {
		if (!activeSeason) {
			void dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	const leagues = useMemo(
		() => activeSeason?.leagues?.filter((l) => SOCCER365_LEAGUE_CODES.has(l.leagueCode)) ?? [],
		[activeSeason?.leagues]
	);

	const effectiveLeagueCode = useMemo(() => {
		if (leagues.some((l) => l.leagueCode === leagueCode)) {
			return leagueCode;
		}
		return leagues[0]?.leagueCode ?? '';
	}, [leagues, leagueCode]);

	const handleLoadNames = async (): Promise<void> => {
		if (!effectiveLeagueCode) {
			return;
		}
		setLoadingNames(true);
		try {
			const names = await fetchSoccer365TeamNames(effectiveLeagueCode);
			setChips(names.filter((c) => !c.alreadyMapped));
			setNamesLoaded(true);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'soccer365FetchFailed',
				})
			);
		} finally {
			setLoadingNames(false);
		}
	};

	const handleSyncSchedule = async (): Promise<void> => {
		if (!effectiveLeagueCode) {
			return;
		}
		setSyncing(true);
		try {
			const result = await syncSoccer365Schedule(effectiveLeagueCode);
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
					message: error instanceof Error ? error.message : 'soccer365FetchFailed',
				})
			);
		} finally {
			setSyncing(false);
		}
	};

	const openTeamPrefill = (externalName: string): void => {
		setSearchParams(
			(prev) => {
				const next = new URLSearchParams(prev);
				next.set('openTeamEdit', '1');
				next.set('provider', SOCCER365_PROVIDER);
				next.set('externalName', externalName);
				next.delete('externalId');
				next.delete('teamId');
				return next;
			},
			{ replace: false }
		);
		setChips((prev) => prev.filter((c) => c.externalName !== externalName));
	};

	return (
		<AdminSection title={t('soccer365TeamNamesTitle')} hint={t('soccer365TeamNamesHint')}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
				{leagues.length > 0 ? (
					<LeagueSelect
						value={effectiveLeagueCode}
						onChange={(e: SelectChangeEvent<string>) => setLeagueCode(e.target.value)}
						leagues={leagues}
						withoutAll
						compact
					/>
				) : null}
				<span>
					<CustomSuccessButton
						buttonText={
							loadingNames ? t('btnText.processing') : t('soccer365TeamNamesLoad')
						}
						onClick={() => void handleLoadNames()}
						disabled={loadingNames || !effectiveLeagueCode}
					/>
				</span>
				<span>
					<CustomSuccessButton
						buttonText={syncing ? t('btnText.processing') : t('soccer365SyncSchedule')}
						onClick={() => void handleSyncSchedule()}
						disabled={syncing || !effectiveLeagueCode}
					/>
				</span>
				{loadingNames ? (
					<CircularProgress size={24} />
				) : namesLoaded && chips.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						{t('soccer365TeamNamesEmpty')}
					</Typography>
				) : chips.length > 0 ? (
					<>
						<Typography variant="body2" color="text.secondary">
							{t('soccer365TeamNamesUnmappedHint')}
						</Typography>
						<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
							{chips.map((chip) => (
								<Chip
									key={chip.externalName}
									label={chip.externalName}
									onClick={() => openTeamPrefill(chip.externalName)}
									clickable
									size="small"
								/>
							))}
						</Box>
					</>
				) : null}
			</Box>
		</AdminSection>
	);
}
