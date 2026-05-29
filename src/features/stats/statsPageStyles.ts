import type { SxProps, Theme } from '@mui/material';

const statsPalette = {
	dark: {
		headBg: 'linear-gradient(90deg, #0a0a0a 0%, #1f1f1f 48%, #0a0a0a 100%)',
		headText: '#f5f5f5',
		headBorder: 'rgba(255, 255, 255, 0.12)',
		rowHover: 'rgba(255, 255, 255, 0.05)',
		rowOpen: 'rgba(255, 255, 255, 0.08)',
		rowBorder: 'rgba(255, 255, 255, 0.06)',
		bodyBg: 'rgba(255, 255, 255, 0.04)',
		collapseCellBg: 'rgba(255, 255, 255, 0.04)',
		surfaceBorder: 'rgba(255, 255, 255, 0.07)',
		expandIcon: '#e5e5e5',
		expandIconMuted: 'rgba(229, 229, 229, 0.45)',
		name: '#f5f5f5',
		bodyText: '#d4d4d4',
		positive: '#4ade80',
		negative: '#f87171',
		ribbonBg: 'linear-gradient(90deg, #1a1a1a 0%, #262626 50%, #1a1a1a 100%)',
		ribbonBorder: 'rgba(255, 255, 255, 0.12)',
		ribbonText: '#e5e5e5',
	},
	light: {
		headBg: 'linear-gradient(90deg, #171717 0%, #2d2d32 50%, #171717 100%)',
		headText: '#ffffff',
		headBorder: 'rgba(0, 0, 0, 0.2)',
		rowHover: 'rgba(0, 0, 0, 0.04)',
		rowOpen: 'rgba(0, 0, 0, 0.06)',
		rowBorder: 'rgba(0, 0, 0, 0.06)',
		bodyBg: '#f7f7f7',
		collapseCellBg: '#f7f7f7',
		surfaceBorder: 'rgba(0, 0, 0, 0.07)',
		expandIcon: '#404040',
		expandIconMuted: 'rgba(64, 64, 64, 0.45)',
		name: '#171717',
		bodyText: '#262626',
		positive: '#15803d',
		negative: '#b91c1c',
		ribbonBg: 'linear-gradient(90deg, #e5e5e5 0%, #f5f5f5 50%, #e5e5e5 100%)',
		ribbonBorder: 'rgba(0, 0, 0, 0.12)',
		ribbonText: '#171717',
	},
} as const;

export type StatsDetailKind =
	| 'total'
	| 'won'
	| 'returned'
	| 'lost'
	| 'empty'
	| 'winRate'
	| 'avgOdds'
	| 'avgWinOdds';

const detailCellColors: Record<
	StatsDetailKind,
	{ dark: string; light: string }
> = {
	total: { dark: 'rgba(148, 163, 184, 0.22)', light: '#e5e5e5' },
	won: { dark: 'rgba(34, 197, 94, 0.28)', light: '#bbf7d0' },
	returned: { dark: 'rgba(250, 204, 21, 0.22)', light: '#fef08a' },
	lost: { dark: 'rgba(248, 113, 113, 0.28)', light: '#fecaca' },
	empty: { dark: 'rgba(148, 163, 184, 0.18)', light: '#e5e7eb' },
	winRate: { dark: 'rgba(163, 163, 163, 0.28)', light: '#d4d4d4' },
	avgOdds: { dark: 'rgba(167, 139, 250, 0.28)', light: '#ddd6fe' },
	avgWinOdds: { dark: 'rgba(148, 163, 184, 0.28)', light: '#e5e7eb' },
};

function palette(theme: Theme) {
	return theme.palette.mode === 'dark' ? statsPalette.dark : statsPalette.light;
}

/** Палитра главной (таблица статистики) — для страницы ставок и др. */
export function statsThemePalette(theme: Theme) {
	return palette(theme);
}

export const statsTableContainerSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		mx: '0.5px',
		bgcolor: p.bodyBg,
		boxShadow: 'none',
		borderRadius: 2,
		overflow: 'hidden',
		border: '1px solid',
		borderColor: p.surfaceBorder,
		backgroundImage: 'none',
	};
};

export const statsTableHeadSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		background: p.headBg,
		borderBottom: '2px solid',
		borderColor: p.headBorder,
		boxShadow: theme.palette.mode === 'dark' ? '0 2px 12px rgba(0,0,0,0.45)' : '0 2px 8px rgba(0,0,0,0.12)',
	};
};

