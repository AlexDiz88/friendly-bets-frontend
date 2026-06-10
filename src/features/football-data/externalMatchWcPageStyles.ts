import type { SxProps, Theme } from '@mui/material';
import { APP_MAIN_MIN_HEIGHT } from '../../components/header/headerLayout';

/** Фон страницы «Результаты матчей» при выбранной лиге ЧМ (green+gold, как wc26). */
export const externalMatchWcPageRootSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		borderRadius: { xs: 0, sm: 2.5 },
		px: { xs: 0.5, sm: 1 },
		py: { xs: 0.5, sm: 1 },
		background: isDark
			? 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 120, 80, 0.22) 0%, transparent 55%), linear-gradient(180deg, #0b1424 0%, #0d1117 100%)'
			: 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 168, 107, 0.12) 0%, transparent 55%), linear-gradient(180deg, #e8f4ef 0%, #f5f7fa 40%)',
	};
};

export const externalMatchWcHeaderPanelSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 214, 0, 0.18)' : 'rgba(184, 134, 11, 0.28)',
		bgcolor: isDark ? 'rgba(11, 20, 36, 0.88)' : 'rgba(255, 255, 255, 0.82)',
		backdropFilter: 'blur(12px)',
		WebkitBackdropFilter: 'blur(12px)',
		boxShadow: isDark
			? '0 8px 24px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 214, 0, 0.08)'
			: '0 8px 24px rgba(13, 31, 60, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
	};
};

export const externalMatchWcOverlineSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const line = isDark
		? 'linear-gradient(90deg, transparent, rgba(255, 214, 0, 0.55), transparent)'
		: 'linear-gradient(90deg, transparent, rgba(184, 134, 11, 0.55), transparent)';
	return {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 1,
		mb: 0.35,
		'&::before, &::after': {
			content: '""',
			flex: 1,
			height: 1,
			maxWidth: 48,
			background: line,
		},
	};
};

export const externalMatchWcOverlineTextSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.625rem',
	fontWeight: 700,
	letterSpacing: '0.14em',
	textTransform: 'uppercase',
	color: theme.palette.mode === 'dark' ? '#ffd966' : '#8b6914',
	lineHeight: 1.2,
});

export const externalMatchWcTitleSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		fontWeight: 800,
		textAlign: 'center',
		fontSize: '1.05rem',
		lineHeight: 1.2,
		textTransform: 'none',
		background: isDark
			? 'linear-gradient(120deg, #9de8c4 0%, #ffd700 50%, #9de8c4 100%)'
			: 'linear-gradient(120deg, #034d2e 0%, #8b6914 50%, #046a3d 100%)',
		backgroundClip: 'text',
		WebkitBackgroundClip: 'text',
		color: 'transparent',
		filter: isDark ? 'drop-shadow(0 1px 8px rgba(0, 200, 120, 0.2))' : 'none',
	};
};

/** Колонка страницы ЧМ: вся высота main без вертикального скролла страницы */
export const externalMatchWcPageColumnSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	height: APP_MAIN_MIN_HEIGHT,
	maxHeight: APP_MAIN_MIN_HEIGHT,
	overflow: 'hidden',
	boxSizing: 'border-box',
};

export const externalMatchWcHeaderCompactSx: SxProps<Theme> = {
	mb: 0.75,
	pb: 0.35,
	pt: 0.15,
};

export const externalMatchWcMatchListSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		borderRadius: 2,
		border: '1px solid',
		borderColor: isDark ? 'rgba(0, 200, 120, 0.22)' : 'rgba(4, 90, 55, 0.18)',
		bgcolor: isDark ? 'rgba(13, 20, 30, 0.72)' : 'rgba(255, 255, 255, 0.88)',
		backdropFilter: 'blur(8px)',
		WebkitBackdropFilter: 'blur(8px)',
		boxShadow: isDark
			? '0 6px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 214, 0, 0.06)'
			: '0 6px 18px rgba(4, 90, 55, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
		overflow: 'hidden',
	};
};

