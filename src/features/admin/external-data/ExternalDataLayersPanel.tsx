import {
	Box,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import LeagueSelect from '../../../components/selectors/LeagueSelect';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { getActiveSeason } from '../seasons/seasonsSlice';
import { selectActiveSeason } from '../seasons/selectors';
import {
	ExternalDataLayer,
	ExternalDataLayerConfig,
	LayerAssignment,
	fetchExternalDataLayerConfig,
	patchExternalDataLayerConfig,
	syncExternalLive,
} from './externalDataAdminApi';

const LAYERS: ExternalDataLayer[] = ['SCHEDULE', 'ODDS', 'LIVE', 'FULL_MATCH'];

const LAYER_LABEL_KEY: Record<ExternalDataLayer, string> = {
	SCHEDULE: 'externalDataLayerSchedule',
	ODDS: 'externalDataLayerOdds',
	LIVE: 'externalDataLayerLive',
	FULL_MATCH: 'externalDataLayerFullMatch',
};

const NONE = '';

export default function ExternalDataLayersPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [syncingLive, setSyncingLive] = useState(false);
	const [config, setConfig] = useState<ExternalDataLayerConfig | null>(null);
	const [draft, setDraft] = useState<Partial<Record<ExternalDataLayer, LayerAssignment>>>({});
	const [liveLeagueCode, setLiveLeagueCode] = useState('EPL');

	useEffect(() => {
		if (!activeSeason) {
			void dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const next = await fetchExternalDataLayerConfig();
			setConfig(next);
			setDraft(next.layers ?? {});
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalDataLayersLoadFailed',
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		void load();
	}, [load]);

	const leagues = useMemo(() => activeSeason?.leagues ?? [], [activeSeason?.leagues]);

	const effectiveLiveLeague = useMemo(() => {
		if (leagues.some((l) => l.leagueCode === liveLeagueCode)) {
			return liveLeagueCode;
		}
		return leagues[0]?.leagueCode ?? '';
	}, [leagues, liveLeagueCode]);

	const optionsFor = (layer: ExternalDataLayer): string[] => {
		const fromCaps = config?.capabilities?.[layer] ?? [];
		return fromCaps;
	};

	const handlePrimary = (layer: ExternalDataLayer, value: string): void => {
		setDraft((prev) => ({
			...prev,
			[layer]: {
				...(prev[layer] ?? {}),
				primaryProvider: value || null,
			},
		}));
	};

	const handleSecondary = (layer: ExternalDataLayer, value: string): void => {
		setDraft((prev) => ({
			...prev,
			[layer]: {
				...(prev[layer] ?? {}),
				secondaryProvider: value || null,
			},
		}));
	};

	const handleSave = async (): Promise<void> => {
		setSaving(true);
		try {
			const next = await patchExternalDataLayerConfig({ layers: draft });
			setConfig(next);
			setDraft(next.layers ?? {});
			dispatch(showSuccessSnackbar({ message: t('externalDataLayersSaved') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'externalDataLayersSaveFailed',
				})
			);
		} finally {
			setSaving(false);
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
		<AdminSection title={t('externalDataLayersTitle')} hint={t('externalDataLayersHint')}>
			{loading || !config ? (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
					<CircularProgress size={28} />
				</Box>
			) : (
				<>
					{LAYERS.map((layer) => {
						const options = optionsFor(layer);
						const assignment = draft[layer] ?? {};
						const primary = assignment.primaryProvider ?? NONE;
						const secondary = assignment.secondaryProvider ?? NONE;
						const safePrimary = options.includes(primary) ? primary : NONE;
						const safeSecondary = options.includes(secondary) ? secondary : NONE;
						return (
							<Box key={layer} sx={{ mb: 2 }}>
								<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
									{t(LAYER_LABEL_KEY[layer])}
								</Typography>
								<FormControl fullWidth size="small" sx={{ mb: 1 }}>
									<InputLabel id={`${layer}-primary`}>{t('externalDataPrimary')}</InputLabel>
									<Select
										labelId={`${layer}-primary`}
										label={t('externalDataPrimary')}
										value={safePrimary}
										onChange={(e: SelectChangeEvent) => handlePrimary(layer, e.target.value)}
									>
										<MenuItem value={NONE}>{t('externalDataProviderNone')}</MenuItem>
										{options.map((id) => (
											<MenuItem key={id} value={id}>
												{id}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl fullWidth size="small">
									<InputLabel id={`${layer}-secondary`}>{t('externalDataSecondary')}</InputLabel>
									<Select
										labelId={`${layer}-secondary`}
										label={t('externalDataSecondary')}
										value={safeSecondary}
										onChange={(e: SelectChangeEvent) => handleSecondary(layer, e.target.value)}
									>
										<MenuItem value={NONE}>{t('externalDataProviderNone')}</MenuItem>
										{options.map((id) => (
											<MenuItem key={id} value={id}>
												{id}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</Box>
						);
					})}
					<CustomSuccessButton
						onClick={() => void handleSave()}
						disabled={saving}
						loading={saving}
						buttonText={t('btnText.save')}
						sx={{ width: '100%', mb: 2, mr: 0 }}
					/>

					<Typography sx={{ fontWeight: 600, mb: 1, fontSize: '0.9rem' }}>
						{t('externalDataLiveSyncTitle')}
					</Typography>
					{leagues.length > 0 ? (
						<Box sx={{ mb: 1 }}>
							<LeagueSelect
								leagues={leagues}
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
				</>
			)}
		</AdminSection>
	);
}
