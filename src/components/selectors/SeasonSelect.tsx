import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { Box, MenuItem, Select, SelectChangeEvent, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import {
	filterSelectMenuItemSx,
	filterSelectMenuProps,
	filterSelectRootSx,
} from './filterSelectStyles';

interface SeasonSelectProps {
	value: string;
	onChange: (event: SelectChangeEvent<string>) => void;
	seasons: Array<{ id: string; title: string }>;
	sx?: SxProps<Theme>;
	compact?: boolean;
}

const seasonValueSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	minWidth: 0,
	width: '100%',
	gap: 0.6,
};

const seasonTitleSx: SxProps<Theme> = {
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	fontWeight: 600,
	fontSize: '0.8rem',
};

const seasonIconSx: SxProps<Theme> = {
	fontSize: '1.2rem',
	flexShrink: 0,
	opacity: 0.8,
};

const seasonSelectExtraSx: SxProps<Theme> = {
	fontSize: '0.8rem',
	minWidth: 0,
	'& .MuiSelect-select': {
		fontSize: '0.8rem',
		fontWeight: 600,
		pl: 0.5,
	},
};

const seasonMenuItemSx = (theme: Theme) => ({
	...(filterSelectMenuItemSx as (t: Theme) => Record<string, unknown>)(theme),
	pl: 0.75,
	pr: 1,
});

function SeasonValue({ title, compact }: { title: string; compact?: boolean }): JSX.Element {
	return (
		<Box sx={seasonValueSx}>
			{compact ? null : <CalendarMonth sx={seasonIconSx} />}
			<Box component="span" sx={seasonTitleSx}>
				{title}
			</Box>
		</Box>
	);
}

const SeasonSelect = ({
	value,
	onChange,
	seasons,
	sx,
	compact,
}: SeasonSelectProps): JSX.Element => {
	const seasonIds = seasons.map((season) => season.id);
	const safeValue = seasonIds.includes(value) ? value : '';
	const selectedSeason = seasons.find((season) => season.id === safeValue);

	const extraSx = sx == null ? [] : Array.isArray(sx) ? sx : [sx];

	return (
		<Select
			size="small"
			displayEmpty
			sx={[filterSelectRootSx('standard'), seasonSelectExtraSx, ...extraSx] as SxProps<Theme>}
			labelId="season-select-label"
			id="season-select"
			value={safeValue}
			onChange={onChange}
			renderValue={() => (
				<SeasonValue compact={compact} title={selectedSeason?.title ?? t('season')} />
			)}
			MenuProps={filterSelectMenuProps(seasons.length)}
		>
			{seasons.map((season) => (
				<MenuItem sx={seasonMenuItemSx} key={season.id} value={season.id}>
					<SeasonValue title={season.title} />
				</MenuItem>
			))}
		</Select>
	);
};

export default SeasonSelect;
