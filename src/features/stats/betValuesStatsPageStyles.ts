import type { SxProps, Theme } from '@mui/material';

const pagePalette = {
	dark: {
		cardBg: 'rgba(255, 255, 255, 0.04)',
		cardBorder: 'rgba(255, 255, 255, 0.08)',
		cardOpen: 'rgba(251, 191, 36, 0.08)',
		name: '#f5f5f5',
		muted: 'rgba(229, 229, 229, 0.55)',
		positive: '#4ade80',
		negative: '#f87171',
		zero: 'rgba(229, 229, 229, 0.42)',
		chipBg: 'rgba(255, 255, 255, 0.06)',
		rangeBg: 'rgba(255, 255, 255, 0.04)',
		rangeEmpty: 'rgba(255, 255, 255, 0.025)',
		barTrack: 'rgba(255, 255, 255, 0.08)',
		filterBg: 'rgba(255, 255, 255, 0.03)',
	},
	light: {
		cardBg: '#ffffff',
		cardBorder: 'rgba(15, 23, 42, 0.08)',
		cardOpen: 'rgba(251, 191, 36, 0.08)',
		name: '#171717',
		muted: 'rgba(23, 23, 23, 0.5)',
		positive: '#15803d',
		negative: '#b91c1c',
		zero: 'rgba(23, 23, 23, 0.38)',
		chipBg: 'rgba(15, 23, 42, 0.05)',
		rangeBg: 'rgba(15, 23, 42, 0.03)',
		rangeEmpty: 'rgba(15, 23, 42, 0.02)',
		barTrack: 'rgba(15, 23, 42, 0.08)',
		filterBg: 'rgba(15, 23, 42, 0.03)',
	},
} as const;

function palette(theme: Theme) {
	return theme.palette.mode === 'dark' ? pagePalette.dark : pagePalette.light;
}

export const betValuesPageSx: SxProps<Theme> = {
	width: '100%',
	maxWidth: { xs: '100%', sm: '25rem' },
	mx: 'auto',
	px: { xs: 1, sm: 0 },
	pb: 2,
};

export const betValuesFiltersSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		display: 'flex',
		flexDirection: 'column',
		gap: 1,
		mb: 1.5,
		p: 1.25,
		border: '1px solid',
		borderColor: p.cardBorder,
		borderRadius: 2.5,
		bgcolor: p.filterBg,
	};
};

export const betValuesEmptySx: SxProps<Theme> = (theme) => ({
	textAlign: 'center',
	fontWeight: 600,
	fontSize: 16,
	py: 3,
	color: palette(theme).muted,
});

export const betValuesLegendSx: SxProps<Theme> = (theme) => ({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flexWrap: 'wrap',
	columnGap: 0.75,
	rowGap: 0.35,
	mb: 1.25,
	px: 0.5,
	color: palette(theme).muted,
	fontSize: '0.72rem',
	fontWeight: 600,
	letterSpacing: 0.15,
	textAlign: 'center',
	lineHeight: 1.35,
});

export function betValuesPlayerCardSx(open: boolean): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme);
		return {
			border: '1px solid',
			borderColor: open ? 'rgba(251, 191, 36, 0.35)' : p.cardBorder,
			borderRadius: 2.5,
			bgcolor: open ? p.cardOpen : p.cardBg,
			mb: 1,
			overflow: 'hidden',
			outline: 'none',
			transition: 'border-color 0.2s ease, background-color 0.2s ease, box-shadow 0.2s ease',
			boxShadow: open
				? theme.palette.mode === 'dark'
					? '0 10px 28px rgba(0, 0, 0, 0.35)'
					: '0 10px 24px rgba(15, 23, 42, 0.1)'
				: theme.palette.mode === 'dark'
					? '0 6px 18px rgba(0, 0, 0, 0.22)'
					: '0 6px 16px rgba(15, 23, 42, 0.05)',
		};
	};
}

export const betValuesPlayerToggleSx: SxProps<Theme> = {
	cursor: 'pointer',
	outline: 'none',
	WebkitTapHighlightColor: 'transparent',
	userSelect: 'none',
};

