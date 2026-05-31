import { alpha, type Theme } from '@mui/material/styles';

export type IssueSeverity = 'error' | 'warning' | 'info';

const SEVERITY_PALETTE: Record<IssueSeverity, { main: string; soft: string }> = {
	error: { main: '#ff6b6b', soft: '#ff6b6b' },
	warning: { main: '#ffb74d', soft: '#ffb74d' },
	info: { main: '#64b5f6', soft: '#64b5f6' },
};

export function getIssueSeverity(issueType: string | undefined): IssueSeverity {
	switch (issueType) {
		case 'API_SCORE_CHANGED':
		case 'INVALID_CANONICAL_SCORE':
		case 'PRIMARY_PROVIDER_UNAVAILABLE':
			return 'error';
		case 'TEAM_MAPPING_MISSING':
		case 'EVENT_MAPPING_MISSING':
		case 'PROVIDER_SCORE_MISMATCH':
			return 'warning';
		default:
			return 'info';
	}
}

export function getSeverityColors(theme: Theme, severity: IssueSeverity) {
	const palette = SEVERITY_PALETTE[severity];
	return {
		accent: palette.main,
		accentBg: alpha(palette.soft, theme.palette.mode === 'dark' ? 0.14 : 0.1),
		chipColor: palette.main,
	};
}

export function getProviderColors(theme: Theme, provider: string | undefined) {
	const p = (provider ?? '').toLowerCase();
	if (p.includes('football')) {
		return {
			color: '#4dd0e1',
			bg: alpha('#4dd0e1', theme.palette.mode === 'dark' ? 0.16 : 0.12),
		};
	}
	if (p.includes('odds')) {
		return {
			color: '#ce93d8',
			bg: alpha('#ce93d8', theme.palette.mode === 'dark' ? 0.16 : 0.12),
		};
	}
	return {
		color: theme.palette.text.secondary,
		bg: alpha(theme.palette.text.secondary, 0.1),
	};
}

export const EXTERNAL_SYNC_ISSUES_PAGE_SX = {
	maxWidth: 440,
	mx: 'auto',
	px: { xs: 2, sm: 2.5 },
	pb: 10,
	pt: 2,
} as const;

export const EXTERNAL_SYNC_ISSUES_HEADER_SX = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1,
	mb: 1.5,
	flexWrap: 'wrap',
} as const;

export const EXTERNAL_SYNC_ISSUES_TITLE_SX = {
	fontSize: { xs: '1.5rem', sm: '1.75rem' },
	fontWeight: 700,
	letterSpacing: '-0.02em',
} as const;

export const EXTERNAL_SYNC_ISSUES_COUNT_CHIP_SX = {
	fontFamily: '"Shantell Sans", cursive',
	fontWeight: 700,
	fontSize: '0.75rem',
	height: 26,
	borderRadius: 999,
} as const;

export const EXTERNAL_SYNC_ISSUES_TOOLBAR_SX = {
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	gap: 1,
	mb: 2,
} as const;

export const EXTERNAL_SYNC_ISSUES_LIST_SX = {
	display: 'flex',
	flexDirection: 'column',
	gap: 1.25,
} as const;

export const EXTERNAL_SYNC_ISSUES_EMPTY_SX = {
	textAlign: 'center',
	py: 4,
	px: 2,
	borderRadius: 2,
	border: 1,
	borderColor: 'divider',
	bgcolor: 'action.hover',
	color: 'text.secondary',
	fontSize: '0.9rem',
	lineHeight: 1.5,
} as const;
