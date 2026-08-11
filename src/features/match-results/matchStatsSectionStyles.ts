import type { SxProps, Theme } from '@mui/material';

const palette = (mode: 'light' | 'dark') => {
	if (mode === 'dark') {
		return {
			text: '#e8f5ef',
			textMuted: 'rgba(157, 232, 196, 0.72)',
			divider: 'rgba(0, 200, 120, 0.16)',
			sectionBg: 'rgba(0, 130, 75, 0.08)',
			track: 'rgba(255, 255, 255, 0.06)',
			homeBar: 'linear-gradient(90deg, rgba(34, 197, 94, 0.95) 0%, rgba(16, 185, 129, 0.75) 100%)',
			awayBar: 'linear-gradient(270deg, rgba(59, 130, 246, 0.95) 0%, rgba(96, 165, 250, 0.75) 100%)',
			homeLead: '#9de8c4',
			awayLead: '#93c5fd',
			homeMuted: 'rgba(157, 232, 196, 0.78)',
			awayMuted: 'rgba(147, 197, 253, 0.78)',
		};
	}
	return {
		text: '#1a3d2e',
		textMuted: '#5a7a68',
		divider: 'rgba(4, 90, 55, 0.12)',
		sectionBg: 'rgba(4, 106, 61, 0.05)',
		track: 'rgba(4, 90, 55, 0.08)',
		homeBar: 'linear-gradient(90deg, #046a3d 0%, #059669 100%)',
		awayBar: 'linear-gradient(270deg, #1d4ed8 0%, #2563eb 100%)',
		homeLead: '#046a3d',
		awayLead: '#1d4ed8',
		homeMuted: '#5a7a68',
		awayMuted: '#64748b',
	};
};

export const matchStatsSectionRootSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		display: 'flex',
		flexDirection: 'column',
		gap: 0.85,
		px: 1.25,
		pt: 0.75,
		pb: 0.9,
		flexShrink: 0,
		borderTop: '1px solid',
		borderBottom: '1px solid',
		borderColor: p.divider,
		background: p.sectionBg,
	};
};

export const matchStatsSectionTitleSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		fontSize: '0.68rem',
		fontWeight: 800,
		letterSpacing: '0.1em',
		textTransform: 'uppercase',
		color: p.textMuted,
		textAlign: 'center',
		lineHeight: 1.2,
	};
};

export const matchStatsRowsSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 0.72,
};

export const matchStatsRowSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 0.28,
};

export const matchStatsValuesRowSx: SxProps<Theme> = {
	display: 'grid',
	gridTemplateColumns: 'minmax(2.2rem, 1fr) minmax(0, 2.4fr) minmax(2.2rem, 1fr)',
	alignItems: 'center',
	columnGap: 0.5,
};

export function matchStatsValueSx(
	side: 'home' | 'away',
	leading: boolean
): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme.palette.mode);
		const color =
			side === 'home'
				? leading
					? p.homeLead
					: p.homeMuted
				: leading
					? p.awayLead
					: p.awayMuted;
		return {
			fontSize: '0.82rem',
			fontWeight: leading ? 800 : 600,
			fontVariantNumeric: 'tabular-nums',
			color,
			textAlign: side === 'home' ? 'right' : 'left',
			lineHeight: 1.1,
		};
	};
}

export const matchStatsLabelSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		fontSize: '0.68rem',
		fontWeight: 700,
		letterSpacing: '0.02em',
		color: p.text,
		textAlign: 'center',
		lineHeight: 1.15,
		opacity: 0.92,
	};
};

export const matchStatsBarTrackSx: SxProps<Theme> = (theme) => {
	const p = palette(theme.palette.mode);
	return {
		display: 'flex',
		width: '100%',
		height: 6,
		borderRadius: 999,
		overflow: 'hidden',
		backgroundColor: p.track,
		boxShadow: theme.palette.mode === 'dark' ? 'inset 0 1px 2px rgba(0,0,0,0.28)' : 'inset 0 1px 2px rgba(0,0,0,0.06)',
	};
};

export function matchStatsBarHalfSx(
	side: 'home' | 'away',
	widthPct: number
): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme.palette.mode);
		return {
			width: `${widthPct}%`,
			minWidth: widthPct > 0 ? 3 : 0,
			height: '100%',
			background: side === 'home' ? p.homeBar : p.awayBar,
			transition: 'width 0.35s ease',
			boxShadow:
				widthPct > 0
					? side === 'home'
						? '0 0 8px rgba(34, 197, 94, 0.22)'
						: '0 0 8px rgba(59, 130, 246, 0.22)'
					: 'none',
		};
	};
}
