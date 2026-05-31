import {
	Box,
	CircularProgress,
	FormControl,
	FormControlLabel,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Switch,
	TextField,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import {
	getMatchResultSyncSettings,
	MatchResultSyncSettings,
	patchMatchResultSyncSettings,
} from './matchResultSyncSettingsApi';

const PROVIDERS = ['football-data', 'api-football'] as const;

function cloneSettings(data: MatchResultSyncSettings): MatchResultSyncSettings {
	return { ...data };
}

export default function MatchResultSyncSettingsManagement(): JSX.Element {
	const dispatch = useAppDispatch();
	const [savedSettings, setSavedSettings] = useState<MatchResultSyncSettings | null>(null);
	const [draft, setDraft] = useState<MatchResultSyncSettings | null>(null);
	const [showForm, setShowForm] = useState(false);
	const [saving, setSaving] = useState(false);

	const load = useCallback(async () => {
		try {
			const data = await getMatchResultSyncSettings();
			setSavedSettings(data);
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

	const handleOpen = (): void => {
		if (savedSettings) {
			setDraft(cloneSettings(savedSettings));
			setShowForm(true);
		}
	};

	const handleCancel = (): void => {
		setShowForm(false);
		setDraft(null);
	};

	const handleSave = async (): Promise<void> => {
		if (!draft) {
			return;
		}
		setSaving(true);
		try {
			const updated = await patchMatchResultSyncSettings({
				primaryProvider: draft.primaryProvider,
				secondaryProvider: draft.secondaryProvider,
				dualVerificationEnabled: draft.dualVerificationEnabled,
				allowFinalizeWithoutSecondary: draft.allowFinalizeWithoutSecondary,
				requireStablePolls: draft.requireStablePolls,
				minMinutesAfterKickoff: draft.minMinutesAfterKickoff,
				minMinutesAfterKickoffKnockout: draft.minMinutesAfterKickoffKnockout,
				minMinutesSinceApiLastUpdated: draft.minMinutesSinceApiLastUpdated,
				autoSettleOnlyWhenMatchdayCompleted: draft.autoSettleOnlyWhenMatchdayCompleted,
			});
			setSavedSettings(updated);
			setDraft(cloneSettings(updated));
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

	if (!savedSettings) {
		return (
			<AdminSection title={t('matchResultSyncSettingsTitle')} hint={t('matchResultSyncSettingsHint')}>
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
					<CircularProgress size={28} />
				</Box>
			</AdminSection>
		);
	}

	return (
		<AdminSection title={t('matchResultSyncSettingsTitle')} hint={t('matchResultSyncSettingsHint')}>
			<CustomButton
				sx={{ width: '100%', mb: showForm ? 1.5 : 0 }}
				onClick={() => (showForm ? handleCancel() : handleOpen())}
				buttonColor="info"
				buttonVariant="outlined"
				buttonText={
					showForm ? t('hideMatchResultSyncSettings') : t('showMatchResultSyncSettings')
				}
			/>

			{showForm && draft && (
				<Box>
					<FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
						<InputLabel id="primary-provider-label">{t('matchResultSyncPrimaryProvider')}</InputLabel>
						<Select
							labelId="primary-provider-label"
							label={t('matchResultSyncPrimaryProvider')}
							value={draft.primaryProvider}
							onChange={(e: SelectChangeEvent) =>
								setDraft({ ...draft, primaryProvider: e.target.value })
							}
						>
							{PROVIDERS.map((p) => (
								<MenuItem key={p} value={p}>
									{p}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
						<InputLabel id="secondary-provider-label">{t('matchResultSyncSecondaryProvider')}</InputLabel>
						<Select
							labelId="secondary-provider-label"
							label={t('matchResultSyncSecondaryProvider')}
							value={draft.secondaryProvider}
							onChange={(e: SelectChangeEvent) =>
								setDraft({ ...draft, secondaryProvider: e.target.value })
							}
						>
							{PROVIDERS.filter((p) => p !== draft.primaryProvider).map((p) => (
								<MenuItem key={p} value={p}>
									{p}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControlLabel
						control={
							<Switch
								checked={draft.dualVerificationEnabled}
								onChange={(e) =>
									setDraft({ ...draft, dualVerificationEnabled: e.target.checked })
								}
							/>
						}
						label={t('matchResultSyncDualVerification')}
						sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, mb: 0.5, width: '100%' }}
					/>

					<FormControlLabel
						control={
							<Switch
								checked={draft.allowFinalizeWithoutSecondary}
								onChange={(e) =>
									setDraft({ ...draft, allowFinalizeWithoutSecondary: e.target.checked })
								}
							/>
						}
						label={t('matchResultSyncAllowWithoutSecondary')}
						sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, mb: 1, width: '100%' }}
					/>

					<TextField
						type="number"
						size="small"
						fullWidth
						label={t('matchResultSyncStablePolls')}
						value={draft.requireStablePolls}
						onChange={(e) =>
							setDraft({ ...draft, requireStablePolls: Number(e.target.value) || 1 })
						}
						sx={{ mb: 1 }}
						inputProps={{ min: 1, max: 10 }}
					/>
					<TextField
						type="number"
						size="small"
						fullWidth
						label={t('matchResultSyncMinMinutesKickoff')}
						value={draft.minMinutesAfterKickoff}
						onChange={(e) =>
							setDraft({ ...draft, minMinutesAfterKickoff: Number(e.target.value) || 90 })
						}
						sx={{ mb: 1 }}
					/>
					<TextField
						type="number"
						size="small"
						fullWidth
						label={t('matchResultSyncMinMinutesKnockout')}
						value={draft.minMinutesAfterKickoffKnockout}
						onChange={(e) =>
							setDraft({
								...draft,
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
						value={draft.minMinutesSinceApiLastUpdated}
						onChange={(e) =>
							setDraft({
								...draft,
								minMinutesSinceApiLastUpdated: Number(e.target.value) || 0,
							})
						}
						sx={{ mb: 1 }}
					/>

					<FormControlLabel
						control={
							<Switch
								checked={draft.autoSettleOnlyWhenMatchdayCompleted}
								onChange={(e) =>
									setDraft({
										...draft,
										autoSettleOnlyWhenMatchdayCompleted: e.target.checked,
									})
								}
							/>
						}
						label={t('matchResultSyncAutoSettleMatchdayOnly')}
						sx={{ display: 'flex', justifyContent: 'space-between', ml: 0, mb: 1, width: '100%' }}
					/>

					{draft.envDefaults ? (
						<Box
							component="span"
							sx={{
								display: 'block',
								typography: 'caption',
								color: 'text.secondary',
								mb: 1.5,
								px: 1,
								py: 0.75,
								borderRadius: 1,
								bgcolor: 'action.hover',
							}}
						>
							{t('matchResultSyncEnvAutoSettle')}:{' '}
							{draft.envDefaults.autoSettleEnabled
								? t('matchResultSyncEnabled')
								: t('matchResultSyncDisabled')}
						</Box>
					) : null}

					<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
						<CustomCancelButton onClick={handleCancel} disabled={saving} />
						<CustomSuccessButton
							buttonText={t('btnText.save')}
							onClick={() => void handleSave()}
							disabled={saving}
						/>
					</Box>
				</Box>
			)}
		</AdminSection>
	);
}
