import { alpha, type SxProps, type Theme } from '@mui/material/styles';

export const ODDS_DEMO_ACCENT = '#f0a030';
export const ODDS_DEMO_ACCENT_SOFT = '#5bc0be';

export const oddsDemoPageRootSx: SxProps<Theme> = {
	maxWidth: 1120,
	mx: 'auto',
	px: { xs: 1.5, sm: 2.5 },
	pb: 6,
	pt: 2,
};

export const oddsDemoTitleSx: SxProps<Theme> = {
	fontFamily: "'Exo 2'",
	fontWeight: 700,
	fontSize: { xs: '1.25rem', sm: '1.375rem' },
	letterSpacing: '-0.02em',
	lineHeight: 1.25,
	mb: 0.5,
};

export const oddsDemoHintSx: SxProps<Theme> = (theme) => ({
	borderRadius: 2,
	border: '1px solid',
	borderColor: alpha(ODDS_DEMO_ACCENT_SOFT, theme.palette.mode === 'dark' ? 0.35 : 0.45),
	background: alpha(ODDS_DEMO_ACCENT_SOFT, theme.palette.mode === 'dark' ? 0.08 : 0.06),
	color: theme.palette.text.secondary,
	fontSize: '0.8125rem',
	lineHeight: 1.5,
	px: 1.5,
	py: 1.25,
	mb: 2,
});

export function oddsDemoPanelSx(theme: Theme): SxProps<Theme> {
	const isDark = theme.palette.mode === 'dark';
	return {
		borderRadius: 2.5,
		border: '1px solid',
		borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
		background: isDark
			? 'linear-gradient(165deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
			: 'linear-gradient(165deg, #ffffff 0%, #f8fafc 100%)',
		boxShadow: isDark ? '0 8px 28px rgba(0,0,0,0.35)' : '0 4px 18px rgba(15,23,42,0.06)',
		p: { xs: 1.5, sm: 2 },
		mb: 2,
	};
}

export const oddsDemoToolbarRowSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	gap: 1,
	alignItems: 'flex-start',
	'&:not(:last-of-type)': { mb: 1.25 },
};

export const oddsDemoMatchListSx: SxProps<Theme> = (theme) => ({
	flex: '0 0 300px',
	maxHeight: { xs: 280, md: 520 },
	overflow: 'auto',
	borderRadius: 2,
	border: '1px solid',
	borderColor: theme.palette.divider,
	background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.7)',
});

export function oddsDemoMatchItemSx(theme: Theme, selected: boolean): SxProps<Theme> {
	return {
		display: 'flex',
		alignItems: 'flex-start',
		gap: 0.5,
		px: 1.25,
		py: 1.1,
		cursor: 'pointer',
		borderBottom: '1px solid',
		borderColor: 'divider',
		transition: 'background 0.15s ease',
		bgcolor: selected
			? alpha(ODDS_DEMO_ACCENT, theme.palette.mode === 'dark' ? 0.18 : 0.12)
			: 'transparent',
		'&:hover': {
			bgcolor: selected
				? alpha(ODDS_DEMO_ACCENT, theme.palette.mode === 'dark' ? 0.22 : 0.16)
				: alpha(theme.palette.text.primary, 0.04),
		},
	};
}

export const oddsDemoEventIdChipSx: SxProps<Theme> = (theme) => ({
	fontFamily: 'monospace',
	fontSize: '0.68rem',
	fontWeight: 600,
	color: theme.palette.mode === 'dark' ? ODDS_DEMO_ACCENT_SOFT : '#0d7377',
	bgcolor: alpha(ODDS_DEMO_ACCENT_SOFT, theme.palette.mode === 'dark' ? 0.14 : 0.12),
	borderRadius: 1,
	px: 0.75,
	py: 0.15,
	lineHeight: 1.4,
	flexShrink: 0,
});

export const oddsDemoDetailPanelSx: SxProps<Theme> = (theme) => ({
	flex: 1,
	minWidth: 0,
	borderRadius: 2,
	border: '1px solid',
	borderColor: theme.palette.divider,
	p: { xs: 1.25, sm: 1.75 },
	background: theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.85)',
});

