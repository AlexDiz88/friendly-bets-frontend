import type { SxProps, Theme } from '@mui/material';

export const authPageRootSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: { xs: 'flex-start', sm: 'center' },
	px: { xs: 2, sm: 3 },
	py: { xs: 2.5, sm: 4 },
	minHeight: { xs: 'calc(100dvh - 7.5rem)', sm: 'auto' },
	boxSizing: 'border-box',
};

export const authCardSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		width: '100%',
		maxWidth: '22.5rem',
		p: { xs: 2.5, sm: 3 },
		borderRadius: 3,
		border: 1,
		borderColor: isDark ? 'rgba(59, 130, 246, 0.24)' : 'rgba(37, 99, 235, 0.14)',
		bgcolor: isDark ? 'rgba(13, 31, 60, 0.78)' : 'rgba(255, 255, 255, 0.94)',
		boxShadow: isDark
			? '0 16px 48px rgba(0, 0, 0, 0.38), 0 0 0 1px rgba(96, 165, 250, 0.1) inset'
			: '0 16px 40px rgba(13, 31, 60, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.85) inset',
		backdropFilter: 'blur(14px)',
		boxSizing: 'border-box',
	};
};

export const authTitleSx: SxProps<Theme> = {
	fontSize: { xs: '1.625rem', sm: '1.75rem' },
	fontWeight: 700,
	letterSpacing: '-0.02em',
	textAlign: 'center',
	mb: 0.75,
	lineHeight: 1.2,
};

export const authSubtitleSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.875rem',
	lineHeight: 1.5,
	textAlign: 'center',
	color: theme.palette.mode === 'dark' ? 'rgba(232, 238, 248, 0.68)' : 'text.secondary',
	mb: 2.5,
});

export const authFieldSx: SxProps<Theme> = {
	mb: 2,
};

export const authTextFieldSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		'& .MuiOutlinedInput-root': {
			borderRadius: 2,
			bgcolor: isDark ? 'rgba(10, 22, 40, 0.55)' : 'rgba(248, 250, 252, 0.95)',
			transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
			'&:hover .MuiOutlinedInput-notchedOutline': {
				borderColor: isDark ? 'rgba(96, 165, 250, 0.45)' : 'rgba(37, 99, 235, 0.45)',
			},
			'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
				borderColor: isDark ? 'rgba(96, 165, 250, 0.7)' : 'rgba(37, 99, 235, 0.65)',
				boxShadow: isDark
					? '0 0 0 3px rgba(59, 130, 246, 0.18)'
					: '0 0 0 3px rgba(37, 99, 235, 0.12)',
			},
		},
	};
};

export const authSubmitButtonSx: SxProps<Theme> = {
	width: '100%',
	minWidth: '100%',
	height: '3.1rem',
	px: 2,
	mt: 0.5,
};

export const authLinksStackSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 1.25,
	mt: 2,
};

export const authSecondaryLinkSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		fontSize: '0.875rem',
		fontWeight: 500,
		color: isDark ? 'rgba(232, 238, 248, 0.78)' : 'primary.main',
		textDecorationColor: isDark ? 'rgba(232, 238, 248, 0.42)' : undefined,
		'&:hover': {
			color: isDark ? 'rgba(232, 238, 248, 0.92)' : 'primary.dark',
		},
	};
};

export const authRegisterLinkSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		fontSize: '0.9375rem',
		fontWeight: 600,
		color: isDark ? 'rgba(232, 238, 248, 0.88)' : 'primary.main',
		textDecorationColor: isDark ? 'rgba(232, 238, 248, 0.45)' : undefined,
		'&:hover': {
			color: isDark ? '#ffffff' : 'primary.dark',
		},
	};
};
