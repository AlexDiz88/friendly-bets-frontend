import type { SxProps, Theme } from '@mui/material';
import {
	EXTERNAL_DATA_LAYER_PALETTE,
	externalDataLayerPalette,
	type ExternalDataLayerPalette,
} from '../../shared/externalDataLayerColors';
import type { ExternalDataLayer, MonitoringStatus } from './externalApiMonitoringApi';

/** @deprecated Prefer shared `EXTERNAL_DATA_LAYER_PALETTE` — re-export for local use. */
export type LayerPalette = ExternalDataLayerPalette;

/** @deprecated Prefer `EXTERNAL_DATA_LAYER_PALETTE` from shared. */
export const LAYER_PALETTE = EXTERNAL_DATA_LAYER_PALETTE;

export function layerPalette(layer: ExternalDataLayer): ExternalDataLayerPalette {
	return externalDataLayerPalette(layer);
}

export const monitoringPageRootSx: SxProps<Theme> = {
	minWidth: 1100,
	maxWidth: 1400,
	mx: 'auto',
	px: 2.5,
	py: 2.5,
	pb: 5,
};

export const monitoringTitleSx: SxProps<Theme> = {
	fontFamily: '"Exo 2", sans-serif',
	fontWeight: 800,
	fontSize: '1.55rem',
	letterSpacing: '0.02em',
	mb: 0.5,
};

export const monitoringHintSx: SxProps<Theme> = (theme) => ({
	color: theme.palette.text.secondary,
	fontSize: '0.88rem',
	mb: 2,
	maxWidth: 720,
});

export const monitoringToolbarSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1.5,
	mb: 2.5,
	flexWrap: 'wrap',
};

export const monitoringKpiGridSx: SxProps<Theme> = {
	display: 'grid',
	gridTemplateColumns: 'repeat(4, 1fr)',
	gap: 1.25,
	mb: 3,
};

export function monitoringKpiCardSx(
	theme: Theme,
	layer: ExternalDataLayer,
	status?: MonitoringStatus | null
): SxProps<Theme> {
	const pal = layerPalette(layer);
	const isDark = theme.palette.mode === 'dark';
	const statusColor = statusAccent(status);
	return {
		position: 'relative',
		overflow: 'hidden',
		borderRadius: 2,
		border: `1.5px solid ${isDark ? pal.borderDark : pal.border}`,
		background: isDark
			? `linear-gradient(155deg, ${pal.surfaceDark} 0%, rgba(15,23,42,0.92) 72%)`
			: `linear-gradient(155deg, ${pal.surface} 0%, #ffffff 70%)`,
		px: 1.75,
		py: 1.5,
		minHeight: 96,
		boxShadow: isDark
			? `0 8px 24px rgba(0,0,0,0.32), 0 0 0 1px ${pal.borderDark}`
			: `0 8px 22px ${pal.soft}, 0 2px 6px rgba(15,23,42,0.06)`,
		'&::before': {
			content: '""',
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0,
			width: 5,
			background: `linear-gradient(180deg, ${pal.accent} 0%, ${statusColor} 100%)`,
		},
	};
}

export function monitoringLayerTitleSx(layer: ExternalDataLayer): SxProps<Theme> {
	return {
		fontWeight: 800,
		fontSize: '0.85rem',
		mb: 0.75,
		color: LAYER_PALETTE[layer].accent,
		letterSpacing: '0.03em',
	};
}

export function monitoringSectionSx(theme: Theme, layer: ExternalDataLayer): SxProps<Theme> {
	const pal = layerPalette(layer);
	const isDark = theme.palette.mode === 'dark';
	return {
		mb: 3,
		borderRadius: 2,
		border: `1.5px solid ${isDark ? pal.borderDark : pal.border}`,
		background: isDark
			? `linear-gradient(180deg, ${pal.surfaceDark} 0%, rgba(15,23,42,0.72) 40%)`
			: `linear-gradient(180deg, ${pal.surface} 0%, #ffffff 28%)`,
		overflow: 'hidden',
		boxShadow: isDark ? '0 6px 20px rgba(0,0,0,0.25)' : `0 6px 18px ${pal.soft}`,
	};
}

