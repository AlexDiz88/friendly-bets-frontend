import type { SxProps, Theme } from '@mui/material';

export const wc26TitleShineKeyframes = {
	'@keyframes wc26TitleShine': {
		'0%, 100%': { backgroundPosition: '0% 50%' },
		'50%': { backgroundPosition: '100% 50%' },
	},
};

export const wc26StickyFilterBarSx: SxProps<Theme> = (theme) => ({
	position: 'sticky',
	top: { xs: 56, sm: 64 },
	zIndex: 10,
	py: 1,
	mb: 1,
	mx: -0.5,
	px: 0.5,
	backdropFilter: 'blur(12px)',
	borderBottom: '1px solid',
	borderColor:
		theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.12)' : 'rgba(184, 134, 11, 0.2)',
	bgcolor:
		theme.palette.mode === 'dark'
			? 'rgba(11, 20, 36, 0.88)'
			: 'rgba(232, 244, 239, 0.92)',
});

export function wc26StageChipSx(selected: boolean): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const base = {
			flexShrink: 0,
			fontWeight: selected ? 700 : 600,
			fontSize: '0.75rem',
			height: 36,
			borderRadius: 2,
			'& .MuiChip-label': { px: 1.25 },
		};
		if (selected) {
			return {
				...base,
				border: '1px solid',
				borderColor: isDark ? 'rgba(255, 214, 0, 0.45)' : 'rgba(184, 134, 11, 0.55)',
				background: isDark
					? 'linear-gradient(135deg, #006b42 0%, #6b5200 52%, #006b42 100%)'
					: 'linear-gradient(135deg, #046a3d 0%, #8b6914 55%, #046a3d 100%)',
				color: '#fff8e7',
				boxShadow: isDark
					? '0 2px 10px rgba(0, 200, 120, 0.22)'
					: '0 2px 8px rgba(4, 90, 55, 0.18)',
				'&:hover': {
					background: isDark
						? 'linear-gradient(135deg, #008552 0%, #857000 52%, #008552 100%)'
						: 'linear-gradient(135deg, #057a4a 0%, #a67c00 55%, #057a4a 100%)',
				},
			};
		}
		return {
			...base,
			border: '1px solid',
			borderColor: isDark ? 'rgba(0, 200, 120, 0.32)' : 'rgba(4, 90, 55, 0.28)',
			bgcolor: isDark ? 'rgba(13, 20, 30, 0.55)' : 'rgba(255, 255, 255, 0.7)',
			color: isDark ? '#8fd4b0' : '#0a5c38',
			'&:hover': {
				borderColor: isDark ? 'rgba(255, 214, 0, 0.42)' : 'rgba(184, 134, 11, 0.5)',
				bgcolor: isDark ? 'rgba(0, 80, 50, 0.2)' : 'rgba(232, 244, 239, 0.98)',
			},
		};
	};
}

export const wc26SectionHeaderSx: SxProps<Theme> = (theme) => ({
	mb: 0.5,
	px: 1,
	py: 0.5,
	borderRadius: 1,
	textTransform: 'none',
	display: 'block',
	fontWeight: 800,
	fontSize: '0.7rem',
	letterSpacing: 0.2,
	textAlign: 'center',
	border: '1px solid',
	borderColor:
		theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.22)' : 'rgba(184, 134, 11, 0.32)',
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(90deg, rgba(0,75,48,0.92) 0%, rgba(100,75,0,0.82) 50%, rgba(0,75,48,0.92) 100%)'
			: 'linear-gradient(90deg, #dceee4 0%, #f0e8c8 50%, #dceee4 100%)',
	color: theme.palette.mode === 'dark' ? '#fff4d6' : '#034d2e',
	boxShadow:
		theme.palette.mode === 'dark'
			? 'inset 0 1px 0 rgba(255,255,255,0.06)'
			: 'inset 0 1px 0 rgba(255,255,255,0.85)',
});

export const wc26MatchCountSx: SxProps<Theme> = (theme) => ({
	display: 'block',
	mb: 1,
	px: 0.5,
	fontSize: '0.7rem',
	fontWeight: 600,
	color: theme.palette.mode === 'dark' ? '#9de8c4' : '#5c4a00',
	opacity: 0.9,
});

export const wc26SlotTitleSx: SxProps<Theme> = (theme) => ({
	fontWeight: 800,
	display: 'block',
	fontSize: '0.75rem',
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(90deg, #7dcea0, #ffd700)'
			: 'linear-gradient(90deg, #046a3d, #a67c00)',
	backgroundClip: 'text',
	WebkitBackgroundClip: 'text',
	color: 'transparent',
});

export const wc26SlotRangeSx: SxProps<Theme> = (theme) => ({
	display: 'block',
	fontSize: '0.7rem',
	color: theme.palette.mode === 'dark' ? 'rgba(157, 232, 196, 0.75)' : '#3d6b52',
});

export const wc26SlotRuleSx: SxProps<Theme> = (theme) => ({
	display: 'block',
	fontSize: '0.7rem',
	fontWeight: 700,
	color: theme.palette.mode === 'dark' ? '#ffd966' : '#8b6914',
});

export const wc26MatchMetaSx: SxProps<Theme> = (theme) => ({
	display: 'block',
	mb: 0.25,
	pl: 0.25,
	fontSize: '0.65rem',
	fontWeight: 600,
	color: theme.palette.mode === 'dark' ? 'rgba(157, 232, 196, 0.65)' : '#5a7a68',
});

export const wc26KickoffTimeSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	fontWeight: 700,
	fontSize: { xs: '1.05rem', sm: '1.15rem' },
	fontVariantNumeric: 'tabular-nums',
	lineHeight: 1,
	px: 0.25,
	color: theme.palette.mode === 'dark' ? '#ffe566' : '#6b5200',
	textShadow:
		theme.palette.mode === 'dark'
			? '0 0 12px rgba(255, 230, 102, 0.25)'
			: 'none',
});

export const wc26DividerSx: SxProps<Theme> = (theme) => ({
	borderBottom: '1px solid',
	borderColor:
		theme.palette.mode === 'dark' ? 'rgba(0, 200, 120, 0.14)' : 'rgba(4, 90, 55, 0.1)',
	mx: 0.5,
});
