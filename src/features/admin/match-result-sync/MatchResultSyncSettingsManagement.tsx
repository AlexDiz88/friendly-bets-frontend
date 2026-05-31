import {
	Box,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Switch,
	TextField,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import { ADMIN_PANEL_SX } from '../adminPanelStyles';
import {
	getMatchResultSyncSettings,
	MatchResultSyncSettings,
	patchMatchResultSyncSettings,
} from './matchResultSyncSettingsApi';

const PROVIDERS = ['football-data', 'api-football'] as const;

export default function MatchResultSyncSettingsManagement(): JSX.Element {
	const dispatch = useAppDispatch();
	const [settings, setSettings] = useState<MatchResultSyncSettings | null>(null);
	const [saving, setSaving] = useState(false);

	const load = useCallback(async () => {
		try {
			const data = await getMatchResultSyncSettings();
			setSettings(data);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('matchResultSyncSettingsLoadError'),
				})
			);
		}
	}, [dispatch]);

	useEffect(() => {
		void load();
	}, [load]);

	const handleSave = async (): Promise<void> => {
		if (!settings) {
			return;
		}
		setSaving(true);
		try {
			const updated = await patchMatchResultSyncSettings({
				primaryProvider: settings.primaryProvider,
				secondaryProvider: settings.secondaryProvider,
				dualVerificationEnabled: settings.dualVerificationEnabled,
				allowFinalizeWithoutSecondary: settings.allowFinalizeWithoutSecondary,
				requireStablePolls: settings.requireStablePolls,
				minMinutesAfterKickoff: settings.minMinutesAfterKickoff,
				minMinutesAfterKickoffKnockout: settings.minMinutesAfterKickoffKnockout,
				minMinutesSinceApiLastUpdated: settings.minMinutesSinceApiLastUpdated,
				autoSettleOnlyWhenMatchdayCompleted: settings.autoSettleOnlyWhenMatchdayCompleted,
			});
			setSettings(updated);
			dispatch(showSuccessSnackbar({ message: t('matchResultSyncSettingsSaved') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('matchResultSyncSettingsSaveError'),
				})
			);
		} finally {
			setSaving(false);
		}
	};

	if (!settings) {
		return (
			<Box sx={ADMIN_PANEL_SX}>
				<Typography>{t('loading')}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={ADMIN_PANEL_SX}>
			<Typography sx={{ fontSize: 22, fontWeight: 600, mb: 1 }}>
				{t('matchResultSyncSettingsTitle')}
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, px: 0.5 }}>
				{t('matchResultSyncSettingsHint')}
			</Typography>

			<FormControl fullWidth size="small" sx={{ mb: 1.5, textAlign: 'left' }}>
				<InputLabel id="primary-provider-label">{t('matchResultSyncPrimaryProvider')}</InputLabel>
				<Select
					labelId="primary-provider-label"
					label={t('matchResultSyncPrimaryProvider')}
					value={settings.primaryProvider}
					onChange={(e: SelectChangeEvent) =>
						setSettings({ ...settings, primaryProvider: e.target.value })
					}
				>
					{PROVIDERS.map((p) => (
						<MenuItem key={p} value={p}>
							{p}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth size="small" sx={{ mb: 1.5, textAlign: 'left' }}>
				<InputLabel id="secondary-provider-label">{t('matchResultSyncSecondaryProvider')}</InputLabel>
				<Select
					labelId="secondary-provider-label"
					label={t('matchResultSyncSecondaryProvider')}
					value={settings.secondaryProvider}
					onChange={(e: SelectChangeEvent) =>
						setSettings({ ...settings, secondaryProvider: e.target.value })
					}
				>
					{PROVIDERS.filter((p) => p !== settings.primaryProvider).map((p) => (
						<MenuItem key={p} value={p}>
							{p}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControlLabel
				control={
					<Switch
						checked={settings.dualVerificationEnabled}
						onChange={(e) =>
							setSettings({ ...settings, dualVerificationEnabled: e.target.checked })
						}
					/>
				}
				label={t('matchResultSyncDualVerification')}
				sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, mb: 0.5 }}
			/>

			<FormControlLabel
				control={
					<Switch
						checked={settings.allowFinalizeWithoutSecondary}
						onChange={(e) =>
							setSettings({ ...settings, allowFinalizeWithoutSecondary: e.target.checked })
						}
					/>
				}
				label={t('matchResultSyncAllowWithoutSecondary')}
				sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, mb: 1 }}
			/>

			<TextField
				type="number"
				size="small"
				fullWidth
				label={t('matchResultSyncStablePolls')}
				value={settings.requireStablePolls}
				onChange={(e) =>
					setSettings({ ...settings, requireStablePolls: Number(e.target.value) || 1 })
				}
				sx={{ mb: 1 }}
				inputProps={{ min: 1, max: 10 }}
			/>
			<TextField
				type="number"
				size="small"
				fullWidth
				label={t('matchResultSyncMinMinutesKickoff')}
				value={settings.minMinutesAfterKickoff}
				onChange={(e) =>
					setSettings({ ...settings, minMinutesAfterKickoff: Number(e.target.value) || 90 })
				}
				sx={{ mb: 1 }}
			/>
			<TextField
				type="number"
				size="small"
				fullWidth
				label={t('matchResultSyncMinMinutesKnockout')}
				value={settings.minMinutesAfterKickoffKnockout}
				onChange={(e) =>
					setSettings({
						...settings,
						minMinutesAfterKickoffKnockout: Number(e.target.value) || 120,
					})
				}
				sx={{ mb: 1 }}
			/>
			<TextField
				type="number"
				size="small"
				fullWidth
				label={t('matchResultSyncMinMinutesApiUpdated')}
				value={settings.minMinutesSinceApiLastUpdated}
				onChange={(e) =>
					setSettings({
						...settings,
						minMinutesSinceApiLastUpdated: Number(e.target.value) || 0,
					})
				}
				sx={{ mb: 1 }}
			/>

			<FormControlLabel
				control={
					<Switch
						checked={settings.autoSettleOnlyWhenMatchdayCompleted}
						onChange={(e) =>
							setSettings({
								...settings,
								autoSettleOnlyWhenMatchdayCompleted: e.target.checked,
							})
						}
					/>
				}
				label={t('matchResultSyncAutoSettleMatchdayOnly')}
				sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, mb: 1 }}
			/>

			{settings.envDefaults ? (
				<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
					{t('matchResultSyncEnvAutoSettle')}:{' '}
					{settings.envDefaults.autoSettleEnabled
						? t('matchResultSyncEnabled')
						: t('matchResultSyncDisabled')}
				</Typography>
			) : null}

			<CustomSuccessButton
				buttonText={t('btnText.save')}
				onClick={() => void handleSave()}
				disabled={saving}
				sx={{ width: '100%' }}
			/>
		</Box>
	);
}
