import {
	MenuItem,
	Select,
	SelectChangeEvent,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { compactMatchdaySelectSx } from '../selectors/compactSelectSx';
import {
	filterSelectGridMenuItemSx,
	filterSelectMenuProps,
} from '../selectors/filterSelectStyles';
import { formatSlotLabel } from './formatSlotLabel';
import { getGridColumnsForMatchdayCount, MatchdaySlot } from './types';

const GRID_MENU_WIDTH = 'min(22rem, calc(100vw - 1.5rem))';

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
	const theme = useTheme();
	const isNarrow = useMediaQuery(theme.breakpoints.down('sm'));

	const resolvedSlots: MatchdaySlot[] =
		slots && slots.length > 0
			? slots
			: Array.from({ length: matchdayCount }, (_, i) => ({
					value: i + 1,
					label: String(i + 1),
					kind: 'REGULAR' as const,
				}));

	const columns = getGridColumnsForMatchdayCount(resolvedSlots.length, isNarrow);
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
			sx={compactMatchdaySelectSx}
			MenuProps={{
				...filterSelectMenuProps(
					resolvedSlots.length,
					{
						width: GRID_MENU_WIDTH,
						maxWidth: GRID_MENU_WIDTH,
						boxSizing: 'border-box',
						overflow: 'hidden',
					},
					{ gridColumns: columns }
				),
				MenuListProps: {
					sx: {
						display: 'grid',
						gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
						gap: 0.5,
						p: 1,
						justifyContent: 'center',
						width: '100%',
						maxWidth: '100%',
						boxSizing: 'border-box',
						maxHeight: 'none',
						overflowX: 'hidden',
						overflowY: 'auto',
						py: 0.5,
					},
				},
			}}
		>
			{resolvedSlots.map((slot) => (
				<MenuItem
					key={slot.value}
					value={slot.value}
					sx={(theme) => ({
						...(typeof filterSelectGridMenuItemSx === 'function'
							? filterSelectGridMenuItemSx(theme)
							: {}),
						minWidth: 0,
						width: '100%',
						maxWidth: '100%',
						minHeight: '2.75rem',
						justifyContent: 'center',
						px: 0.25,
						py: 1.5,
						fontSize: isNarrow ? '0.78rem' : '0.85rem',
						fontWeight: safeValue === slot.value ? 700 : 600,
						whiteSpace: 'normal',
						lineHeight: 1.2,
						textAlign: 'center',
					})}
				>
					{formatSlotLabel(slot)}
				</MenuItem>
			))}
		</Select>
	);
}
