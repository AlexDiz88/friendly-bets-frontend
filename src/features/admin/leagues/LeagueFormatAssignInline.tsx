import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, IconButton, MenuItem, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import LeagueAvatar from '../../../components/custom/avatar/LeagueAvatar';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { ADMIN_INLINE_WARNING_CARD_SX } from '../adminPanelStyles';
import TournamentFormat from '../tournament-formats/types/TournamentFormat';
import { assignTournamentFormat } from './api';

export default function LeagueFormatAssignInline({
	leagueId,
	leagueCode,
	leagueName,
	seasonTitle,
	formats,
	onAssigned,
}: {
	leagueId: string;
	leagueCode: string;
	leagueName: string;
	seasonTitle?: string;
	formats: TournamentFormat[];
	onAssigned: () => void;
}): JSX.Element {
	const dispatch = useAppDispatch();
	const [formatId, setFormatId] = useState('');
	const [saving, setSaving] = useState(false);

	const handleFormatChange = (event: SelectChangeEvent): void => {
		setFormatId(event.target.value);
	};

	const handleAssign = async (): Promise<void> => {
		if (!formatId || saving) {
			return;
		}
		setSaving(true);
		try {
			await assignTournamentFormat(leagueId, formatId);
			dispatch(showSuccessSnackbar({ message: t('leagueFormatAssigned') }));
			setFormatId('');
			onAssigned();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('leagueFormatAssignError'),
				})
			);
		} finally {
			setSaving(false);
		}
	};

	const selectedFormatName = formats.find((f) => f.id === formatId)?.name;

	return (
		<Box
			sx={[
				ADMIN_INLINE_WARNING_CARD_SX,
				{
					width: '100%',
					minWidth: 0,
					overflow: 'hidden',
					boxSizing: 'border-box',
				},
			]}
		>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: seasonTitle ? 0.25 : 0.5 }}>
				<LeagueAvatar leagueCode={leagueCode} height={24} />
				<Typography variant="body2" fontWeight={600} sx={{ flex: 1, minWidth: 0 }}>
					{leagueName}
				</Typography>
				<Tooltip title={t('leagueFormatRequiredTooltip')} arrow>
					<WarningAmberIcon color="warning" fontSize="small" />
				</Tooltip>
			</Box>
			{seasonTitle && (
				<Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5, pl: 3.5 }}>
					{t('season')}: {seasonTitle}
				</Typography>
			)}
			<Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', minWidth: 0 }}>
				<Select
					fullWidth
					size="small"
					displayEmpty
					value={formatId}
					onChange={handleFormatChange}
					disabled={saving}
					renderValue={() =>
						formatId ? (
							<Box
								component="span"
								sx={{
									display: 'block',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'nowrap',
								}}
							>
								{selectedFormatName}
							</Box>
						) : (
							t('chooseTournamentFormat')
						)
					}
					sx={{
						flex: 1,
						minWidth: 0,
						'& .MuiSelect-select': {
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						},
					}}
				>
					<MenuItem value="" disabled>
						{t('chooseTournamentFormat')}
					</MenuItem>
					{formats.map((f) => (
						<MenuItem key={f.id} value={f.id}>
							{f.name}
						</MenuItem>
					))}
				</Select>
				<Tooltip title={t('btnText.save')} arrow>
					<Box component="span" sx={{ flexShrink: 0, display: 'inline-flex' }}>
						<IconButton
							color="success"
							size="small"
							disabled={!formatId || saving}
							onClick={() => {
								void handleAssign();
							}}
							aria-label={t('btnText.save')}
						>
							<CheckIcon fontSize="small" />
						</IconButton>
					</Box>
				</Tooltip>
			</Box>
		</Box>
	);
}
