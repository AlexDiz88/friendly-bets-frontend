import {
	Box,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import type { SelectChangeEvent, SxProps, Theme } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import CustomSwitch from '../../../components/custom/controls/CustomSwitch';
import { toggleInlineRowSx } from '../../../components/custom/controls/customToggleStyles';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import { LAYER_ACCENT } from '../../api-sandbox/apiSandboxPageStyles';
import AdminSection from '../AdminSection';
import {
	ExternalDataLayer,
	ExternalDataLayerConfig,
	LayerAssignment,
	fetchExternalDataLayerConfig,
	patchExternalDataLayerConfig,
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
	const [showPanel, setShowPanel] = useState(false);
	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);
	const [config, setConfig] = useState<ExternalDataLayerConfig | null>(null);
	const [draft, setDraft] = useState<Partial<Record<ExternalDataLayer, LayerAssignment>>>({});

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
		if (showPanel && !config) {
			void load();
		}
	}, [showPanel, config, load]);

	const optionsFor = (layer: ExternalDataLayer): string[] => {
		const fromCaps = config?.capabilities?.[layer] ?? [];
		return fromCaps;
	};

	const handleEnabled = (layer: ExternalDataLayer, enabled: boolean): void => {
		setDraft((prev) => ({
			...prev,
			[layer]: {
				...(prev[layer] ?? {}),
				enabled,
			},
		}));
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

	return (
		<AdminSection
			title={t('externalDataLayersTitle')}
			hint={showPanel ? t('externalDataLayersHint') : undefined}
		>
			<CustomButton
				sx={{ width: '100%', mb: showPanel ? 1.5 : 0 }}
				onClick={() => setShowPanel(!showPanel)}
				buttonColor="info"
				buttonVariant="outlined"
				buttonText={
					showPanel ? t('hideExternalDataLayers') : t('showExternalDataLayers')
				}
			/>

			{showPanel &&
				(loading || !config ? (
					<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
						<CircularProgress size={28} />
					</Box>
				) : (
					<>
						{LAYERS.map((layer) => {
							const options = optionsFor(layer);
							const assignment = draft[layer] ?? {};
							const enabled = assignment.enabled !== false;
							const primary = assignment.primaryProvider ?? NONE;
							const secondary = assignment.secondaryProvider ?? NONE;
							const safePrimary = options.includes(primary) ? primary : NONE;
							const safeSecondary = options.includes(secondary) ? secondary : NONE;
							return (
								<Box key={layer} sx={{ mb: 2 }}>
									<Typography
										sx={{
											fontWeight: 700,
											mb: 0.5,
											fontSize: '0.9rem',
											color: LAYER_ACCENT[layer],
										}}
									>
										{t(LAYER_LABEL_KEY[layer])}
									</Typography>
									<Box sx={[toggleInlineRowSx, { mb: 1 }] as SxProps<Theme>}>
										<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
											{t('externalDataLayerEnabled')}
										</Typography>
										<CustomSwitch
											checked={enabled}
											onChange={(e) => handleEnabled(layer, e.target.checked)}
											inputProps={{ 'aria-label': t('externalDataLayerEnabled') }}
										/>
									</Box>
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
							sx={{ width: '100%', mr: 0 }}
						/>
					</>
				))}
		</AdminSection>
	);
}
