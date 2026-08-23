import type { SxProps, Theme } from '@mui/material';

/** Glass red LIVE badge (restored from WC26 match cards). */
export const liveMatchBadgeSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: 16,
		px: 0.7,
		borderRadius: '5px',
		fontSize: '0.5rem',
		fontWeight: 900,
		letterSpacing: '0.14em',
		textTransform: 'uppercase',
		color: '#fff',
		position: 'relative',
		overflow: 'hidden',
		flexShrink: 0,
		background: isDark
			? 'linear-gradient(145deg, #ff5c5c 0%, #c41e1e 38%, #7a0f0f 72%, #ff4040 100%)'
			: 'linear-gradient(145deg, #ff6b6b 0%, #dc2626 38%, #991b1b 72%, #ef4444 100%)',
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 180, 180, 0.45)' : 'rgba(255, 255, 255, 0.65)',
		boxShadow: isDark
			? '0 1px 0 rgba(255,255,255,0.35) inset, 0 -2px 0 rgba(0,0,0,0.35) inset, 0 2px 6px rgba(0,0,0,0.45), 0 0 14px rgba(255,60,60,0.4)'
			: '0 1px 0 rgba(255,255,255,0.7) inset, 0 -2px 0 rgba(120,0,0,0.25) inset, 0 2px 5px rgba(153,27,27,0.35), 0 0 10px rgba(239,68,68,0.25)',
		textShadow: '0 1px 1px rgba(0,0,0,0.45)',
		'&::before': {
			content: '""',
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			height: '52%',
			background: 'linear-gradient(180deg, rgba(255,255,255,0.62) 0%, rgba(255,255,255,0.06) 100%)',
			borderRadius: '4px 4px 0 0',
			pointerEvents: 'none',
		},
		'&::after': {
			content: '""',
			position: 'absolute',
			top: '-60%',
			left: '-70%',
			width: '45%',
			height: '220%',
			background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
			transform: 'rotate(22deg)',
			animation: 'liveMatchBadgeShine 2.8s ease-in-out infinite',
			pointerEvents: 'none',
		},
		'@keyframes liveMatchBadgeShine': {
			'0%, 100%': { left: '-70%', opacity: 0.6 },
			'50%': { left: '130%', opacity: 1 },
		},
	};
};

/** Minute above live score — larger + soft blink. */
export const liveMatchMinuteSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	fontWeight: 800,
	fontSize: { xs: '0.78rem', sm: '0.85rem' },
	fontVariantNumeric: 'tabular-nums',
	lineHeight: 1,
	px: 0.25,
	color: theme.palette.mode === 'dark' ? '#ffb347' : '#c2410c',
	textShadow:
		theme.palette.mode === 'dark' ? '0 0 10px rgba(255, 179, 71, 0.35)' : 'none',
	animation: 'liveMatchMinutePulse 1.8s ease-in-out infinite',
	'@keyframes liveMatchMinutePulse': {
		'0%, 100%': { opacity: 1 },
		'50%': { opacity: 0.45 },
	},
});

/** Live score under minute. */
export const liveMatchScoreSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		flexShrink: 0,
		display: 'inline-block',
		fontWeight: 900,
		fontSize: { xs: '0.95rem', sm: '1.05rem' },
		fontVariantNumeric: 'tabular-nums',
		lineHeight: 1.15,
		px: 0.25,
		textAlign: 'center',
		whiteSpace: 'pre-line',
		color: isDark ? '#ff5555' : '#dc2626',
		textShadow: isDark
			? '0 0 14px rgba(255, 70, 70, 0.55), 0 1px 0 rgba(0,0,0,0.2)'
			: '0 0 8px rgba(220, 38, 38, 0.35)',
	};
};

export const liveMatchHalftimeBadgeSx: SxProps<Theme> = (theme) => ({
	display: 'inline-flex',
	alignItems: 'center',
	height: 18,
	px: 0.65,
	borderRadius: '5px',
	fontSize: '0.56rem',
	fontWeight: 700,
	color: theme.palette.mode === 'dark' ? '#ffd966' : '#8b6914',
	border: '1px solid',
	borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.35)' : 'rgba(184, 134, 11, 0.4)',
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(135deg, rgba(80,60,0,0.6) 0%, rgba(50,40,0,0.5) 100%)'
			: 'linear-gradient(135deg, #f5ecd0 0%, #e8dcc0 100%)',
});

export const matchResultStatusChipSx: SxProps<Theme> = {
	height: 18,
	fontSize: '0.65rem',
	'& .MuiChip-label': { px: 0.5, py: 0, fontSize: '0.65rem' },
};
