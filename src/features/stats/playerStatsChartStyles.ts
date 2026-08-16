import type { SxProps, Theme } from '@mui/material';
import { statsThemePalette } from './statsPageStyles';

export const playerStatsExpandBodySx: SxProps<Theme> = {
	mx: 0.75,
	mb: 1.25,
	mt: 0.25,
	textAlign: 'center',
};

export const playerOutcomesTrackSx: SxProps<Theme> = (theme) => ({
	display: 'flex',
	height: 12,
	borderRadius: 99,
	overflow: 'hidden',
	bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(15, 23, 42, 0.08)',
});

export function playerOutcomesSegmentSx(color: string, share: number): SxProps<Theme> {
	return {
		flexGrow: Math.max(share, 0.02),
		flexBasis: 0,
		minWidth: share > 0 ? 4 : 0,
		bgcolor: color,
		opacity: share > 0 ? 1 : 0,
	};
}

export const playerOutcomesLegendSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	columnGap: 1,
	rowGap: 0.35,
	mt: 0.75,
};

export function playerOutcomesLegendItemSx(color: string): SxProps<Theme> {
	return (theme) => ({
		display: 'inline-flex',
		alignItems: 'center',
		gap: 0.4,
		fontSize: '0.7rem',
		fontWeight: 700,
		fontVariantNumeric: 'tabular-nums',
		color: statsThemePalette(theme).bodyText,
		'&::before': {
			content: '""',
			width: 7,
			height: 7,
			borderRadius: '50%',
			bgcolor: color,
			flexShrink: 0,
		},
	});
}

export const playerStatsMetaRowSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	gap: 0.5,
	mt: 1,
	mb: 0.25,
};

export function playerStatsMetaChipSx(kind: 'winRate' | 'avgOdds' | 'avgWinOdds'): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const bg =
			kind === 'winRate'
				? isDark
					? 'rgba(163, 163, 163, 0.28)'
					: '#d4d4d4'
				: kind === 'avgOdds'
					? isDark
						? 'rgba(167, 139, 250, 0.28)'
						: '#ddd6fe'
					: isDark
						? 'rgba(148, 163, 184, 0.28)'
						: '#e5e7eb';
		return {
			px: 0.75,
			py: 0.35,
			borderRadius: 1,
			fontSize: '0.72rem',
			fontWeight: 700,
			fontVariantNumeric: 'tabular-nums',
			bgcolor: bg,
			color: isDark ? '#f8fafc' : '#171717',
		};
	};
}

export const playerChartToggleRowSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	return {
		display: 'flex',
		mt: 1.25,
		mb: 0.75,
		p: 0.25,
		borderRadius: 1.5,
		border: '1px solid',
		borderColor: p.surfaceBorder,
		bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(15, 23, 42, 0.04)',
	};
};

export function playerChartToggleBtnSx(active: boolean): SxProps<Theme> {
	return (theme) => {
		const p = statsThemePalette(theme);
		return {
			flex: 1,
			minHeight: 40,
			px: 1,
			py: 0,
			border: 0,
			borderRadius: 1,
			textTransform: 'none',
			fontWeight: 700,
			fontSize: '0.78rem',
			color: active ? p.name : p.bodyText,
			bgcolor: active
				? theme.palette.mode === 'dark'
					? 'rgba(255, 255, 255, 0.12)'
					: 'rgba(255, 255, 255, 0.92)'
				: 'transparent',
			boxShadow: active
				? theme.palette.mode === 'dark'
					? 'none'
					: '0 1px 3px rgba(15, 23, 42, 0.12)'
				: 'none',
			'&:hover': {
				bgcolor: active
					? theme.palette.mode === 'dark'
						? 'rgba(255, 255, 255, 0.14)'
						: 'rgba(255, 255, 255, 0.92)'
					: theme.palette.mode === 'dark'
						? 'rgba(255, 255, 255, 0.06)'
						: 'rgba(15, 23, 42, 0.04)',
			},
		};
	};
}

export const playerChartFrameSx: SxProps<Theme> = {
	position: 'relative',
	height: 120,
	width: '100%',
	touchAction: 'none',
	userSelect: 'none',
};

export const playerChartHintSx: SxProps<Theme> = (theme) => ({
	minHeight: 36,
	mt: 0.5,
	px: 0.5,
	fontSize: '0.72rem',
	fontWeight: 700,
	fontVariantNumeric: 'tabular-nums',
	lineHeight: 1.35,
	color: statsThemePalette(theme).bodyText,
});

export const playerChartEmptySx: SxProps<Theme> = (theme) => ({
	height: 120,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	px: 1,
	fontSize: '0.8rem',
	fontWeight: 600,
	color: statsThemePalette(theme).expandIconMuted,
});

export const playerChartBarRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'stretch',
	height: 120,
	width: '100%',
	gap: '1px',
};

