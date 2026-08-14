import type { SxProps, Theme } from '@mui/material';

export const LEAGUE_ACCENT: Record<string, string> = {
	EPL: '#3d195b',
	BL: '#d20515',
	CL: '#1d4ed8',
	LE: '#ea580c',
	EC: '#1d4ed8',
	WC: '#0f766e',
};

export function leagueAccent(leagueCode: string | undefined): string {
	if (!leagueCode) {
		return '#0f766e';
	}
	return LEAGUE_ACCENT[leagueCode] ?? '#0f766e';
}

const pagePalette = {
	dark: {
		cardBg: 'rgba(255, 255, 255, 0.04)',
		cardBorder: 'rgba(255, 255, 255, 0.08)',
		headBg: 'rgba(15, 118, 110, 0.22)',
		headText: '#f5f5f5',
		stickyBg: '#141414',
		rowAlt: 'rgba(255, 255, 255, 0.03)',
		rowHover: 'rgba(255, 255, 255, 0.06)',
		name: '#f5f5f5',
		muted: 'rgba(229, 229, 229, 0.55)',
		positive: '#4ade80',
		negative: '#f87171',
		zero: 'rgba(229, 229, 229, 0.42)',
		chipBg: 'rgba(255, 255, 255, 0.06)',
		rankBg: 'rgba(255, 255, 255, 0.08)',
		rankText: '#e5e5e5',
	},
	light: {
		cardBg: '#ffffff',
		cardBorder: 'rgba(15, 23, 42, 0.08)',
		headBg: 'rgba(15, 118, 110, 0.1)',
		headText: '#134e4a',
		stickyBg: '#ffffff',
		rowAlt: 'rgba(15, 118, 110, 0.035)',
		rowHover: 'rgba(15, 118, 110, 0.08)',
		name: '#171717',
		muted: 'rgba(23, 23, 23, 0.5)',
		positive: '#15803d',
		negative: '#b91c1c',
		zero: 'rgba(23, 23, 23, 0.38)',
		chipBg: 'rgba(15, 23, 42, 0.05)',
		rankBg: 'rgba(15, 23, 42, 0.06)',
		rankText: '#334155',
	},
} as const;

function palette(theme: Theme) {
	return theme.palette.mode === 'dark' ? pagePalette.dark : pagePalette.light;
}

export const leaguesStatsPageSx: SxProps<Theme> = {
	width: '100%',
	maxWidth: { xs: '100%', sm: '25rem' },
	mx: 'auto',
	px: { xs: 1, sm: 0 },
	pb: 2,
};

export const leaguesStatsSeasonSelectSx: SxProps<Theme> = {
	mb: 1.5,
};

export const leaguesStatsSectionSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		border: '1px solid',
		borderColor: p.cardBorder,
		borderRadius: 2.5,
		bgcolor: p.cardBg,
		overflow: 'hidden',
		mb: 1.5,
		boxShadow:
			theme.palette.mode === 'dark'
				? '0 8px 24px rgba(0, 0, 0, 0.28)'
				: '0 8px 20px rgba(15, 23, 42, 0.06)',
	};
};

export const leaguesStatsSectionTitleSx: SxProps<Theme> = (theme) => ({
	px: 1.25,
	pt: 1.1,
	pb: 0.75,
	fontWeight: 800,
	fontSize: '0.82rem',
	letterSpacing: 0.2,
	color: palette(theme).headText,
});

export const leaguesMatrixScrollSx: SxProps<Theme> = {
	overflowX: 'auto',
	WebkitOverflowScrolling: 'touch',
};

export const leaguesMatrixTableSx: SxProps<Theme> = {
	minWidth: '100%',
	tableLayout: 'fixed',
	borderCollapse: 'separate',
	borderSpacing: 0,
};

function matrixHeadCell(theme: Theme) {
	const p = palette(theme);
	return {
		py: 0.6,
		px: 0.25,
		borderBottom: '1px solid',
		borderColor: p.cardBorder,
		bgcolor: p.headBg,
		color: p.headText,
		fontWeight: 700,
		fontSize: '0.65rem',
		lineHeight: 1.1,
		textAlign: 'center' as const,
	};
}

export const leaguesMatrixHeadCellSx: SxProps<Theme> = (theme) => matrixHeadCell(theme);

export const leaguesMatrixStickyHeadSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		...matrixHeadCell(theme),
		position: 'sticky',
		left: 0,
		zIndex: 3,
		textAlign: 'left',
		pl: 1,
		bgcolor: p.headBg,
		minWidth: 84,
		width: 84,
		boxShadow: theme.palette.mode === 'dark' ? '4px 0 8px rgba(0,0,0,0.25)' : '4px 0 8px rgba(15,23,42,0.06)',
	};
};

export const leaguesMatrixStickyCellSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		position: 'sticky',
		left: 0,
		zIndex: 2,
		pl: 1,
		pr: 0.5,
		py: 0.45,
		minWidth: 84,
		width: 84,
		bgcolor: p.stickyBg,
		borderBottom: '1px solid',
		borderColor: p.cardBorder,
		boxShadow: theme.palette.mode === 'dark' ? '4px 0 8px rgba(0,0,0,0.25)' : '4px 0 8px rgba(15,23,42,0.06)',
	};
};

export const leaguesMatrixBodyCellSx: SxProps<Theme> = (theme) => ({
	py: 0.45,
	px: 0.2,
	textAlign: 'center',
	borderBottom: '1px solid',
	borderColor: palette(theme).cardBorder,
	fontVariantNumeric: 'tabular-nums',
	fontSize: '0.72rem',
	fontWeight: 700,
	whiteSpace: 'nowrap',
});

export function leaguesMatrixRowSx(alt: boolean): SxProps<Theme> {
	return (theme) => ({
		bgcolor: alt ? palette(theme).rowAlt : 'transparent',
		'&:hover': {
			bgcolor: palette(theme).rowHover,
		},
	});
}

export const leaguesMatrixPlayerNameSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.72rem',
	fontWeight: 600,
	color: palette(theme).name,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	minWidth: 0,
});

export function leaguesBalanceColorSx(value: number): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme);
		return {
			color: value > 0 ? p.positive : value < 0 ? p.negative : p.zero,
		};
	};
}

export const leaderboardListSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 0.75,
	px: 1,
	pb: 1.25,
};

export function leaderboardCardSx(expanded: boolean, accent: string): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme);
		return {
			borderRadius: 2,
			border: '1px solid',
			borderColor: expanded ? accent : p.cardBorder,
			bgcolor: expanded
				? theme.palette.mode === 'dark'
					? 'rgba(255,255,255,0.05)'
					: 'rgba(255,255,255,0.9)'
				: 'transparent',
			boxShadow: expanded ? `inset 3px 0 0 ${accent}` : 'none',
			cursor: 'pointer',
			userSelect: 'none',
			WebkitTapHighlightColor: 'transparent',
			transition: 'border-color 0.2s ease, background-color 0.2s ease',
			'&:hover': {
				borderColor: accent,
				bgcolor: p.rowHover,
			},
		};
	};
}

export const leaderboardRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	gap: 0.75,
	px: 1,
	py: 0.85,
	minHeight: 52,
};

export function leaderboardRankSx(place: number): SxProps<Theme> {
	const medal =
		place === 1 ? '#eab308' : place === 2 ? '#94a3b8' : place === 3 ? '#d97706' : undefined;
	return (theme) => ({
		flexShrink: 0,
		width: 26,
		height: 26,
		borderRadius: '50%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '0.72rem',
		fontWeight: 800,
		color: medal ? '#111827' : palette(theme).rankText,
		bgcolor: medal ?? palette(theme).rankBg,
		boxShadow: medal ? `0 0 0 1px ${medal}` : 'none',
	});
}

export const leaderboardNameSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.88rem',
	fontWeight: 700,
	lineHeight: 1.2,
	color: palette(theme).name,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const leaderboardMetaSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.68rem',
	fontWeight: 600,
	color: palette(theme).muted,
	lineHeight: 1.2,
});

export const leaderboardBalanceSx: SxProps<Theme> = {
	fontSize: '0.95rem',
	fontWeight: 800,
	fontVariantNumeric: 'tabular-nums',
	whiteSpace: 'nowrap',
	lineHeight: 1.1,
};

export const leaderboardChipsGridSx: SxProps<Theme> = {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	gap: 0.5,
	px: 1,
	pb: 1,
};

export const leaderboardChipSx: SxProps<Theme> = (theme) => ({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	gap: 0.15,
	px: 0.5,
	py: 0.55,
	borderRadius: 1.25,
	bgcolor: palette(theme).chipBg,
	minHeight: 40,
});

export const leaderboardChipLabelSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.62rem',
	fontWeight: 600,
	color: palette(theme).muted,
	textAlign: 'center',
	lineHeight: 1.15,
});

export const leaderboardChipValueSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.82rem',
	fontWeight: 800,
	color: palette(theme).name,
	fontVariantNumeric: 'tabular-nums',
});

export function leaderboardExpandIconSx(open: boolean): SxProps<Theme> {
	return (theme) => ({
		fontSize: 22,
		flexShrink: 0,
		color: open ? palette(theme).name : palette(theme).muted,
		transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
		transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.2s ease',
	});
}
