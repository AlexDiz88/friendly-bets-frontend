import type { SxProps, Theme } from '@mui/material';
import { CUSTOM_BUTTON_FONT } from '../custom/btn/customButtonStyles';

export const oddsPickDialogPaperSx = (fullScreen: boolean): SxProps<Theme> => (theme) => ({
	bgcolor: theme.palette.mode === 'dark' ? '#0b1424' : '#eef4f0',
	backgroundImage: 'none',
	overflow: 'hidden',
	...(fullScreen ? {} : { maxHeight: 'min(90vh, 720px)' }),
	...(theme.palette.mode === 'dark'
		? {
				backgroundImage:
					'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 107, 66, 0.22) 0%, transparent 55%)',
			}
		: {}),
});

export const oddsPickDialogRootSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	maxHeight: '100dvh',
	minHeight: 0,
};

export const oddsPickDialogHeaderSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	px: { xs: 1.5, sm: 2 },
	pt: { xs: 1.25, sm: 1.5 },
	pb: 1.25,
	borderBottom: '1px solid',
	borderColor:
		theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.14)' : 'rgba(4, 90, 55, 0.14)',
	bgcolor:
		theme.palette.mode === 'dark' ? 'rgba(11, 20, 36, 0.96)' : 'rgba(238, 244, 240, 0.98)',
	backdropFilter: 'blur(12px)',
});

export const oddsPickDialogTitleRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	gap: 1,
	mb: 1,
};

export const oddsPickDialogTitleSx: SxProps<Theme> = (theme) => ({
	fontWeight: 800,
	fontSize: { xs: '1.15rem', sm: '1.25rem' },
	lineHeight: 1.2,
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(90deg, #9de8c4, #ffd966)'
			: 'linear-gradient(90deg, #046a3d, #8b6914)',
	backgroundClip: 'text',
	WebkitBackgroundClip: 'text',
	color: 'transparent',
});

export const oddsPickDialogCloseBtnSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	minWidth: 44,
	minHeight: 44,
	px: 1.5,
	borderRadius: 2,
	fontWeight: 700,
	fontSize: '0.85rem',
	fontFamily: CUSTOM_BUTTON_FONT,
	textTransform: 'none',
	color: theme.palette.mode === 'dark' ? '#ffd966' : '#6b5200',
	border: '1px solid',
	borderColor:
		theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.28)' : 'rgba(184, 134, 11, 0.35)',
	bgcolor:
		theme.palette.mode === 'dark' ? 'rgba(100, 75, 0, 0.18)' : 'rgba(240, 232, 200, 0.65)',
	'&:hover': {
		bgcolor:
			theme.palette.mode === 'dark' ? 'rgba(100, 75, 0, 0.32)' : 'rgba(240, 232, 200, 0.95)',
		borderColor:
			theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.45)' : 'rgba(184, 134, 11, 0.55)',
	},
});

export const oddsPickDialogTeamsRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: { xs: 0.75, sm: 1 },
};

export const oddsPickDialogTeamNameSx: SxProps<Theme> = (theme) => ({
	flex: 1,
	fontWeight: 700,
	fontSize: { xs: '0.85rem', sm: '0.95rem' },
	lineHeight: 1.25,
	color: theme.palette.mode === 'dark' ? '#e8f5ef' : '#1a3d2e',
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

export const oddsPickDialogHomeTeamNameSx: SxProps<Theme> = (theme) => ({
	...(typeof oddsPickDialogTeamNameSx === 'function'
		? oddsPickDialogTeamNameSx(theme)
		: oddsPickDialogTeamNameSx),
	textAlign: 'right',
});

export const oddsPickDialogAwayTeamNameSx: SxProps<Theme> = (theme) => ({
	...(typeof oddsPickDialogTeamNameSx === 'function'
		? oddsPickDialogTeamNameSx(theme)
		: oddsPickDialogTeamNameSx),
	textAlign: 'left',
});

export const oddsPickDialogTeamAvatarSx: SxProps<Theme> = {
	width: { xs: 32, sm: 36 },
	height: { xs: 32, sm: 36 },
	flexShrink: 0,
	borderRadius: 1,
	bgcolor: 'rgba(255,255,255,0.08)',
};

export const oddsPickDialogVsSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	fontWeight: 800,
	fontSize: '0.9rem',
	color: theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.75)' : '#8b6914',
	px: 0.25,
});

export const oddsPickDialogBodySx: SxProps<Theme> = {
	flex: 1,
	minHeight: 0,
	overflow: 'auto',
	px: { xs: 1.25, sm: 2 },
	py: 1.5,
	WebkitOverflowScrolling: 'touch',
};

