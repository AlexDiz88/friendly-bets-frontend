import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, TextField, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { ADMIN_INLINE_WARNING_CARD_SX, ADMIN_LIST_ITEM_CARD_SX } from '../adminPanelStyles';
import { assignSeasonDates } from './seasonDatesApi';

export default function SeasonDatesAssignInline({
	seasonId,
	title,
	status,
	initialStartDate = '',
	initialEndDate = '',
	missingDates = false,
	onAssigned,
}: {
	seasonId: string;
	title: string;
	status: string;
	initialStartDate?: string;
	initialEndDate?: string;
	missingDates?: boolean;
	onAssigned: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [startDate, setStartDate] = useState(initialStartDate);
	const [endDate, setEndDate] = useState(initialEndDate);
	const [saving, setSaving] = useState(false);

	const isChanged = startDate !== initialStartDate || endDate !== initialEndDate;
	const canSave = Boolean(startDate && endDate && !saving && (missingDates || isChanged));

	const handleAssign = async (): Promise<void> => {
		if (!canSave) {
			return;
		}
		setSaving(true);
		try {
			await assignSeasonDates(seasonId, startDate, endDate);
			dispatch(showSuccessSnackbar({ message: t('seasonDatesAssigned') }));
			onAssigned();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('seasonDatesAssignError'),
				})
			);
		} finally {
			setSaving(false);
		}
	};

	return (
		<Box sx={missingDates ? ADMIN_INLINE_WARNING_CARD_SX : ADMIN_LIST_ITEM_CARD_SX}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
				<Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
					{title}
				</Typography>
				{missingDates && (
					<Tooltip title={t('seasonDatesRequiredTooltip')} arrow>
						<WarningAmberIcon color="warning" fontSize="small" />
					</Tooltip>
				)}
			</Box>
			<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
				{t('actualStatus')}: {status}
			</Typography>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				<TextField
					fullWidth
					type="date"
					size="small"
					label={t('seasonStartDate')}
					value={startDate}
					onChange={(e) => setStartDate(e.target.value)}
					disabled={saving}
					InputLabelProps={{ shrink: true }}
					inputProps={{ max: endDate || undefined }}
				/>
				<TextField
					fullWidth
					type="date"
					size="small"
					label={t('seasonEndDate')}
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					disabled={saving}
					InputLabelProps={{ shrink: true }}
					inputProps={{ min: startDate || undefined }}
				/>
				<Box sx={{ display: 'flex', justifyContent: 'center' }}>
					<CustomSuccessButton
						buttonText={t('btnText.save')}
						disabled={!canSave}
						onClick={() => {
							void handleAssign();
						}}
					/>
				</Box>
			</Box>
		</Box>
	);
}
