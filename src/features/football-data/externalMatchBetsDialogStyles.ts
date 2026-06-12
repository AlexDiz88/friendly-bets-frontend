import type { SxProps, Theme } from '@mui/material';
import { keyframes } from '@mui/system';

const palette = (mode: 'light' | 'dark') => {
	if (mode === 'dark') {
		return {
			surface: '#0b1424',
			glass: 'rgba(11, 20, 36, 0.94)',
			card: 'rgba(13, 20, 30, 0.72)',
			text: '#e8f5ef',
			textMuted: 'rgba(157, 232, 196, 0.72)',
			green: '#9de8c4',
			gold: '#ffd966',
			goldBorder: 'rgba(255, 214, 0, 0.28)',
			divider: 'rgba(0, 200, 120, 0.14)',
			oddsBg: 'linear-gradient(135deg, #003322 0%, #005a38 100%)',
			oddsBorder: 'rgba(255, 214, 0, 0.22)',
			pick: '#9de8c4',
		};
	}
	return {
		surface: '#e8f4ef',
		glass: 'rgba(255, 255, 255, 0.96)',
		card: 'rgba(255, 255, 255, 0.92)',
		text: '#1a3d2e',
		textMuted: '#5a7a68',
		green: '#046a3d',
		gold: '#8b6914',
		goldBorder: 'rgba(184, 134, 11, 0.32)',
		divider: 'rgba(4, 90, 55, 0.1)',
		oddsBg: 'linear-gradient(135deg, #034d2e 0%, #046a3d 100%)',
		oddsBorder: 'rgba(184, 134, 11, 0.35)',
		pick: '#0a5c38',
	};
};

/** Мягкое наружное свечение градиентной рамки (::before). */
const matchBetsYouBorderPulseDark = keyframes`
	0%, 100% {
		opacity: 0.58;
		filter: drop-shadow(0 0 3px rgba(255, 214, 0, 0.22)) drop-shadow(0 0 7px rgba(255, 214, 0, 0.12));
	}
	50% {
		opacity: 0.95;
		filter: drop-shadow(0 0 6px rgba(255, 214, 0, 0.45)) drop-shadow(0 0 14px rgba(255, 214, 0, 0.22));
	}
`;

const matchBetsYouBorderPulseLight = keyframes`
	0%, 100% {
		opacity: 0.62;
		filter: drop-shadow(0 0 2px rgba(184, 134, 11, 0.2)) drop-shadow(0 0 6px rgba(184, 134, 11, 0.1));
	}
	50% {
		opacity: 1;
		filter: drop-shadow(0 0 5px rgba(184, 134, 11, 0.38)) drop-shadow(0 0 12px rgba(184, 134, 11, 0.18));
	}
`;

const MATCH_BETS_ROW_BORDER_PX = 1;

function youRowGlassBackground(
	theme: Theme,
	statusTint: 'won' | 'lost' | 'returned' | null
): string {
	const isDark = theme.palette.mode === 'dark';
	const tint = statusTint ? statusRowTint(theme, statusTint) : palette(theme.palette.mode).card;
	if (isDark) {
		return `linear-gradient(145deg, rgba(255, 255, 255, 0.11) 0%, rgba(255, 255, 255, 0.02) 38%, rgba(255, 214, 0, 0.05) 100%), linear-gradient(180deg, ${tint} 0%, rgba(11, 20, 36, 0.52) 100%)`;
	}
	return `linear-gradient(145deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.55) 42%, rgba(255, 248, 220, 0.35) 100%), linear-gradient(180deg, ${tint} 0%, rgba(232, 244, 239, 0.55) 100%)`;
}

function youRowBorderGradient(isDark: boolean): string {
	if (isDark) {
		return 'linear-gradient(135deg, rgba(255, 236, 160, 0.92) 0%, rgba(255, 214, 0, 0.55) 32%, rgba(157, 232, 196, 0.5) 68%, rgba(255, 214, 0, 0.72) 100%)';
	}
	return 'linear-gradient(135deg, rgba(212, 160, 23, 0.88) 0%, rgba(184, 134, 11, 0.62) 35%, rgba(4, 106, 61, 0.45) 68%, rgba(184, 134, 11, 0.78) 100%)';
}

const statusRowTint = (
	theme: Theme,
	status: 'won' | 'lost' | 'returned'
): string => {
	const isDark = theme.palette.mode === 'dark';
	if (status === 'won') {
		return isDark ? 'rgba(34, 197, 94, 0.14)' : 'rgba(220, 252, 231, 0.92)';
	}
	if (status === 'lost') {
		return isDark ? 'rgba(239, 68, 68, 0.12)' : 'rgba(254, 242, 242, 0.95)';
	}
	return isDark ? 'rgba(250, 204, 21, 0.1)' : 'rgba(254, 249, 195, 0.88)';
};

export const externalMatchBetsDialogPaperSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		borderRadius: 2.5,
		overflow: 'hidden',
		maxWidth: 380,
		width: '100%',
		mx: 1,
		display: 'flex',
		flexDirection: 'column',
		maxHeight: 'min(90vh, 560px)',
		bgcolor: isDark ? '#0b1424' : '#e8f4ef',
		backgroundImage: isDark
			? 'radial-gradient(ellipse 100% 70% at 50% -10%, rgba(0, 107, 66, 0.24) 0%, transparent 55%)'
			: 'radial-gradient(ellipse 100% 70% at 50% -10%, rgba(0, 168, 107, 0.12) 0%, transparent 55%), linear-gradient(180deg, #e8f4ef 0%, #f5f7fa 100%)',
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 214, 0, 0.2)' : 'rgba(184, 134, 11, 0.28)',
		boxShadow: isDark
			? '0 16px 48px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 214, 0, 0.08)'
			: '0 12px 36px rgba(4, 90, 55, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
	};
};

export const externalMatchBetsDialogHeaderSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		flexShrink: 0,
		px: 1.75,
		pt: 1.5,
		pb: 1.25,
		borderBottom: '1px solid',
		borderColor: p.divider,
		bgcolor: p.glass,
		backdropFilter: 'blur(12px)',
	};
};

export const externalMatchBetsDialogOverlineSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const line = isDark
		? 'linear-gradient(90deg, transparent, rgba(255, 214, 0, 0.5), transparent)'
		: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.45), transparent)';
	return {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 0.75,
		mb: 0.75,
		'&::before, &::after': {
			content: '""',
			flex: 1,
			height: 1,
			maxWidth: 28,
			background: line,
		},
	};
};

export const externalMatchBetsDialogOverlineTextSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		fontSize: '0.82rem',
		fontWeight: 800,
		textAlign: 'center',
		textTransform: 'none',
		lineHeight: 1.25,
		background: isDark
			? 'linear-gradient(120deg, #9de8c4 0%, #ffd700 55%, #9de8c4 100%)'
			: 'linear-gradient(120deg, #034d2e 0%, #8b6914 55%, #046a3d 100%)',
		backgroundClip: 'text',
		WebkitBackgroundClip: 'text',
		color: 'transparent',
	};
};

export const externalMatchBetsDialogTeamsRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: { xs: 0.5, sm: 0.75 },
	width: '100%',
};

export const externalMatchBetsDialogTeamSideSx: SxProps<Theme> = {
	flex: 1,
	minWidth: 0,
	display: 'flex',
	alignItems: 'center',
};

export const externalMatchBetsDialogTeamSideHomeSx: SxProps<Theme> = {
	...externalMatchBetsDialogTeamSideSx,
	justifyContent: 'flex-end',
};

export const externalMatchBetsDialogTeamSideAwaySx: SxProps<Theme> = {
	...externalMatchBetsDialogTeamSideSx,
	justifyContent: 'flex-start',
};

export const externalMatchBetsDialogTeamLogoSx: SxProps<Theme> = {
	width: 24,
	height: 24,
	flexShrink: 0,
	borderRadius: 0.5,
	border: '1px solid',
	borderColor: 'divider',
	bgcolor: 'background.paper',
};

export const externalMatchBetsDialogTeamNameSx: SxProps<Theme> = (theme) => ({
	minWidth: 0,
	fontSize: '0.72rem',
	fontWeight: 700,
	lineHeight: 1.2,
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
	color: theme.palette.mode === 'dark' ? '#8fd4b0' : '#0a5c38',
});

export const externalMatchBetsDialogScoreSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	fontWeight: 800,
	fontSize: '1.05rem',
	fontVariantNumeric: 'tabular-nums',
	lineHeight: 1,
	px: 0.5,
	color: theme.palette.mode === 'dark' ? '#ffe566' : '#a16207',
	textShadow:
		theme.palette.mode === 'dark' ? '0 0 10px rgba(255, 230, 102, 0.25)' : 'none',
});

export const externalMatchBetsDialogCountSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		mt: 0.85,
		textAlign: 'center',
		fontSize: '0.65rem',
		fontWeight: 700,
		color: p.textMuted,
		lineHeight: 1.2,
	};
};

export const externalMatchBetsDialogBodySx: SxProps<Theme> = {
	flex: 1,
	minHeight: 0,
	overflow: 'hidden',
	display: 'flex',
	flexDirection: 'column',
	px: 1.25,
	py: 1,
};

export const externalMatchBetsDialogListSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 0.45,
	flex: 1,
	minHeight: 0,
	overflowY: 'auto',
	overflowX: 'hidden',
	pr: 0.25,
	'&::-webkit-scrollbar': { width: 4 },
	'&::-webkit-scrollbar-thumb': {
		borderRadius: 4,
		bgcolor: 'rgba(0, 130, 75, 0.35)',
	},
};

export function externalMatchBetsDialogRowSx(
	isYou: boolean,
	statusTint: 'won' | 'lost' | 'returned' | null
): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme.palette.mode);
		const isDark = theme.palette.mode === 'dark';
		let bgcolor = p.card;
		if (statusTint) {
			bgcolor = statusRowTint(theme, statusTint);
		}

		const baseRow = {
			display: 'grid',
			gridTemplateColumns: 'auto minmax(0, 34%) minmax(0, 1fr) auto',
			alignItems: 'center',
			gap: 0.55,
			px: 0.75,
			py: 0.45,
			borderRadius: 1.25,
			boxSizing: 'border-box',
			border: `${MATCH_BETS_ROW_BORDER_PX}px solid`,
		};

		if (!isYou) {
			return {
				...baseRow,
				borderColor: p.divider,
				bgcolor,
			};
		}

		return {
			...baseRow,
			position: 'relative',
			isolation: 'isolate',
			borderColor: p.divider,
			background: youRowGlassBackground(theme, statusTint),
			backgroundClip: 'padding-box',
			backdropFilter: 'blur(12px) saturate(1.15)',
			WebkitBackdropFilter: 'blur(12px) saturate(1.15)',
			boxShadow: isDark
				? 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
				: 'inset 0 1px 0 rgba(255, 255, 255, 0.75)',
			'&::before': {
				content: '""',
				position: 'absolute',
				inset: `-${MATCH_BETS_ROW_BORDER_PX}px`,
				borderRadius: 'inherit',
				padding: `${MATCH_BETS_ROW_BORDER_PX}px`,
				background: youRowBorderGradient(isDark),
				WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
				WebkitMaskComposite: 'xor',
				maskComposite: 'exclude',
				pointerEvents: 'none',
				zIndex: 1,
				animation: `${isDark ? matchBetsYouBorderPulseDark : matchBetsYouBorderPulseLight} 3s ease-in-out infinite`,
			},
			'&::after': {
				content: '""',
				position: 'absolute',
				top: `-${MATCH_BETS_ROW_BORDER_PX}px`,
				left: '10%',
				right: '10%',
				height: '1px',
				background: isDark
					? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.22), transparent)'
					: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.85), transparent)',
				pointerEvents: 'none',
				zIndex: 1,
			},
			'& > *': {
				position: 'relative',
				zIndex: 2,
			},
		};
	};
}

export const externalMatchBetsDialogPickCellSx: SxProps<Theme> = {
	minWidth: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'flex-end',
	gap: 0.45,
};

export const externalMatchBetsDialogPlayerSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		minWidth: 0,
		fontSize: '0.72rem',
		fontWeight: 700,
		lineHeight: 1.2,
		color: p.text,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	};
};

export const externalMatchBetsDialogPickSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		minWidth: 0,
		fontSize: '0.68rem',
		fontWeight: 600,
		lineHeight: 1.2,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		color: p.pick,
	};
};

export const externalMatchBetsDialogOddsSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		flexShrink: 0,
		fontSize: '0.65rem',
		fontWeight: 800,
		fontVariantNumeric: 'tabular-nums',
		lineHeight: 1,
		px: 0.55,
		py: 0.25,
		borderRadius: 1,
		color: '#fff8e7',
		background: p.oddsBg,
		border: '1px solid',
		borderColor: p.oddsBorder,
	};
};

export const externalMatchBetsDialogStatusCellSx: SxProps<Theme> = {
	width: 18,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexShrink: 0,
};

export const externalMatchBetsDialogEmptySx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		textAlign: 'center',
		fontSize: '0.75rem',
		fontWeight: 600,
		lineHeight: 1.35,
		color: p.textMuted,
		py: 2,
		px: 1,
	};
};

export const externalMatchBetsDialogLoadingSx: SxProps<Theme> = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	flex: 1,
	py: 3,
};

export const externalMatchBetsDialogFooterSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		flexShrink: 0,
		px: 1.25,
		pt: 0.5,
		pb: 1.25,
		borderTop: '1px solid',
		borderColor: p.divider,
		display: 'flex',
		justifyContent: 'center',
		bgcolor: p.glass,
	};
};
