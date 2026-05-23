import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import {
	getGridColumnsForMatchdayCount,
	MatchdaySlot,
} from '../../features/football-data/competitionOptions';

/** Высота и отступы как у compact LeagueSelect; значение по центру между краями и стрелкой */
const compactSelectSx = {
	height: 34,
	fontSize: '0.8rem',
	'& .MuiSelect-select': {
		minHeight: 'unset !important',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		lineHeight: 1.2,
	},
};

const formatSlotLabel = (slot: MatchdaySlot): string => {
	const display = slot.slotId ?? slot.label;
	if (slot.kind === 'KNOCKOUT' || display.includes('[')) {
		const bracket = display.indexOf('[');
		const playoffStage = bracket >= 0 ? display.substring(0, bracket).trim() : display;
		const leg = bracket >= 0 ? display.substring(bracket) : '';
		const key = `playoffStage.${playoffStage}`;
		const translated = t(key);
		const stageLabel = translated === key ? playoffStage : translated;
		return leg ? `${stageLabel} ${leg}` : stageLabel;
	}
	return display;
};

interface MatchdayGridSelectProps {
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
			size="small"
			value={safeValue}
			onChange={handleChange}
			disabled={disabled}
			aria-label={ariaLabel}
			renderValue={() => (
				<Box component="span" sx={{ width: '100%', textAlign: 'center' }}>
					{selectedSlot ? formatSlotLabel(selectedSlot) : String(safeValue)}
				</Box>
			)}
			sx={{ ...compactSelectSx, minWidth: '3.5rem' }}
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