export const playerChartBarColSx: SxProps<Theme> = {
	flex: 1,
	minWidth: 0,
	display: 'flex',
	flexDirection: 'column',
	cursor: 'pointer',
};

export function playerChartBarFillSx(positive: boolean): SxProps<Theme> {
	return (theme) => {
		const p = statsThemePalette(theme);
		return {
			width: '100%',
			minHeight: 3,
			borderRadius: 0.5,
			bgcolor: positive ? p.positive : p.negative,
			opacity: 0.9,
		};
	};
}

export const playerFormRowSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	gap: '3px',
	mt: 1.25,
	mb: 0.25,
};

export const playerFormLabelSx: SxProps<Theme> = (theme) => ({
	mt: 1.1,
	mb: 0.35,
	fontSize: '0.68rem',
	fontWeight: 700,
	letterSpacing: 0.3,
	textTransform: 'uppercase',
	color: statsThemePalette(theme).expandIconMuted,
});

export function playerFormPillSx(bg: string, fg: string): SxProps<Theme> {
	return {
		width: 22,
		height: 22,
		borderRadius: '50%',
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '0.62rem',
		fontWeight: 800,
		lineHeight: 1,
		bgcolor: bg,
		color: fg,
		flexShrink: 0,
	};
}

export const playerHighlightsGridSx: SxProps<Theme> = {
	display: 'grid',
	gridTemplateColumns: '13fr 7fr',
	gap: 0.75,
	mt: 1,
	mb: 0.25,
	textAlign: 'left',
	alignItems: 'stretch',
};

export const playerHighlightCardSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	return {
		px: 0.85,
		py: 0.7,
		borderRadius: 1.25,
		border: '1px solid',
		borderColor: p.surfaceBorder,
		bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.72)',
		minHeight: 58,
		textAlign: 'left',
	};
};

export const playerHighlightCardLabelSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.62rem',
	fontWeight: 700,
	letterSpacing: 0.2,
	textTransform: 'uppercase',
	color: statsThemePalette(theme).expandIconMuted,
	lineHeight: 1.2,
	mb: 0.25,
});

export const playerHighlightCardValueSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.82rem',
	fontWeight: 800,
	fontVariantNumeric: 'tabular-nums',
	color: statsThemePalette(theme).name,
	lineHeight: 1.25,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const playerHighlightCardHintSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.66rem',
	fontWeight: 600,
	color: statsThemePalette(theme).bodyText,
	lineHeight: 1.3,
	mt: 0.15,
});

export const playerHighlightCardClickableSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	return {
		textDecoration: 'none',
		color: 'inherit',
		display: 'block',
		cursor: 'pointer',
		transition: 'border-color 0.15s ease, background-color 0.15s ease',
		'&:hover': {
			borderColor: p.name,
			bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.07)' : 'rgba(255, 255, 255, 0.95)',
		},
	};
};

export const playerHighlightInlineRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	columnGap: 0.4,
	rowGap: 0.15,
	mt: 0.2,
	minWidth: 0,
	fontSize: '0.75rem',
	fontWeight: 600,
	lineHeight: 1.25,
};

export const playerHighlightMetaSx: SxProps<Theme> = (theme) => ({
	display: 'flex',
	flexWrap: 'wrap',
	columnGap: 0.75,
	rowGap: 0.1,
	mt: 0.2,
	fontSize: '0.64rem',
	fontWeight: 700,
	fontVariantNumeric: 'tabular-nums',
	color: statsThemePalette(theme).bodyText,
});

export const playerHighlightStreakRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	gap: 0.5,
	mt: 0.35,
	minWidth: 0,
};

export const playerHighlightLeagueSlotsSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	alignItems: 'center',
	gap: 0.45,
	mt: 0.3,
};

export const playerHighlightLeagueSlotSx: SxProps<Theme> = (theme) => ({
	display: 'inline-flex',
	alignItems: 'center',
	gap: 0.25,
	fontSize: '0.62rem',
	fontWeight: 700,
	fontVariantNumeric: 'tabular-nums',
	color: statsThemePalette(theme).bodyText,
});

export const playerHighlightTeamBlockSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	mt: 0.15,
	minWidth: 0,
};

export const playerHighlightLeaguePairSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		gap: 0.5,
		py: 0.5,
		'&:not(:last-child)::after': {
			content: '""',
			position: 'absolute',
			left: 4,
			right: 4,
			bottom: 0,
			height: '1px',
			background: isDark
				? 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.2) 80%, transparent 100%)'
				: 'linear-gradient(90deg, transparent 0%, rgba(15, 23, 42, 0.14) 20%, rgba(15, 23, 42, 0.14) 80%, transparent 100%)',
		},
	};
};

export const playerHighlightTeamRowsSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 0.15,
	minWidth: 0,
	flex: 1,
};

export const playerHighlightTeamRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	gap: 0.3,
	minWidth: 0,
};

