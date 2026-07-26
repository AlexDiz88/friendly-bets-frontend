import type { SxProps, Theme } from '@mui/material';

const glareKeyframes = {
	'@keyframes nearestGwPlateGlare': {
		'0%': { transform: 'translateX(-120%) skewX(-18deg)', opacity: 0 },
		'12%': { opacity: 0.55 },
		'35%': { opacity: 0.35 },
		'55%': { transform: 'translateX(160%) skewX(-18deg)', opacity: 0 },
		'100%': { transform: 'translateX(160%) skewX(-18deg)', opacity: 0 },
	},
};

export function nearestGameweekBetsPlateSx(
	complete: boolean,
	compact: boolean
): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const border = complete
			? isDark
				? 'rgba(52, 211, 153, 0.42)'
				: 'rgba(5, 150, 105, 0.55)'
			: isDark
				? 'rgba(251, 146, 60, 0.45)'
				: 'rgba(234, 88, 12, 0.55)';
		const glow = complete
			? isDark
				? '0 0 10px rgba(52, 211, 153, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.14)'
				: '0 2px 10px rgba(5, 150, 105, 0.18), 0 1px 3px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
			: isDark
				? '0 0 10px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.12)'
				: '0 2px 10px rgba(234, 88, 12, 0.16), 0 1px 3px rgba(15, 23, 42, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.85)';
		const bg = complete
			? isDark
				? 'linear-gradient(120deg, rgba(6, 78, 59, 0.28) 0%, rgba(15, 23, 42, 0.42) 55%, rgba(30, 41, 59, 0.35) 100%)'
				: 'linear-gradient(120deg, rgba(167, 243, 208, 0.72) 0%, rgba(209, 250, 229, 0.88) 45%, rgba(236, 253, 245, 0.95) 100%)'
			: isDark
				? 'linear-gradient(120deg, rgba(124, 45, 18, 0.22) 0%, rgba(15, 23, 42, 0.42) 55%, rgba(30, 41, 59, 0.35) 100%)'
				: 'linear-gradient(120deg, rgba(253, 186, 116, 0.55) 0%, rgba(254, 215, 170, 0.78) 40%, rgba(255, 237, 213, 0.92) 100%)';

		return {
			...glareKeyframes,
			position: 'relative',
			overflow: 'hidden',
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'space-between',
			gap: 0.5,
			px: compact ? 0.6 : 0.7,
			py: 0.15,
			mb: compact ? 0.75 : 0.65,
			borderRadius: 1.25,
			border: '1px solid',
			borderColor: border,
			background: bg,
			backdropFilter: isDark ? 'blur(14px) saturate(1.35)' : 'blur(10px) saturate(1.45)',
			WebkitBackdropFilter: isDark ? 'blur(14px) saturate(1.35)' : 'blur(10px) saturate(1.45)',
			boxShadow: glow,
			boxSizing: 'border-box',
			width: '100%',
			minHeight: compact ? 30 : 32,
			'&::after': {
				content: '""',
				position: 'absolute',
				top: 0,
				left: 0,
				width: '42%',
				height: '100%',
				pointerEvents: 'none',
				background: isDark
					? 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 45%, rgba(255,255,255,0.28) 50%, rgba(255,255,255,0.1) 55%, transparent 100%)'
					: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 40%, rgba(255,255,255,0.75) 50%, rgba(255,247,237,0.35) 60%, transparent 100%)',
				animation: 'nearestGwPlateGlare 4.2s ease-in-out infinite',
			},
		};
	};
}

export const nearestGameweekBetsPlateLeaguesSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	gap: 0.5,
	minWidth: 0,
	flex: 1,
	position: 'relative',
	zIndex: 1,
};

export const nearestGameweekBetsPlateLeagueBtnSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		display: 'inline-flex',
		alignItems: 'center',
		gap: 0.4,
		px: 0.25,
		py: 0,
		minHeight: 28,
		margin: 0,
		borderRadius: 1,
		border: 'none',
		background: 'transparent',
		color: 'inherit',
		font: 'inherit',
		cursor: 'pointer',
		userSelect: 'none',
		WebkitTapHighlightColor: 'transparent',
		position: 'relative',
		zIndex: 1,
		'&:hover': {
			bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
		},
	};
};

export function nearestGameweekBetsPlateCountSx(leagueComplete: boolean): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		return {
			fontSize: '0.7rem',
			fontWeight: 800,
			fontVariantNumeric: 'tabular-nums',
			lineHeight: 1,
			color: leagueComplete
				? isDark
					? '#5eead4'
					: '#047857'
				: isDark
					? '#fdba74'
					: '#c2410c',
		};
	};
}

export function nearestGameweekBetsPlateCheckSx(complete: boolean): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		return {
			flexShrink: 0,
			fontSize: 18,
			position: 'relative',
			zIndex: 1,
			color: complete
				? isDark
					? '#34d399'
					: '#059669'
				: isDark
					? 'rgba(251, 146, 60, 0.85)'
					: '#ea580c',
			filter: complete
				? isDark
					? 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.55))'
					: 'drop-shadow(0 0 4px rgba(5, 150, 105, 0.35))'
				: 'none',
		};
	};
}

export const nearestGameweekBetsPlateLabelSx: SxProps<Theme> = (theme) => ({
	display: 'inline-flex',
	alignItems: 'center',
	alignSelf: 'center',
	fontSize: '0.68rem',
	fontWeight: 700,
	lineHeight: 1,
	whiteSpace: 'nowrap',
	flexShrink: 0,
	position: 'relative',
	zIndex: 1,
	color: theme.palette.mode === 'dark' ? 'rgba(241, 245, 249, 0.88)' : '#7c2d12',
});

export const nearestGameweekBetsPlateDateSx: SxProps<Theme> = (theme) => ({
	display: 'inline-flex',
	alignItems: 'center',
	alignSelf: 'center',
	fontSize: '0.65rem',
	fontWeight: 700,
	lineHeight: 0,
	whiteSpace: 'nowrap',
	flexShrink: 0,
	position: 'relative',
	zIndex: 1,
	color: theme.palette.mode === 'dark' ? 'rgba(226, 232, 240, 0.62)' : '#9a3412',
});

export const nearestGameweekBetsPlateLoadingSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	minHeight: 30,
	mb: 0.65,
};
