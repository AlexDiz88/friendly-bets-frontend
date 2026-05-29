import type { SxProps, Theme } from '@mui/material';

/** Палитра хедера: тёмно-синий (navy) + яркий синий акцент */
const headerPalette = {
	dark: {
		bar: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 55%, #0a1628 100%)',
		glow: 'radial-gradient(ellipse 80% 120% at 50% -40%, rgba(37, 99, 235, 0.28) 0%, transparent 60%)',
		text: '#e8eef8',
		navHover: '#93c5fd',
		eventLink: '#60a5fa',
		eventLinkHover: '#bfdbfe',
		iconHoverBg: 'rgba(59, 130, 246, 0.16)',
		borderBottom: 'rgba(59, 130, 246, 0.22)',
		shadow: '0 4px 20px rgba(10, 22, 40, 0.55), 0 1px 0 rgba(96, 165, 250, 0.12) inset',
	},
	light: {
		bar: 'linear-gradient(180deg, #0d1f3c 0%, #1a2d4a 50%, #0d1f3c 100%)',
		glow: 'radial-gradient(ellipse 80% 120% at 50% -40%, rgba(37, 99, 235, 0.18) 0%, transparent 60%)',
		text: '#f0f7ff',
		navHover: '#60a5fa',
		eventLink: '#93c5fd',
		eventLinkHover: '#dbeafe',
		iconHoverBg: 'rgba(37, 99, 235, 0.2)',
		borderBottom: 'rgba(37, 99, 235, 0.35)',
		shadow: '0 4px 16px rgba(13, 31, 60, 0.35), 0 1px 0 rgba(147, 197, 253, 0.2) inset',
	},
} as const;

export const headerAppBarSx: SxProps<Theme> = (theme) => {
	const p = theme.palette.mode === 'dark' ? headerPalette.dark : headerPalette.light;
	return {
		color: p.text,
		backgroundImage: `${p.glow}, ${p.bar}`,
		boxShadow: p.shadow,
		borderBottom: '1px solid',
		borderColor: p.borderBottom,
	};
};

export const headerNavLinkSx: SxProps<Theme> = (theme) => {
	const p = theme.palette.mode === 'dark' ? headerPalette.dark : headerPalette.light;
	return {
		position: 'relative',
		zIndex: 1,
		textTransform: 'none',
		color: 'inherit',
		'&:hover': {
			color: p.navHover,
		},
	};
};

/** Выделенный пункт event-навигации (напр. ЧМ-2026) */
export const headerNavLinkEventSx: SxProps<Theme> = (theme) => {
	const p = theme.palette.mode === 'dark' ? headerPalette.dark : headerPalette.light;
	return {
		position: 'relative',
		zIndex: 1,
		textTransform: 'none',
		fontWeight: 800,
		color: p.eventLink,
		textShadow: theme.palette.mode === 'dark' ? '0 0 12px rgba(96, 165, 250, 0.35)' : 'none',
		'&:hover': {
			color: p.eventLinkHover,
		},
	};
};

export const headerIconButtonSx: SxProps<Theme> = (theme) => {
	const p = theme.palette.mode === 'dark' ? headerPalette.dark : headerPalette.light;
	return {
		position: 'relative',
		zIndex: 1,
		color: 'inherit',
		'&:hover': {
			color: p.navHover,
			backgroundColor: p.iconHoverBg,
		},
	};
};
