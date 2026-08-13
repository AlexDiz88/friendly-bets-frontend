import CalendarMonth from '@mui/icons-material/CalendarMonth';
import { Box, MenuItem, Select, SelectChangeEvent, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import Season from '../../features/admin/seasons/types/Season';
import {
	filterSelectMenuItemSx,
	filterSelectMenuProps,
	filterSelectRootSx,
} from './filterSelectStyles';

interface SeasonSelectProps {
	value: string;
	onChange: (event: SelectChangeEvent<string>) => void;
	seasons: Season[];
	sx?: SxProps<Theme>;
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
	lineHeight: 1.2,
};

const seasonIconSx: SxProps<Theme> = {
	fontSize: '1.05rem',
	flexShrink: 0,
	opacity: 0.78,
};

const seasonSelectExtraSx: SxProps<Theme> = {
	fontSize: '0.8rem',
	minWidth: 0,
	'& .MuiSelect-select': {
		fontSize: '0.8rem',
		fontWeight: 600,
	},
};

const seasonMenuItemSx: SxProps<Theme> = (theme) => ({
	...(typeof filterSelectMenuItemSx === 'function'
		? filterSelectMenuItemSx(theme)
		: filterSelectMenuItemSx),
	fontSize: '0.8rem',
});

function SeasonValue({ title }: { title: string }): JSX.Element {
	return (
		<Box sx={seasonValueSx}>
			<CalendarMonth sx={seasonIconSx} />
			<Box component="span" sx={seasonTitleSx}>
				{title}
			</Box>
		</Box>
	);
}

const SeasonSelect = ({ value, onChange, seasons, sx }: SeasonSelectProps): JSX.Element => {
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
			renderValue={() => <SeasonValue title={selectedSeason?.title ?? t('season')} />}
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