export function monitoringSectionHeaderSx(theme: Theme, layer: ExternalDataLayer): SxProps<Theme> {
	const pal = layerPalette(layer);
	const isDark = theme.palette.mode === 'dark';
	return {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		gap: 1,
		px: 2,
		py: 1.25,
		borderBottom: `1px solid ${isDark ? pal.borderDark : pal.border}`,
		background: isDark
			? `linear-gradient(90deg, ${pal.headerDark}, transparent 70%)`
			: `linear-gradient(90deg, ${pal.header}, transparent 70%)`,
	};
}

export function monitoringSectionTitleSx(layer: ExternalDataLayer): SxProps<Theme> {
	return {
		fontWeight: 800,
		fontSize: '0.95rem',
		color: LAYER_PALETTE[layer].accent,
		letterSpacing: '0.02em',
	};
}

export const monitoringTableContainerSx: SxProps<Theme> = {
	maxHeight: 360,
	overflow: 'auto',
};

export function monitoringTableSx(theme: Theme, layer: ExternalDataLayer): SxProps<Theme> {
	const pal = layerPalette(layer);
	const isDark = theme.palette.mode === 'dark';
	return {
		'& .MuiTableCell-root': {
			borderColor: isDark ? 'rgba(148,163,184,0.12)' : `${pal.accent}22`,
			py: 0.85,
			fontSize: '0.8rem',
			whiteSpace: 'nowrap',
		},
		'& .MuiTableHead-root .MuiTableCell-root': {
			fontWeight: 700,
			fontSize: '0.72rem',
			textTransform: 'uppercase',
			letterSpacing: '0.04em',
			color: isDark ? theme.palette.text.secondary : pal.accent,
			background: isDark ? 'rgba(15,23,42,0.95)' : pal.soft,
			position: 'sticky',
			top: 0,
			zIndex: 1,
		},
		'& .MuiTableBody-root .MuiTableRow-root:hover': {
			background: isDark ? pal.softDark : pal.soft,
		},
	};
}

/** Expanded HTTP-detail panel under a monitoring run row. */
export function monitoringDetailPanelSx(theme: Theme, layer: ExternalDataLayer): SxProps<Theme> {
	const pal = layerPalette(layer);
	const isDark = theme.palette.mode === 'dark';
	return {
		py: 1.5,
		px: 1.5,
		mx: 1,
		mb: 1,
		borderRadius: 1.5,
		border: `1px solid ${isDark ? pal.borderDark : pal.border}`,
		background: isDark ? pal.softDark : pal.soft,
		boxShadow: `inset 3px 0 0 ${pal.accent}`,
	};
}

export function monitoringDetailTableSx(theme: Theme, layer: ExternalDataLayer): SxProps<Theme> {
	const pal = layerPalette(layer);
	const isDark = theme.palette.mode === 'dark';
	return {
		'& .MuiTableCell-root': {
			borderColor: isDark ? 'rgba(148,163,184,0.12)' : `${pal.accent}28`,
			py: 0.75,
			fontSize: '0.78rem',
			whiteSpace: 'nowrap',
		},
		'& .MuiTableHead-root .MuiTableCell-root': {
			fontWeight: 700,
			fontSize: '0.7rem',
			textTransform: 'uppercase',
			letterSpacing: '0.04em',
			color: isDark ? theme.palette.text.secondary : pal.accent,
			background: isDark ? 'rgba(15,23,42,0.55)' : '#fff',
		},
		'& .MuiTableBody-root .MuiTableRow-root': {
			background: isDark ? 'rgba(15,23,42,0.4)' : 'rgba(255,255,255,0.85)',
		},
		'& .MuiTableBody-root .MuiTableRow-root:hover': {
			background: isDark ? pal.softDark : pal.soft,
		},
	};
}

export const monitoringDrawerPaperSx: SxProps<Theme> = (theme) => ({
	width: 480,
	maxWidth: '100%',
	p: 2.5,
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(180deg, #0f172a 0%, #111827 100%)'
			: '#fff',
});

export function statusAccent(status?: MonitoringStatus | null): string {
	switch (status) {
		case 'SUCCESS':
			return '#16a34a';
		case 'PARTIAL':
			return '#ea580c';
		case 'FAILED':
			return '#e11d48';
		case 'SKIPPED':
			return '#64748b';
		default:
			return '#64748b';
	}
}

export function statusChipSx(status?: MonitoringStatus | null): SxProps<Theme> {
	const color = statusAccent(status);
	return {
		fontWeight: 700,
		fontSize: '0.68rem',
		height: 22,
		color,
		borderColor: color,
		backgroundColor: `${color}28`,
	};
}
