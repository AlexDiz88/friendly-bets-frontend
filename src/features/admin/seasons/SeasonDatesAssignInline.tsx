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
import { assignSeasonDates } from './seasonDatesApi';
import { SeasonWithoutDates } from './types/Season';

export default function SeasonDatesAssignInline({
	season,
	onAssigned,
}: {
	season: SeasonWithoutDates;
	onAssigned: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	const [saving, setSaving] = useState(false);

	const canSave = Boolean(startDate && endDate && !saving);

	const handleAssign = async (): Promise<void> => {
		if (!canSave) {
			return;
		}
		setSaving(true);
		try {
			await assignSeasonDates(season.seasonId, startDate, endDate);
			dispatch(showSuccessSnackbar({ message: t('seasonDatesAssigned') }));
			setStartDate('');
			setEndDate('');
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
		<Box
			sx={{
				border: 1,
				borderColor: 'warning.light',
				borderRadius: 1,
				p: 0.75,
				bgcolor: 'action.hover',
				textAlign: 'left',
			}}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
				<Typography variant="body2" fontWeight={600} sx={{ flex: 1 }}>
					{season.title}
				</Typography>
				<Tooltip title={t('seasonDatesRequiredTooltip')} arrow>
					<WarningAmberIcon color="warning" fontSize="small" />
				</Tooltip>
			</Box>
			<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1.5 }}>
				{t('actualStatus')}: {season.status}
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