export const oddsPickAccordionSx: SxProps<Theme> = (theme) => ({
	mb: 1.25,
	borderRadius: '12px !important',
	overflow: 'hidden',
	border: '1px solid',
	borderColor:
		theme.palette.mode === 'dark' ? 'rgba(0, 200, 120, 0.18)' : 'rgba(4, 90, 55, 0.14)',
	boxShadow:
		theme.palette.mode === 'dark'
			? '0 4px 16px rgba(0, 0, 0, 0.28)'
			: '0 2px 10px rgba(4, 90, 55, 0.08)',
	'&:before': { display: 'none' },
	'&.Mui-expanded': { margin: '0 0 10px 0' },
});

export const oddsPickAccordionSummarySx: SxProps<Theme> = (theme) => ({
	minHeight: 48,
	px: 1.5,
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(90deg, rgba(0,75,48,0.95) 0%, rgba(100,75,0,0.85) 50%, rgba(0,75,48,0.95) 100%)'
			: 'linear-gradient(90deg, #dceee4 0%, #f0e8c8 50%, #dceee4 100%)',
	color: theme.palette.mode === 'dark' ? '#fff4d6' : '#034d2e',
	'&.Mui-expanded': { minHeight: 48 },
	'& .MuiAccordionSummary-content': {
		my: 1,
		'&.Mui-expanded': { my: 1 },
	},
	'& .MuiAccordionSummary-expandIconWrapper': {
		color: 'inherit',
	},
});

export const oddsPickAccordionDetailsSx: SxProps<Theme> = (theme) => ({
	px: 0.75,
	py: 0.75,
	bgcolor: theme.palette.mode === 'dark' ? 'rgba(13, 20, 30, 0.55)' : 'rgba(255,255,255,0.72)',
});

export const oddsPickRowSx = (clickable: boolean): SxProps<Theme> => (theme) => ({
	display: 'flex',
	alignItems: 'center',
	gap: 1,
	minHeight: 48,
	px: 1.25,
	py: 0.75,
	mb: 0.5,
	borderRadius: 2,
	border: '1px solid',
	borderColor:
		theme.palette.mode === 'dark' ? 'rgba(0, 200, 120, 0.12)' : 'rgba(4, 90, 55, 0.1)',
	bgcolor:
		theme.palette.mode === 'dark' ? 'rgba(11, 20, 36, 0.65)' : 'rgba(255, 255, 255, 0.85)',
	cursor: clickable ? 'pointer' : 'default',
	transition: 'background-color 0.15s ease, border-color 0.15s ease, transform 0.1s ease',
	...(clickable
		? {
				'&:active': { transform: 'scale(0.985)' },
				'&:hover': {
					borderColor:
						theme.palette.mode === 'dark'
							? 'rgba(255, 214, 0, 0.35)'
							: 'rgba(184, 134, 11, 0.4)',
					bgcolor:
						theme.palette.mode === 'dark'
							? 'rgba(0, 80, 50, 0.28)'
							: 'rgba(232, 244, 239, 0.98)',
				},
			}
		: {}),
});

export const oddsPickRowLabelSx: SxProps<Theme> = (theme) => ({
	flex: 1,
	minWidth: 0,
	fontWeight: 600,
	fontSize: '0.9rem',
	color: theme.palette.mode === 'dark' ? '#e8f5ef' : '#1a3d2e',
});

export const oddsPickRowLineSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	fontWeight: 700,
	fontSize: '0.8rem',
	fontVariantNumeric: 'tabular-nums',
	color: theme.palette.mode === 'dark' ? '#9de8c4' : '#046a3d',
	minWidth: 40,
	textAlign: 'center',
});

export const oddsPickRowOddsSx: SxProps<Theme> = (theme) => ({
	flexShrink: 0,
	minWidth: 56,
	px: 1.25,
	py: 0.5,
	borderRadius: 1.5,
	fontWeight: 800,
	fontSize: '0.95rem',
	fontVariantNumeric: 'tabular-nums',
	textAlign: 'center',
	color: theme.palette.mode === 'dark' ? '#fff8e7' : '#034d2e',
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(135deg, rgba(0,107,66,0.85) 0%, rgba(107,82,0,0.75) 100%)'
			: 'linear-gradient(135deg, #046a3d 0%, #8b6914 100%)',
	boxShadow:
		theme.palette.mode === 'dark'
			? '0 2px 8px rgba(0, 200, 120, 0.18)'
			: '0 2px 6px rgba(4, 90, 55, 0.15)',
});

export const oddsPickEmptySx: SxProps<Theme> = (theme) => ({
	textAlign: 'center',
	py: 4,
	px: 2,
	fontSize: '0.9rem',
	color: theme.palette.mode === 'dark' ? 'rgba(157, 232, 196, 0.75)' : '#5a7a68',
});
