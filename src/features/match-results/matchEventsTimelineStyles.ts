import type { SxProps, Theme } from '@mui/material';

const palette = (mode: 'light' | 'dark') => {
	if (mode === 'dark') {
		return {
			text: '#e8f5ef',
			textMuted: 'rgba(157, 232, 196, 0.7)',
			divider: 'rgba(0, 200, 120, 0.16)',
			rail: 'rgba(255, 214, 0, 0.35)',
			periodBg: 'rgba(0, 130, 75, 0.16)',
			periodText: '#9de8c4',
			homeTint: 'rgba(34, 197, 94, 0.12)',
			awayTint: 'rgba(59, 130, 246, 0.12)',
			minute: '#ffe566',
			addedBg: 'rgba(255, 214, 0, 0.1)',
			addedText: '#ffd966',
			goal: '#9de8c4',
			pen: '#7dd3fc',
			own: '#fbbf24',
			miss: '#f87171',
			red: '#ef4444',
		};
	}
	return {
		text: '#1a3d2e',
		textMuted: '#5a7a68',
		divider: 'rgba(4, 90, 55, 0.12)',
		rail: 'rgba(184, 134, 11, 0.45)',
		periodBg: 'rgba(4, 106, 61, 0.08)',
		periodText: '#046a3d',
		homeTint: 'rgba(4, 106, 61, 0.08)',
		awayTint: 'rgba(37, 99, 235, 0.08)',
		minute: '#a16207',
		addedBg: 'rgba(184, 134, 11, 0.1)',
		addedText: '#8b6914',
		goal: '#0a5c38',
		pen: '#0369a1',
		own: '#b45309',
		miss: '#b91c1c',
		red: '#dc2626',
	};
};

export const matchEventsTimelineRootSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		display: 'flex',
		flexDirection: 'column',
		gap: 0.65,
		px: 0.25,
		py: 0.25,
		borderTop: '1px solid',
		borderBottom: '1px solid',
		borderColor: p.divider,
	};
};

export const matchEventsPeriodHeaderSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 0.75,
		py: 0.35,
		'&::before, &::after': {
			content: '""',
			flex: 1,
			height: 1,
			background: `linear-gradient(90deg, transparent, ${p.rail}, transparent)`,
		},
	};
};

export const matchEventsPeriodLabelSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		flexShrink: 0,
		px: 0.85,
		py: 0.2,
		borderRadius: 999,
		fontSize: '0.62rem',
		fontWeight: 800,
		letterSpacing: '0.04em',
		textTransform: 'uppercase',
		color: p.periodText,
		background: p.periodBg,
		lineHeight: 1.2,
	};
};

export const matchEventsRowSx: SxProps<Theme> = {
	display: 'grid',
	gridTemplateColumns: '1fr auto 1fr',
	alignItems: 'center',
	columnGap: 0.5,
	minHeight: 22,
};

export const matchEventsSideSx = (side: 'home' | 'away', active: boolean): SxProps<Theme> => (theme) => {
	const p = palette(theme.palette.mode);
	return {
		minWidth: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: side === 'home' ? 'flex-end' : 'flex-start',
		gap: 0.4,
		px: 0.45,
		py: 0.25,
		borderRadius: 1,
		bgcolor: active ? (side === 'home' ? p.homeTint : p.awayTint) : 'transparent',
	};
};

export const matchEventsMinuteCellSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 36,
		flexShrink: 0,
		'&::before': {
			content: '""',
			position: 'absolute',
			top: -6,
			bottom: -6,
			left: '50%',
			width: 1,
			transform: 'translateX(-50%)',
			background: p.divider,
			zIndex: 0,
		},
	};
};

export const matchEventsMinuteSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		position: 'relative',
		zIndex: 1,
		fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
		fontSize: '0.62rem',
		fontWeight: 800,
		fontVariantNumeric: 'tabular-nums',
		lineHeight: 1,
		px: 0.35,
		py: 0.2,
		borderRadius: 0.75,
		color: p.minute,
		bgcolor: theme.palette.mode === 'dark' ? 'rgba(11, 20, 36, 0.92)' : 'rgba(255,255,255,0.95)',
		border: '1px solid',
		borderColor: p.divider,
	};
};