/** Панель матчей: растягивается на оставшуюся высоту */
export const externalMatchWcMatchPanelSx: SxProps<Theme> = {
	flex: 1,
	minHeight: 0,
	display: 'flex',
	flexDirection: 'column',
	px: 0.5,
	py: 0.5,
};

export function externalMatchWcMatchGridSx(matchCount: number): SxProps<Theme> {
	const rows = Math.max(matchCount, 1);
	return {
		flex: 1,
		minHeight: 0,
		display: 'grid',
		gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
		alignContent: 'stretch',
		overflow: 'hidden',
	};
}

export const externalMatchWcSlotHeaderWrapSx: SxProps<Theme> = {
	flexShrink: 0,
	px: 0.25,
	pb: 0.35,
};

export const externalMatchWcBetsQuotaSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const full = isDark ? '#5eead4' : '#047857';
	const empty = isDark ? 'rgba(157, 232, 196, 0.22)' : 'rgba(4, 90, 55, 0.14)';
	return {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 1,
		px: 0.75,
		py: 0.45,
		mb: 0.35,
		borderRadius: 1.25,
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 214, 0, 0.2)' : 'rgba(184, 134, 11, 0.28)',
		background: isDark
			? 'linear-gradient(90deg, rgba(0,75,48,0.35) 0%, rgba(100,75,0,0.22) 100%)'
			: 'linear-gradient(90deg, rgba(236,253,245,0.95) 0%, rgba(240,232,200,0.9) 100%)',
		'& .wc-quota-dot': {
			width: 12,
			height: 12,
			borderRadius: '50%',
			flexShrink: 0,
		},
		'& .wc-quota-dot--filled': {
			background: full,
			boxShadow: isDark ? '0 0 8px rgba(94, 234, 212, 0.5)' : '0 0 4px rgba(4, 90, 55, 0.25)',
		},
		'& .wc-quota-dot--empty': {
			background: empty,
			border: `1.5px solid ${isDark ? 'rgba(157, 232, 196, 0.4)' : 'rgba(4, 90, 55, 0.3)'}`,
			boxSizing: 'border-box',
		},
	};
};

export const externalMatchWcBetsQuotaLabelSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.7rem',
	fontWeight: 700,
	color: theme.palette.mode === 'dark' ? '#fff4d6' : '#034d2e',
	lineHeight: 1.2,
});

export const externalMatchWcBetsQuotaSubSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.625rem',
	fontWeight: 600,
	color: theme.palette.mode === 'dark' ? 'rgba(157, 232, 196, 0.75)' : '#5c4a00',
	lineHeight: 1.2,
});

export const externalMatchWcKickoffTimeSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	fontWeight: 700,
	fontSize: { xs: '0.95rem', sm: '1.05rem' },
	fontVariantNumeric: 'tabular-nums',
	lineHeight: 1,
	px: 0.25,
	color: theme.palette.mode === 'dark' ? '#ffe566' : '#6b5200',
	textShadow:
		theme.palette.mode === 'dark'
			? '0 0 12px rgba(255, 230, 102, 0.25)'
			: 'none',
});

export const externalMatchWcKickoffDateSx: SxProps<Theme> = (theme) => ({
	display: 'block',
	fontSize: '0.58rem',
	fontWeight: 600,
	lineHeight: 1.1,
	letterSpacing: '0.02em',
	color: theme.palette.mode === 'dark' ? 'rgba(157, 232, 196, 0.72)' : '#5a7a68',
	textTransform: 'none',
});

export const externalMatchWcBetChipSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		height: 20,
		maxWidth: '100%',
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 214, 0, 0.38)' : 'rgba(184, 134, 11, 0.45)',
		background: isDark
			? 'linear-gradient(135deg, rgba(0,90,55,0.55) 0%, rgba(100,75,0,0.35) 100%)'
			: 'linear-gradient(135deg, #dceee4 0%, #f0e8c8 100%)',
		color: isDark ? '#fff8e7' : '#034d2e',
		'& .MuiChip-label': {
			px: 0.7,
			fontSize: '0.65rem',
			fontWeight: 700,
			lineHeight: 1.25,
			whiteSpace: 'normal',
		},
	};
};