export const betValuesPlayerRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	gap: 1.25,
	px: 1.25,
	pt: 1.25,
	pb: 1,
	minHeight: 56,
};

export const betValuesPlayerNameSx: SxProps<Theme> = (theme) => ({
	fontWeight: 700,
	fontSize: '0.95rem',
	lineHeight: 1.2,
	color: palette(theme).name,
});

export const betValuesPlayerMetaSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.75rem',
	fontWeight: 600,
	color: palette(theme).muted,
	mt: 0.25,
});

export function betValuesBalanceSx(balance: number): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme);
		return {
			fontWeight: 800,
			fontSize: '0.95rem',
			fontVariantNumeric: 'tabular-nums',
			color: balance > 0 ? p.positive : balance < 0 ? p.negative : p.zero,
			flexShrink: 0,
		};
	};
}

export const betValuesDistributionSx: SxProps<Theme> = {
	display: 'flex',
	gap: '2px',
	height: 8,
	mx: 1.25,
	mb: 1.25,
	borderRadius: 99,
	overflow: 'hidden',
};

export function betValuesDistributionSegmentSx(accent: string, share: number, empty: boolean): SxProps<Theme> {
	return (theme) => ({
		flexGrow: empty ? 0.35 : Math.max(share, 0.08),
		flexBasis: 0,
		minWidth: 4,
		bgcolor: empty ? palette(theme).barTrack : accent,
		opacity: empty ? 0.55 : 1,
	});
}

export const betValuesExpandIconSx: SxProps<Theme> = (theme) => ({
	color: palette(theme).muted,
	flexShrink: 0,
});

export function betValuesRangeRowSx(empty: boolean): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme);
		return {
			display: 'flex',
			flexDirection: 'column',
			gap: 0.5,
			px: 1.25,
			py: 1,
			mb: 0.75,
			borderRadius: 1.5,
			bgcolor: empty ? p.rangeEmpty : p.rangeBg,
			opacity: empty ? 0.55 : 1,
			border: '1px solid',
			borderColor: 'transparent',
		};
	};
}

export const betValuesRangeHeadSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'baseline',
	justifyContent: 'space-between',
	gap: 1,
};

export const betValuesRangeTitleSx: SxProps<Theme> = (theme) => ({
	fontWeight: 700,
	fontSize: '0.82rem',
	color: palette(theme).name,
});

export const betValuesRangeIntervalSx: SxProps<Theme> = (theme) => ({
	fontWeight: 700,
	fontSize: '0.72rem',
	color: palette(theme).muted,
	fontVariantNumeric: 'tabular-nums',
});

export const betValuesRangeMetaSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1,
	flexWrap: 'wrap',
};

export const betValuesWrlSx: SxProps<Theme> = (theme) => ({
	display: 'flex',
	gap: 0.75,
	fontSize: '0.72rem',
	fontWeight: 700,
	fontVariantNumeric: 'tabular-nums',
	color: palette(theme).muted,
});

export function betValuesWrlValueSx(kind: 'won' | 'returned' | 'lost' | 'winRate'): SxProps<Theme> {
	return (theme) => {
		const colors = {
			won: palette(theme).positive,
			returned: theme.palette.mode === 'dark' ? '#facc15' : '#ca8a04',
			lost: palette(theme).negative,
			winRate: theme.palette.mode === 'dark' ? '#38bdf8' : '#0284c7',
		};
		return { color: colors[kind] };
	};
}

export const betValuesWinRateTrackSx: SxProps<Theme> = (theme) => ({
	height: 4,
	borderRadius: 99,
	bgcolor: palette(theme).barTrack,
	overflow: 'hidden',
	mt: 0.25,
});

export function betValuesWinRateFillSx(winRate: number): SxProps<Theme> {
	return {
		width: `${Math.min(Math.max(winRate, 0), 100)}%`,
		height: '100%',
		borderRadius: 99,
		bgcolor: winRate >= 50 ? '#34d399' : '#fb923c',
	};
}

export const betValuesDetailsSx: SxProps<Theme> = {
	px: 1.25,
	pb: 1.25,
	cursor: 'default',
	userSelect: 'text',
};
