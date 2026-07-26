import type { SxProps, Theme } from '@mui/material';
import {
	EXTERNAL_DATA_LAYER_ACCENT,
	EXTERNAL_DATA_LAYER_PALETTE,
	type ExternalDataLayer,
} from '../../shared/externalDataLayerColors';

/** Re-export canonical accents — do not redefine per feature. */
export const LAYER_ACCENT = EXTERNAL_DATA_LAYER_ACCENT;

export const sandboxPageRootSx: SxProps<Theme> = {
	minWidth: 1100,
	maxWidth: 1400,
	mx: 'auto',
	px: 2.5,
	py: 2.5,
	pb: 5,
};

export const sandboxTitleSx: SxProps<Theme> = {
	fontFamily: '"Exo 2", sans-serif',
	fontWeight: 800,
	fontSize: '1.55rem',
	letterSpacing: '0.02em',
	mb: 0.5,
};

export const sandboxHintSx: SxProps<Theme> = (theme) => ({
	color: theme.palette.text.secondary,
	fontSize: '0.88rem',
	mb: 2,
	maxWidth: 760,
});

export const sandboxTabsBarSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	gap: 1,
	mb: 2.5,
};

export function sandboxLayerChipSx(active: boolean, accent: string): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		return {
			fontFamily: '"Exo 2", sans-serif',
			fontWeight: 700,
			letterSpacing: '0.04em',
			height: 36,
			px: 0.5,
			borderRadius: 2,
			cursor: 'pointer',
			border: `1.5px solid ${active ? accent : isDark ? 'rgba(148,163,184,0.25)' : 'rgba(15,23,42,0.12)'}`,
			background: active
				? isDark
					? `${accent}28`
					: `${accent}1f`
				: isDark
					? 'rgba(15,23,42,0.55)'
					: 'rgba(255,255,255,0.9)',
			color: active ? accent : theme.palette.text.secondary,
			boxShadow: active ? `0 0 0 1px ${accent}55, 0 4px 12px ${accent}33` : 'none',
			'&:hover': {
				background: isDark ? `${accent}22` : `${accent}14`,
				borderColor: accent,
			},
		};
	};
}

export function sandboxStandLayoutSx(layer: ExternalDataLayer): SxProps<Theme> {
	const pal = EXTERNAL_DATA_LAYER_PALETTE[layer];
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		return {
			display: 'flex',
			gap: 2,
			alignItems: 'stretch',
			minHeight: 520,
			borderRadius: 2,
			border: `1.5px solid ${isDark ? pal.borderDark : pal.border}`,
			background: isDark
				? `linear-gradient(180deg, ${pal.surfaceDark} 0%, rgba(15,23,42,0.72) 45%)`
				: `linear-gradient(180deg, ${pal.surface} 0%, #ffffff 32%)`,
			overflow: 'hidden',
			position: 'relative',
			boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.25)' : `0 6px 18px ${pal.soft}`,
			'&::before': {
				content: '""',
				position: 'absolute',
				left: 0,
				top: 0,
				bottom: 0,
				width: 5,
				background: pal.accent,
			},
		};
	};
}

export const sandboxFormColSx: SxProps<Theme> = (theme) => ({
	width: 340,
	flexShrink: 0,
	p: 2.25,
	borderRight: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.06)'}`,
	display: 'flex',
	flexDirection: 'column',
	gap: 1.75,
});

export const sandboxResultColSx: SxProps<Theme> = {
	flex: 1,
	minWidth: 0,
	display: 'flex',
	flexDirection: 'column',
	p: 2,
	gap: 1.5,
};

export const sandboxFieldLabelSx: SxProps<Theme> = {
	fontSize: '0.72rem',
	fontWeight: 700,
	textTransform: 'uppercase',
	letterSpacing: '0.05em',
	color: 'text.secondary',
	mb: 0.5,
};

export const sandboxPreSx: SxProps<Theme> = (theme) => ({
	m: 0,
	p: 1.5,
	borderRadius: 1.5,
	fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
	fontSize: '0.72rem',
	lineHeight: 1.45,
	overflow: 'auto',
	maxHeight: 360,
	whiteSpace: 'pre-wrap',
	wordBreak: 'break-word',
	background: theme.palette.mode === 'dark' ? 'rgba(2,6,23,0.65)' : 'rgba(248,250,252,0.95)',
	border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.08)'}`,
});

export function sandboxTableSx(layer?: ExternalDataLayer): SxProps<Theme> {
	const pal = layer ? EXTERNAL_DATA_LAYER_PALETTE[layer] : null;
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const hover = pal
			? isDark
				? pal.softDark
				: pal.soft
			: isDark
				? 'rgba(14,165,233,0.06)'
				: 'rgba(14,165,233,0.04)';
		const headBg = pal
			? isDark
				? 'rgba(15,23,42,0.95)'
				: pal.soft
			: isDark
				? 'rgba(15,23,42,0.95)'
				: 'rgba(248,250,252,0.98)';
		return {
			'& .MuiTableCell-root': {
				borderColor: isDark
					? 'rgba(148,163,184,0.1)'
					: pal
						? `${pal.accent}22`
						: 'rgba(15,23,42,0.06)',
				py: 0.75,
				px: 1.5,
				fontSize: '0.8rem',
			},
			'& .MuiTableCell-root:first-of-type': {
				pl: 2,
			},
			'& .MuiTableCell-root:last-of-type': {
				pr: 2,
			},
			'& .MuiTableHead-root .MuiTableCell-root': {
				fontWeight: 700,
				fontSize: '0.7rem',
				textTransform: 'uppercase',
				letterSpacing: '0.04em',
				color: !isDark && pal ? pal.accent : theme.palette.text.secondary,
				background: headBg,
				position: 'sticky',
				top: 0,
				zIndex: 1,
			},
			'& .MuiTableBody-root .MuiTableRow-root:hover': {
				background: hover,
			},
		};
	};
}

export function statusChipColor(status?: string | null): 'default' | 'success' | 'warning' | 'error' | 'info' {
	const s = (status || '').toUpperCase();
	if (s === 'LIVE' || s === 'IN_PLAY' || s === 'PAUSED') return 'warning';
	if (s === 'FINISHED' || s === 'FT') return 'success';
	if (s === 'SCHEDULED' || s === 'NS') return 'info';
	return 'default';
}
