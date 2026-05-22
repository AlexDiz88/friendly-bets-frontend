import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import {
	getGridColumnsForMatchdayCount,
	MatchdaySlot,
} from '../../features/football-data/competitionOptions';

const compactSelectSx = {
	height: 30,
	fontSize: '0.8rem',
	'& .MuiSelect-select': {
		py: 0.25,
		px: 0.75,
		minHeight: 'unset !important',
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
	'aria-label'?: string;
}

export default function MatchdayGridSelect({
	value,
	matchdayCount,
	slots,
	onChange,
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
	const selectedSlot = resolvedSlots.find((s) => s.value === value);

	const handleChange = (e: SelectChangeEvent<number>): void => {
		onChange(Number(e.target.value));
	};

	return (
		<Select
			size="small"
			value={value}
			onChange={handleChange}
			aria-label={ariaLabel}
			renderValue={() => (selectedSlot ? formatSlotLabel(selectedSlot) : String(value))}
			sx={{ ...compactSelectSx, minWidth: '2.75rem' }}
			MenuProps={{
				PaperProps: { sx: { maxHeight: 360 } },
				MenuListProps: {
					sx: {
						display: 'grid',
						gridTemplateColumns: `repeat(${columns}, minmax(2.1rem, 1fr))`,
						gap: 0.35,
						p: 0.75,
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
						minHeight: '2.1rem',
						justifyContent: 'center',
						p: 0,
						fontSize: '0.75rem',
						fontWeight: value === slot.value ? 700 : 500,
						whiteSpace: 'nowrap',
					}}
				>
					{formatSlotLabel(slot)}
				</MenuItem>
			))}
		</Select>
	);
}
