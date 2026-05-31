import type { SxProps, Theme } from '@mui/material';

export const calendarNodeSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		border: '1px solid',
		borderColor: isDark ? 'rgba(59, 130, 246, 0.35)' : 'rgba(37, 99, 235, 0.38)',
		borderRadius: 2,
		px: 1.5,
		py: 0.5,
		backdropFilter: 'blur(8px)',
		WebkitBackdropFilter: 'blur(8px)',
		bgcolor: isDark ? 'rgba(13, 31, 60, 0.58)' : 'rgba(255, 255, 255, 0.9)',
		boxShadow: isDark
			? '0 4px 14px rgba(10, 22, 40, 0.45), 0 1px 0 rgba(147, 197, 253, 0.14) inset'
			: '0 4px 12px rgba(13, 31, 60, 0.1), 0 1px 0 rgba(255, 255, 255, 0.9) inset',
		color: isDark ? '#e8eef8' : '#1e3471',
	};
};

export const calendarNodeMatchdayTextSx: SxProps<Theme> = (theme) => ({
	mx: 0.3,
	fontWeight: 600,
	fontFamily: "'Exo 2'",
	color: theme.palette.mode === 'dark' ? '#bfdbfe' : '#1e3471',
});

export const calendarNodeNoCalendarSx: SxProps<Theme> = (theme) => ({
	fontWeight: 600,
	width: '12rem',
	py: 0.5,
	textAlign: 'center',
	color: theme.palette.mode === 'dark' ? '#fca5a5' : '#b45309',
});