export const statsTableHeadCellSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		color: p.headText,
		fontWeight: 700,
		fontSize: '0.8rem',
		textTransform: 'none',
		letterSpacing: 0.2,
		py: 0.75,
		borderColor: 'transparent',
		textShadow: theme.palette.mode === 'dark' ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
	};
};

export const statsTableBodySx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		background: p.bodyBg,
		color: p.bodyText,
		'& .MuiTableRow-root:not(:last-child) .MuiTableCell-root': {
			borderBottom: '1px solid',
			borderColor: p.rowBorder,
		},
	};
};

export const statsBodyDataCellSx: SxProps<Theme> = (theme) => ({
	color: palette(theme).bodyText,
	fontVariantNumeric: 'tabular-nums',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
});

/** Numeric columns — minimal horizontal padding only */
export const statsNumericCellSx: SxProps<Theme> = (theme) => ({
	color: palette(theme).bodyText,
	fontVariantNumeric: 'tabular-nums',
	verticalAlign: 'middle',
	whiteSpace: 'nowrap',
	px: 0.5,
	py: 0.5,
});

export const statsBetsCellSx = statsNumericCellSx;
export const statsPercentCellSx = statsNumericCellSx;
export const statsBalanceCellSx = statsNumericCellSx;

export const statsCollapseRowCellSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		py: 0,
		borderTop: 0,
		borderBottom: 'none',
		bgcolor: p.collapseCellBg,
	};
};

export function statsExpandableRowSx(open: boolean): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme);
		return {
			'& > *': { borderBottom: 'unset' },
			cursor: 'pointer',
			userSelect: 'none',
			WebkitTapHighlightColor: 'transparent',
			transition: 'background-color 0.25s ease',
			bgcolor: 'transparent',
			'&:hover': {
				bgcolor: open ? 'transparent' : p.rowHover,
			},
		};
	};
}

export function statsExpandIconSx(open: boolean): SxProps<Theme> {
	return (theme) => ({
		fontSize: 24,
		color: open ? palette(theme).expandIcon : palette(theme).expandIconMuted,
		transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
		transition: 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
	});
}

export const statsPlayerNameSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.9rem',
	fontWeight: 600,
	color: palette(theme).name,
});

export const statsBalancePositiveSx: SxProps<Theme> = (theme) => ({
	fontSize: '1rem',
	fontWeight: 700,
	color: palette(theme).positive,
	fontVariantNumeric: 'tabular-nums',
});

export const statsBalanceNegativeSx: SxProps<Theme> = (theme) => ({
	fontSize: '1rem',
	fontWeight: 700,
	color: palette(theme).negative,
	fontVariantNumeric: 'tabular-nums',
});

export const statsExpandedTitleSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		fontSize: '1rem',
		fontWeight: 800,
		mb: 0.75,
		mt: 0.5,
		py: 0.5,
		px: 1,
		textTransform: 'none',
		textAlign: 'center',
		color: p.ribbonText,
		border: '1px solid',
		borderColor: p.ribbonBorder,
		borderRadius: 1,
		background: p.ribbonBg,
		boxShadow: theme.palette.mode === 'dark' ? 'inset 0 1px 0 rgba(255,255,255,0.05)' : 'inset 0 1px 0 rgba(255,255,255,0.9)',
	};
};

export function statsDetailValueSx(kind: StatsDetailKind): SxProps<Theme> {
	return (theme) => {
		const c = detailCellColors[kind];
		return {
			px: 1,
			py: 0.5,
			fontWeight: 700,
			bgcolor: theme.palette.mode === 'dark' ? c.dark : c.light,
			color: theme.palette.mode === 'dark' ? '#f8fafc' : '#171717',
			borderRadius: 0.5,
		};
	};
}

export function statsLeadingSx(expanded: boolean): SxProps<Theme> {
	return (theme) => ({
		color: expanded ? palette(theme).expandIcon : palette(theme).expandIconMuted,
	});
}

export function statsIdentityCellSx(_expanded: boolean): SxProps<Theme> {
	return {
		bgcolor: 'transparent',
	};
}

export const statsExpandedRingSx: SxProps<Theme> = (theme) => ({
	'&::after': {
		borderColor: theme.palette.mode === 'dark' ? '#a3a3a3' : '#52525b',
		boxShadow:
			theme.palette.mode === 'dark'
				? '0 0 12px rgba(255, 255, 255, 0.12)'
				: '0 0 10px rgba(0, 0, 0, 0.15)',
	},
});
