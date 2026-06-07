import type { SxProps, Theme } from '@mui/material';
import { COMPACT_SELECT_HEIGHT, filterSelectRootSx } from './filterSelectStyles';

export { COMPACT_SELECT_HEIGHT };

/** Лига, текст слева. */
export const compactLeagueSelectSx: SxProps<Theme> = [
	filterSelectRootSx('compactLeague'),
	{
		minWidth: '6rem',
		maxWidth: '6rem',
	},
] as SxProps<Theme>;

/** Тур: текст по центру. */
export const compactMatchdaySelectSx: SxProps<Theme> = [
	filterSelectRootSx('compactMatchday'),
	{
		minWidth: '5.5rem',
	},
] as SxProps<Theme>;