export const externalMatchWcLoadingAreaSx: SxProps<Theme> = {
	flex: 1,
	minHeight: 0,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

export const externalMatchWcEmptyHintSx: SxProps<Theme> = (theme) => ({
	textAlign: 'center',
	py: 3,
	px: 1,
	fontSize: '0.875rem',
	fontWeight: 500,
	color: theme.palette.mode === 'dark' ? '#9de8c4' : '#3d6b52',
});

export const externalMatchWcSyncCaptionSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.75rem',
	fontWeight: 600,
	color: theme.palette.mode === 'dark' ? 'rgba(157, 232, 196, 0.85)' : '#5c4a00',
});

function wc26ToolbarIconButton(role: 'gold' | 'green' | 'burgundy'): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const gold = {
			border: isDark ? 'rgba(255, 214, 0, 0.45)' : 'rgba(184, 134, 11, 0.55)',
			bg: isDark
				? 'linear-gradient(135deg, #6b5200 0%, #857000 100%)'
				: 'linear-gradient(135deg, #8b6914 0%, #a67c00 100%)',
			hover: isDark
				? 'linear-gradient(135deg, #857000 0%, #a67c00 100%)'
				: 'linear-gradient(135deg, #a67c00 0%, #c9a227 100%)',
		};
		const green = {
			border: isDark ? 'rgba(0, 200, 120, 0.38)' : 'rgba(4, 90, 55, 0.42)',
			bg: isDark
				? 'linear-gradient(135deg, #006b42 0%, #004830 100%)'
				: 'linear-gradient(135deg, #046a3d 0%, #034d2e 100%)',
			hover: isDark
				? 'linear-gradient(135deg, #008552 0%, #006b42 100%)'
				: 'linear-gradient(135deg, #057a4a 0%, #046a3d 100%)',
		};
		const burgundy = {
			border: isDark ? 'rgba(220, 100, 100, 0.42)' : 'rgba(140, 40, 40, 0.5)',
			bg: isDark
				? 'linear-gradient(135deg, #5c1818 0%, #7a2424 100%)'
				: 'linear-gradient(135deg, #7a1f1f 0%, #9b2d2d 100%)',
			hover: isDark
				? 'linear-gradient(135deg, #7a2424 0%, #9b2d2d 100%)'
				: 'linear-gradient(135deg, #9b2d2d 0%, #b83a3a 100%)',
		};
		const p = role === 'gold' ? gold : role === 'green' ? green : burgundy;
		return {
			width: 26,
			height: 26,
			p: 0,
			border: '1px solid',
			borderColor: p.border,
			background: p.bg,
			color: '#fff8e7',
			boxShadow: isDark
				? '0 2px 8px rgba(0, 0, 0, 0.35)'
				: '0 2px 6px rgba(4, 90, 55, 0.18)',
			'&:hover': { background: p.hover },
			'&.Mui-disabled': {
				bgcolor: 'action.disabledBackground',
				color: 'action.disabled',
				background: undefined,
				borderColor: 'divider',
			},
		};
	};
}

export const externalMatchWcOddsSyncButtonSx = wc26ToolbarIconButton('gold');
export const externalMatchWcMarathonbetSyncButtonSx = wc26ToolbarIconButton('burgundy');
export const externalMatchWcRefreshSyncButtonSx = wc26ToolbarIconButton('green');

export function externalMatchWcCardRowSx(
	interactive: boolean,
	options?: { isLast?: boolean }
): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		return {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-start',
			minHeight: 0,
			height: '100%',
			py: { xs: 0.45, sm: 0.55 },
			px: 0.5,
			boxSizing: 'border-box',
			borderBottom: options?.isLast
				? 'none'
				: `1px solid ${isDark ? 'rgba(0, 200, 120, 0.14)' : 'rgba(4, 90, 55, 0.1)'}`,
			cursor: interactive ? 'pointer' : 'default',
			transition: 'background-color 0.15s ease',
			'&:hover': interactive
				? {
						bgcolor: isDark ? 'rgba(0, 80, 50, 0.28)' : 'rgba(232, 244, 239, 0.98)',
					}
				: undefined,
		};
	};
}
