import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
	type SelectChangeEvent,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import { destructiveActionHintSx } from '../../../components/custom/btn/customButtonStyles';
import CustomCancelButton from '../../../components/custom/btn/CustomCancelButton';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import { ADMIN_FORM_FIELD_SX, ADMIN_SELECT_SX } from '../adminPanelStyles';
import {
	migrateTimestampsToUtcInstant,
	unsetMatchScheduleExternalIds,
	type MatchScheduleExternalIdsMigrationResult,
	type UtcTimestampsMigrationResult,
} from './adminScriptsApi';

type AdminScriptId =
	| 'migrate-timestamps-to-utc-instant'
	| 'unset-match-schedule-external-ids';

type AdminScriptDef = {
	id: AdminScriptId;
	titleKey: string;
	hintKey: string;
	run: () => Promise<string>;
};

const ADMIN_SCRIPTS: AdminScriptDef[] = [
	{
		id: 'migrate-timestamps-to-utc-instant',
		titleKey: 'adminScriptUtcTimestampsMigration',
		hintKey: 'runScriptUtcTimestampsMigrationHint',
		run: async () => {
			const result: UtcTimestampsMigrationResult = await migrateTimestampsToUtcInstant();
			const modified = Object.values(result.collections || {}).reduce(
				(sum, s) => sum + (s.modified ?? 0),
				0
			);
			return t('utcTimestampsMigrationSuccess', {
				modified,
				timezone: result.accountsTimezoneBackfilled ?? 0,
			});
		},
	},
	{
		id: 'unset-match-schedule-external-ids',
		titleKey: 'adminScriptUnsetExternalIds',
		hintKey: 'runScriptMatchScheduleExternalIdsMigrationHint',
		run: async () => {
			const result: MatchScheduleExternalIdsMigrationResult = await unsetMatchScheduleExternalIds();
			return t('matchScheduleExternalIdsMigrationSuccess', {
				matched: result.matched ?? 0,
				modified: result.modified ?? 0,
			});
		},
	},
];

export default function AdminScriptsPanel({
	startLoading,
	stopLoading,
}: {
	startLoading: () => void;
	stopLoading: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [scriptId, setScriptId] = useState<AdminScriptId>(ADMIN_SCRIPTS[0].id);
	const [openDialog, setOpenDialog] = useState(false);

	const selected = ADMIN_SCRIPTS.find((s) => s.id === scriptId) ?? ADMIN_SCRIPTS[0];
	const safeScriptId = ADMIN_SCRIPTS.some((s) => s.id === scriptId)
		? scriptId
		: ADMIN_SCRIPTS[0].id;

	const handleScriptChange = (event: SelectChangeEvent): void => {
		setScriptId(event.target.value as AdminScriptId);
	};

	const handleSubmit = useCallback(
		async (event?: React.FormEvent) => {
			event?.preventDefault();
			setOpenDialog(false);
			startLoading();
			try {
				const message = await selected.run();
				dispatch(showSuccessSnackbar({ message }));
			} catch (error) {
				const message = error instanceof Error ? error.message : String(error);
				dispatch(showErrorSnackbar({ message }));
			} finally {
				stopLoading();
			}
		},
		[dispatch, selected, startLoading, stopLoading]
	);

	return (
		<Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
			<FormControl fullWidth size="small" sx={ADMIN_FORM_FIELD_SX}>
				<InputLabel id="admin-script-select">{t('adminScriptSelect')}</InputLabel>
				<Select
					labelId="admin-script-select"
					label={t('adminScriptSelect')}
					value={safeScriptId}
					onChange={handleScriptChange}
					sx={ADMIN_SELECT_SX}
				>
					{ADMIN_SCRIPTS.map((script) => (
						<MenuItem key={script.id} value={script.id}>
							{t(script.titleKey)}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, lineHeight: 1.45 }}>
				{t(selected.hintKey)}
			</Typography>

			<CustomButton
				sx={{ width: '100%' }}
				buttonColor="warning"
				onClick={() => setOpenDialog(true)}
				buttonText={t('runScript')}
			/>

			<Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
				<DialogContent>
					<Typography>
						<b>{t('runScript')}?</b>
						<br />
						{t(selected.titleKey)}
						<Box component="span" sx={destructiveActionHintSx}>
							<br />
							{t('thisActionCannotBeCanceled')}
						</Box>
					</Typography>
				</DialogContent>
				<DialogActions>
					<CustomCancelButton onClick={() => setOpenDialog(false)} />
					<CustomSuccessButton onClick={handleSubmit} />
				</DialogActions>
			</Dialog>
		</Box>
	);
}
