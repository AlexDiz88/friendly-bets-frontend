import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import type { ExpandedMatchdaySlot } from '../../features/admin/tournament-formats/types/TournamentFormat';
import { formatMatchdaySlotLabel } from '../utils/matchdaySlots';

const compactSelectSx = {
	height: 34,
	fontSize: '0.8rem',
	minWidth: '11rem',
	'& .MuiSelect-select': {
		py: 0.5,
		px: 0.5,
		minHeight: 'unset !important',
		display: 'flex',
		alignItems: 'center',
		lineHeight: 1.2,
	},
};

type MatchdaySlotSelectProps = {
	value: string;
	slots: ExpandedMatchdaySlot[];
	onChange: (matchDay: string) => void;
	disabled?: boolean;
};

export default function MatchdaySlotSelect({
	value,
	slots,
	onChange,
	disabled = false,
}: MatchdaySlotSelectProps): JSX.Element {
	const safeValue = slots.some((s) => s.id === value) ? value : slots[0]?.id ?? '';

	const handleChange = (event: SelectChangeEvent<string>): void => {
		onChange(event.target.value);
	};

	return (
		<Select
			autoWidth
			size="small"
			disabled={disabled || slots.length === 0}
			sx={compactSelectSx}
			labelId="matchday-slot-label"
			id="matchday-slot-select"
			value={safeValue}
			onChange={handleChange}
			displayEmpty
			renderValue={(selected) => {
				const slot = slots.find((s) => s.id === selected);
				return slot ? formatMatchdaySlotLabel(slot) : selected;
			}}
		>
			{slots.map((slot) => (
				<MenuItem key={slot.id} value={slot.id}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						{formatMatchdaySlotLabel(slot)}
					</Box>
				</MenuItem>
			))}
		</Select>
	);
}