export const oddsDemoApiEventsPreviewSx: SxProps<Theme> = (theme) => ({
	mt: 1,
	maxHeight: 160,
	overflow: 'auto',
	borderRadius: 1.5,
	border: '1px dashed',
	borderColor: theme.palette.divider,
	p: 1,
	fontSize: '0.75rem',
	fontFamily: 'monospace',
});

/** Основные табы: Кэфы / Маппинг — крупная сегмент-панель на всю ширину. */
export const oddsDemoViewTabsSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		minHeight: 48,
		mb: 2,
		borderRadius: 2.5,
		p: 0.625,
		bgcolor: isDark ? alpha(ODDS_DEMO_ACCENT, 0.07) : alpha(ODDS_DEMO_ACCENT, 0.1),
		border: '1px solid',
		borderColor: alpha(ODDS_DEMO_ACCENT, isDark ? 0.28 : 0.35),
		'& .MuiTabs-indicator': { display: 'none' },
		'& .MuiTabs-flexContainer': { gap: 0.75 },
		'& .MuiTab-root': {
			flex: 1,
			minHeight: 40,
			minWidth: 0,
			py: 0.875,
			px: 2,
			borderRadius: 2,
			fontFamily: "'Exo 2'",
			fontSize: '1rem',
			fontWeight: 600,
			textTransform: 'none',
			color: 'text.secondary',
			transition: 'background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease',
			'&:hover': {
				color: 'text.primary',
				bgcolor: isDark ? alpha(ODDS_DEMO_ACCENT, 0.1) : alpha(ODDS_DEMO_ACCENT, 0.12),
			},
			'&.Mui-selected': {
				color: isDark ? '#fff' : theme.palette.text.primary,
				bgcolor: isDark ? alpha(ODDS_DEMO_ACCENT, 0.32) : alpha(ODDS_DEMO_ACCENT, 0.28),
				boxShadow: isDark
					? `0 3px 12px ${alpha(ODDS_DEMO_ACCENT, 0.28)}`
					: `0 3px 10px ${alpha(ODDS_DEMO_ACCENT, 0.22)}`,
			},
		},
	};
};

/** Вложенные табы букмекеров — компактные chip-кнопки без общей «коробки». */
export const oddsDemoDebugTabsSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		minHeight: 36,
		mb: 1.5,
		p: 0,
		bgcolor: 'transparent',
		border: 'none',
		borderBottom: '1px solid',
		borderColor: 'divider',
		'& .MuiTabs-indicator': { display: 'none' },
		'& .MuiTabs-flexContainer': { gap: 0.625 },
		'& .MuiTab-root': {
			minHeight: 28,
			minWidth: 0,
			py: 0.375,
			px: 1.25,
			borderRadius: '999px',
			fontSize: '0.6875rem',
			fontWeight: 700,
			letterSpacing: '0.05em',
			textTransform: 'uppercase',
			color: 'text.secondary',
			border: '1px solid',
			borderColor: 'transparent',
			opacity: 1,
			transition: 'background 0.15s ease, color 0.15s ease, border-color 0.15s ease',
			'&:hover': {
				color: 'text.primary',
				borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)',
				bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(15,23,42,0.03)',
			},
			'&.Mui-selected': {
				color: ODDS_DEMO_ACCENT_SOFT,
				borderColor: alpha(ODDS_DEMO_ACCENT_SOFT, isDark ? 0.55 : 0.5),
				bgcolor: isDark ? alpha(ODDS_DEMO_ACCENT_SOFT, 0.12) : alpha(ODDS_DEMO_ACCENT_SOFT, 0.1),
				boxShadow: 'none',
			},
		},
		'& .MuiTab-root:last-of-type.Mui-selected': {
			color: ODDS_DEMO_ACCENT,
			borderColor: alpha(ODDS_DEMO_ACCENT, isDark ? 0.55 : 0.45),
			bgcolor: isDark ? alpha(ODDS_DEMO_ACCENT, 0.12) : alpha(ODDS_DEMO_ACCENT, 0.1),
		},
	};
};

export const oddsDemoDebugTabsWrapSx: SxProps<Theme> = (theme) => ({
	pl: { xs: 0, sm: 1.5 },
	ml: { xs: 0, sm: 0.5 },
	borderLeft: { xs: 'none', sm: '3px solid' },
	borderColor: { sm: alpha(ODDS_DEMO_ACCENT_SOFT, theme.palette.mode === 'dark' ? 0.35 : 0.4) },
});
