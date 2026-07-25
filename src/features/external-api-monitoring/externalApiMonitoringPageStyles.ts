import type { SxProps, Theme } from '@mui/material';
import type { MonitoringStatus } from './externalApiMonitoringApi';

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

export function monitoringKpiCardSx(theme: Theme, status?: MonitoringStatus | null): SxProps<Theme> {
	const accent = statusAccent(status);
	const isDark = theme.palette.mode === 'dark';
	return {
		position: 'relative',
		overflow: 'hidden',
		borderRadius: 2,
		border: `1px solid ${isDark ? 'rgba(148,163,184,0.18)' : 'rgba(15,23,42,0.1)'}`,
		background: isDark
			? 'linear-gradient(160deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.92) 100%)'
			: 'linear-gradient(160deg, #ffffff 0%, #f8fafc 100%)',
		px: 1.75,
		py: 1.5,
		minHeight: 96,
		boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.28)' : '0 6px 18px rgba(15,23,42,0.06)',
		'&::before': {
			content: '""',
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0,
			width: 4,
			background: accent,
		},
	};
}

export const monitoringSectionSx: SxProps<Theme> = (theme) => ({
	mb: 3,
	borderRadius: 2,
	border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.16)' : 'rgba(15,23,42,0.08)'}`,
	background:
		theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.55)' : 'rgba(255,255,255,0.9)',
	overflow: 'hidden',
});

export const monitoringSectionHeaderSx: SxProps<Theme> = (theme) => ({
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1,
	px: 2,
	py: 1.25,
	borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.12)' : 'rgba(15,23,42,0.06)'}`,
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(90deg, rgba(14,165,233,0.08), transparent)'
			: 'linear-gradient(90deg, rgba(14,165,233,0.06), transparent)',
});

export const monitoringTableContainerSx: SxProps<Theme> = {
	maxHeight: 360,
	overflow: 'auto',
};

export const monitoringTableSx: SxProps<Theme> = (theme) => ({
	'& .MuiTableCell-root': {
		borderColor: theme.palette.mode === 'dark' ? 'rgba(148,163,184,0.1)' : 'rgba(15,23,42,0.06)',
		py: 0.85,
		fontSize: '0.8rem',
		whiteSpace: 'nowrap',
	},
	'& .MuiTableHead-root .MuiTableCell-root': {
		fontWeight: 700,
		fontSize: '0.72rem',
		textTransform: 'uppercase',
		letterSpacing: '0.04em',
		color: theme.palette.text.secondary,
		background: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.95)' : 'rgba(248,250,252,0.98)',
		position: 'sticky',
		top: 0,
		zIndex: 1,
	},
	'& .MuiTableBody-root .MuiTableRow-root:hover': {
		background:
			theme.palette.mode === 'dark' ? 'rgba(14,165,233,0.06)' : 'rgba(14,165,233,0.04)',
	},
});

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
			return '#22c55e';
		case 'PARTIAL':
			return '#f59e0b';
		case 'FAILED':
			return '#f43f5e';
		case 'SKIPPED':
			return '#94a3b8';
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
		backgroundColor: `${color}22`,
	};
}
