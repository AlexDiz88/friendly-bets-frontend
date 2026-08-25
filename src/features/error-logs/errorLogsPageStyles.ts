import { alpha, type SxProps, type Theme } from '@mui/material/styles';

export const ERROR_LOG_ACCENT = '#e85d4c';
export const ERROR_LOG_WARN = '#d4a017';
export const ERROR_LOG_PROVIDER = '#2a9d8f';
export const ERROR_LOG_LAYER = '#3d7ea6';
export const ERROR_LOG_TEAMS = '#4caf50';
export const ERROR_LOG_ID = '#c47a3a';
export const ERROR_LOG_LEAGUE = '#6b7fd7';

export const errorLogsPageRootSx: SxProps<Theme> = {
	maxWidth: 520,
	mx: 'auto',
	px: { xs: 1.5, sm: 2 },
	pb: 8,
	pt: 2,
};

export const errorLogsTitleSx: SxProps<Theme> = {
	fontFamily: "'Exo 2', 'Shantell Sans', sans-serif",
	fontWeight: 700,
	fontSize: { xs: '1.35rem', sm: '1.5rem' },
	letterSpacing: '-0.02em',
	mb: 1.5,
};

export const errorLogsToolbarSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1,
	mb: 1.75,
	flexWrap: 'wrap',
};

export const errorLogsPageSizeSelectSx: SxProps<Theme> = {
	minWidth: '4.5rem',
	height: 36,
	fontSize: '0.85rem',
	fontWeight: 600,
	'& .MuiSelect-select': {
		py: 0.75,
		px: 1.25,
	},
};

export function errorLogCardSx(theme: Theme, severity: string): SxProps<Theme> {
	const isWarn = severity === 'WARN';
	const accent = isWarn ? ERROR_LOG_WARN : ERROR_LOG_ACCENT;
	const isDark = theme.palette.mode === 'dark';
	return {
		position: 'relative',
		borderRadius: 2.5,
		border: '1px solid',
		borderColor: alpha(accent, isDark ? 0.35 : 0.28),
		background: isDark
			? `linear-gradient(145deg, ${alpha(accent, 0.12)} 0%, rgba(255,255,255,0.03) 42%)`
			: `linear-gradient(145deg, ${alpha(accent, 0.08)} 0%, #fff 48%)`,
		boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.28)' : '0 3px 14px rgba(15,23,42,0.06)',
		p: 1.5,
		mb: 1.5,
		overflow: 'hidden',
		'&::before': {
			content: '""',
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0,
			width: 4,
			background: accent,
		},
	};
}

export const errorLogChipBaseSx: SxProps<Theme> = {
	height: 24,
	fontSize: '0.7rem',
	fontWeight: 700,
	letterSpacing: '0.02em',
	borderRadius: 1.25,
	maxWidth: '100%',
	'& .MuiChip-label': {
		px: 0.9,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
	},
};

export function chipSx(color: string, theme: Theme): SxProps<Theme> {
	const isDark = theme.palette.mode === 'dark';
	return {
		...errorLogChipBaseSx,
		color: isDark ? alpha(color, 0.95) : color,
		backgroundColor: alpha(color, isDark ? 0.22 : 0.14),
		border: '1px solid',
		borderColor: alpha(color, isDark ? 0.45 : 0.35),
	};
}

export function chipIdSx(theme: Theme): SxProps<Theme> {
	return {
		...chipSx(ERROR_LOG_ID, theme),
		height: 'auto',
		minHeight: 24,
		fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace",
		fontWeight: 600,
		letterSpacing: 0,
		'& .MuiChip-label': {
			px: 0.9,
			py: 0.25,
			overflow: 'visible',
			textOverflow: 'clip',
			whiteSpace: 'normal',
			wordBreak: 'break-all',
			lineHeight: 1.3,
		},
	};
}

export function chipWithLogosSx(color: string, theme: Theme): SxProps<Theme> {
	return {
		...chipSx(color, theme),
		height: 24,
		'& .MuiChip-label': {
			display: 'flex',
			alignItems: 'center',
			px: 0.7,
			overflow: 'visible',
			textOverflow: 'clip',
			whiteSpace: 'nowrap',
		},
	};
}

export const errorLogChipLogoSx: SxProps<Theme> = {
	width: 16,
	height: 16,
	borderRadius: 0.5,
	flexShrink: 0,
};

export const errorLogMessageSx: SxProps<Theme> = {
	fontSize: '0.875rem',
	lineHeight: 1.5,
	mt: 1,
	wordBreak: 'break-word',
};

export const errorLogMetaRowSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	gap: 0.6,
	mt: 1,
};

export const errorLogTimeSx: SxProps<Theme> = {
	fontSize: '0.72rem',
	color: 'text.secondary',
	fontVariantNumeric: 'tabular-nums',
};

export const errorLogOccurrencesToggleSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1,
	mt: 1,
	ml: 0.75,
	minHeight: 40,
	px: 0.75,
	borderRadius: 1.5,
	cursor: 'pointer',
	userSelect: 'none',
	'&:hover': {
		bgcolor: 'action.hover',
	},
};

export const errorLogOccurrencesListSx: SxProps<Theme> = {
	ml: 0.75,
	mt: 0.35,
	maxHeight: 240,
	overflow: 'auto',
	pr: 0.5,
};

export const errorLogOccurrenceRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	gap: 1,
	py: 0.3,
	fontSize: '0.72rem',
	fontVariantNumeric: 'tabular-nums',
	color: 'text.secondary',
};
