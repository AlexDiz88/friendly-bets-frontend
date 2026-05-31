import type { SxProps, Theme } from '@mui/material';

export const PROFILE_PAGE_MAX_WIDTH = 420;

export const profilePageRootSx: SxProps<Theme> = {
	width: '100%',
	maxWidth: PROFILE_PAGE_MAX_WIDTH,
	mx: 'auto',
	px: { xs: 1.5, sm: 2 },
	pb: { xs: 4, sm: 5 },
	pt: { xs: 1, sm: 2 },
	boxSizing: 'border-box',
};

export const profilePageTitleSx: SxProps<Theme> = {
	fontSize: { xs: '1.5rem', sm: '1.625rem' },
	fontWeight: 700,
	letterSpacing: '-0.02em',
	textAlign: 'left',
	mt: '-10px',
	mb: '1px',
};

export const profileGroupHeadingSx: SxProps<Theme> = {
	display: 'block',
	typography: 'overline',
	color: 'text.secondary',
	fontWeight: 700,
	letterSpacing: '0.08em',
	mb: 1,
	mt: 2,
	textAlign: 'left',
	'&:first-of-type': { mt: 0 },
};

export const profileSectionGroupSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 1,
	mb: 1,
};

export const profileHeroSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		display: 'flex',
		alignItems: 'center',
		gap: 2,
		p: 2,
		mb: 2,
		borderRadius: 2.5,
		border: 1,
		borderColor: 'divider',
		bgcolor: isDark ? 'rgba(13, 31, 60, 0.55)' : 'background.paper',
		boxShadow: isDark
			? '0 8px 24px rgba(0, 0, 0, 0.22)'
			: '0 8px 24px rgba(13, 31, 60, 0.06)',
	};
};

export const profileHeroAvatarSx: SxProps<Theme> = {
	width: { xs: '4.5rem', sm: '5rem' },
	height: { xs: '4.5rem', sm: '5rem' },
	border: 2,
	borderColor: 'divider',
	flexShrink: 0,
};

export const profileHeroNameSx: SxProps<Theme> = {
	fontWeight: 700,
	fontSize: '1.05rem',
	lineHeight: 1.3,
	wordBreak: 'break-word',
};

export const profileHeroEmailSx: SxProps<Theme> = {
	fontSize: '0.8125rem',
	color: 'text.secondary',
	mt: 0.25,
	wordBreak: 'break-all',
};

export const profileItemCardSx: SxProps<Theme> = {
	p: { xs: 1.5, sm: 1.75 },
	borderRadius: 2,
	border: 1,
	borderColor: 'divider',
	bgcolor: 'background.paper',
	textAlign: 'left',
	width: '100%',
	boxSizing: 'border-box',
};

export const profileItemRowSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: { xs: 'column', sm: 'row' },
	alignItems: { xs: 'stretch', sm: 'center' },
	justifyContent: 'space-between',
	gap: 1.25,
};

export const profileItemLabelSx: SxProps<Theme> = {
	fontSize: '0.6875rem',
	fontWeight: 700,
	letterSpacing: '0.06em',
	textTransform: 'uppercase',
	color: 'text.secondary',
	mb: 0.35,
};

export const profileItemValueSx: SxProps<Theme> = {
	fontSize: '0.9375rem',
	fontWeight: 500,
	lineHeight: 1.35,
	wordBreak: 'break-word',
};

export const profileItemValueRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	gap: 0.75,
	flexWrap: 'wrap',
};

export const profileItemActionSx: SxProps<Theme> = {
	alignSelf: { xs: 'stretch', sm: 'center' },
	flexShrink: 0,
	minWidth: { sm: 'auto' },
};

export const profileAccountBlockSx: SxProps<Theme> = {
	p: { xs: 1.5, sm: 1.75 },
	borderRadius: 2,
	border: 1,
	borderColor: 'divider',
	bgcolor: 'background.paper',
	textAlign: 'left',
	width: '100%',
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	gap: 1,
};

export const profileAccountActionButtonSx: SxProps<Theme> = {
	width: '100%',
};

export const profileEditPanelSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 1.5,
};

export const profileEditActionsSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: { xs: 'column-reverse', sm: 'row' },
	gap: 1,
	justifyContent: 'flex-end',
	'& .MuiButton-root': {
		width: { xs: '100%', sm: 'auto' },
	},
};

export const profileFullWidthFieldSx: SxProps<Theme> = {
	width: '100%',
};

export const profileVerificationBannerSx: SxProps<Theme> = {
	width: '100%',
	mb: 2,
	'& .MuiAlert-root': {
		borderRadius: 2,
		py: '4px',
		px: '10px',
	},
};
