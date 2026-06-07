import type { SxProps, Theme } from '@mui/material';

/** `<main>` без отдельной подложки — фон страницы из темы */
export const appMainBackgroundSx: SxProps<Theme> = {
	bgcolor: 'transparent',
	backgroundImage: 'none',
};

/** Узкая колонка контента на главной */
export const homepageContentLayoutSx: SxProps<Theme> = {
	width: '100%',
	maxWidth: { xs: 'none', sm: '25rem' },
	mx: { xs: 0, sm: 'auto' },
};
