import type { SxProps, Theme } from '@mui/material';

/** Общая высота compact-селектов (лига, тур) — 34px. */
export const COMPACT_SELECT_HEIGHT = 34;

const selectInner = {
	py: 0.5,
	px: 0.5,
	minHeight: 'unset !important',
	height: '100%',
	boxSizing: 'border-box' as const,
	display: 'flex',
	alignItems: 'center',
	lineHeight: 1.2,
};

/** Лига, текст слева. */
export const compactLeagueSelectSx: SxProps<Theme> = {
	height: COMPACT_SELECT_HEIGHT,
	fontSize: '0.8rem',
	'&.MuiInputBase-root': {
		height: COMPACT_SELECT_HEIGHT,
	},
	'& .MuiSelect-select': selectInner,
};

/** Тур: текст по центру, место под стрелку справа. */
export const compactMatchdaySelectSx: SxProps<Theme> = {
	height: COMPACT_SELECT_HEIGHT,
	fontSize: '0.8rem',
	'&.MuiInputBase-root': {
		height: COMPACT_SELECT_HEIGHT,
	},
	'& .MuiSelect-select': {
		...selectInner,
		justifyContent: 'center',
		textAlign: 'center',
		pr: '1.75rem !important',
	},
};
