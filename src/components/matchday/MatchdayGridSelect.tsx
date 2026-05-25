import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { compactMatchdaySelectSx } from '../selectors/compactSelectSx';
import { formatSlotLabel } from './formatSlotLabel';
import { getGridColumnsForMatchdayCount, MatchdaySlot } from './types';

export interface MatchdayGridSelectProps {
	value: number;
	matchdayCount: number;
	slots?: MatchdaySlot[];
	onChange: (matchday: number) => void;
	disabled?: boolean;
	'aria-label'?: string;
}

export default function MatchdayGridSelect({
	value,
	matchdayCount,
	slots,
	onChange,
	disabled = false,
	'aria-label': ariaLabel,
}: MatchdayGridSelectProps): JSX.Element {
	const resolvedSlots: MatchdaySlot[] =
		slots && slots.length > 0
			? slots
			: Array.from({ length: matchdayCount }, (_, i) => ({
					value: i + 1,
					label: String(i + 1),
					kind: 'REGULAR' as const,
				}));

	const columns = getGridColumnsForMatchdayCount(resolvedSlots.length);
	const slotValues = resolvedSlots.map((s) => s.value);
	const safeValue = slotValues.includes(value) ? value : (resolvedSlots[0]?.value ?? 1);
	const selectedSlot = resolvedSlots.find((s) => s.value === safeValue);

	const handleChange = (e: SelectChangeEvent<number>): void => {
		onChange(Number(e.target.value));
	};

	return (
		<Select
			autoWidth
			size="small"
			value={safeValue}
			onChange={handleChange}
			disabled={disabled}
			aria-label={ariaLabel}
			renderValue={() =>
				selectedSlot ? formatSlotLabel(selectedSlot) : String(safeValue)
			}
			sx={{
				...compactMatchdaySelectSx,
				minWidth: '5.5rem',
			}}
			MenuProps={{
				PaperProps: {
					sx: {
						maxHeight: 420,
						width: 'min(100vw - 1.5rem, 22rem)',
					},
				},
				MenuListProps: {
					sx: {
						display: 'grid',
						gridTemplateColumns: `repeat(${columns}, minmax(2.75rem, 1fr))`,
						gap: 0.5,
						p: 1,
						justifyContent: 'center',
					},
				},
			}}
		>
			{resolvedSlots.map((slot) => (
				<MenuItem
					key={slot.value}
					value={slot.value}
					sx={{
						minWidth: 0,
						width: '100%',
						minHeight: '2.75rem',
						justifyContent: 'center',
						px: 0.25,
						py: 0.5,
						fontSize: '0.85rem',
						fontWeight: safeValue === slot.value ? 700 : 600,
						whiteSpace: 'nowrap',
					}}
				>
					{formatSlotLabel(slot)}
				</MenuItem>
			))}
		</Select>
	);
}