export const matchEventsPlayerSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		minWidth: 0,
		fontSize: '0.68rem',
		fontWeight: 700,
		lineHeight: 1.15,
		color: p.text,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	};
};

export const matchEventsVarCaptionSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		minWidth: 0,
		fontSize: '0.62rem',
		fontWeight: 600,
		lineHeight: 1.2,
		color: p.textMuted,
		whiteSpace: 'normal',
	};
};

export const matchEventsVarBadgeSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	px: 0.4,
	py: 0.15,
	borderRadius: 0.5,
	fontSize: '0.5rem',
	fontWeight: 800,
	letterSpacing: '0.06em',
	lineHeight: 1,
	color: '#fff',
	bgcolor: theme.palette.mode === 'dark' ? '#6b7280' : '#4b5563',
});

export const matchEventsBadgeSx = (
	kind: 'goal' | 'pen' | 'own' | 'miss' | 'red' | 'secondYellow'
): SxProps<Theme> => (theme) => {
	const p = palette(theme.palette.mode);
	if (kind === 'red' || kind === 'secondYellow') {
		return {
			flexShrink: 0,
			display: 'inline-block',
			width: 8,
			height: 12,
			borderRadius: '1.5px',
			bgcolor: p.red,
			boxShadow: theme.palette.mode === 'dark'
				? '0 0 0 1px rgba(255,255,255,0.12), 0 1px 2px rgba(0,0,0,0.45)'
				: '0 0 0 1px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.18)',
			transform: 'rotate(-8deg)',
		};
	}
	const color =
		kind === 'goal'
			? p.goal
			: kind === 'pen'
				? p.pen
				: kind === 'own'
					? p.own
					: p.miss;
	return {
		flexShrink: 0,
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		px: 0.35,
		py: 0.05,
		borderRadius: 0.6,
		fontSize: '0.55rem',
		fontWeight: 800,
		lineHeight: 1,
		letterSpacing: '0.02em',
		color,
		bgcolor: `${color}22`,
		border: '1px solid',
		borderColor: `${color}55`,
	};
};

export const matchEventsGoalMarkSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		flexShrink: 0,
		display: 'inline-flex',
		alignItems: 'center',
		gap: 0.3,
		lineHeight: 1,
		color: p.goal,
	};
};

export const matchEventsGoalScoreSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
		fontSize: '0.62rem',
		fontWeight: 800,
		fontVariantNumeric: 'tabular-nums',
		lineHeight: 1,
		color: p.minute,
	};
};

export const matchEventsBallIconSx: SxProps<Theme> = {
	width: 14,
	height: 14,
	display: 'block',
	flexShrink: 0,
	objectFit: 'contain',
};

/**
 * Dark goal-frame / posts on football24 icons disappear on dark UI —
 * lift them with a frosted pad + soft halo (penalty / miss / own-goal).
 */
export const matchEventsFramedIconSx: SxProps<Theme> = (theme) => {
	if (theme.palette.mode !== 'dark') {
		return {
			width: 15,
			height: 15,
		};
	}
	return {
		width: 15,
		height: 15,
		boxSizing: 'content-box',
		p: '2px',
		borderRadius: '4px',
		bgcolor: 'rgba(255, 255, 255, 0.16)',
		boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.22)',
		filter: 'brightness(1.2) contrast(1.08) drop-shadow(0 0 0.6px rgba(255,255,255,0.55))',
	};
};

export const matchEventsAddedRowSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		display: 'flex',
		justifyContent: 'center',
		py: 0.15,
	};
};

export const matchEventsAddedChipSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		fontSize: '0.6rem',
		fontWeight: 800,
		lineHeight: 1.2,
		px: 0.75,
		py: 0.2,
		borderRadius: 999,
		color: p.addedText,
		background: p.addedBg,
		border: '1px solid',
		borderColor: p.divider,
	};
};

export const matchEventsEmptySx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		textAlign: 'center',
		fontSize: '0.68rem',
		fontWeight: 600,
		color: p.textMuted,
		py: 0.75,
	};
};
