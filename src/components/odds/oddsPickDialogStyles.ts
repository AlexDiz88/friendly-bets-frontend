import type { SxProps, Theme } from '@mui/material';
import { CUSTOM_BUTTON_FONT } from '../custom/btn/customButtonStyles';

/** WC26 green + gold — единая палитра диалога ставок (без хаки/оранжевого). */
const oddsPickPalette = (mode: 'light' | 'dark') => {
	if (mode === 'dark') {
		return {
			surface: '#0b1424',
			surfaceGlass: 'rgba(11, 20, 36, 0.92)',
			card: 'rgba(13, 20, 30, 0.78)',
			cardHover: 'rgba(0, 80, 50, 0.24)',
			inset: 'rgba(8, 14, 24, 0.55)',
			text: '#e8f5ef',
			textMuted: 'rgba(157, 232, 196, 0.72)',
			green: '#9de8c4',
			greenDeep: '#003d24',
			greenMid: '#005538',
			gold: '#ffd966',
			goldBorder: 'rgba(255, 214, 0, 0.32)',
			divider: 'rgba(0, 200, 120, 0.16)',
			oddsText: '#fff8e7',
			oddsBg: 'linear-gradient(180deg, #003322 0%, #005a38 100%)',
			oddsBgHover: 'linear-gradient(180deg, #004830 0%, #006b42 100%)',
			oddsBorder: 'rgba(255, 214, 0, 0.28)',
		};
	}
	return {
		surface: '#e8f4ef',
		surfaceGlass: 'rgba(255, 255, 255, 0.94)',
		card: '#ffffff',
		cardHover: 'rgba(232, 244, 239, 0.98)',
		inset: 'rgba(244, 248, 246, 0.92)',
		text: '#1a3d2e',
		textMuted: '#5a7a68',
		green: '#046a3d',
		greenDeep: '#034d2e',
		greenMid: '#057a4a',
		gold: '#8b6914',
		goldBorder: 'rgba(184, 134, 11, 0.38)',
		divider: 'rgba(4, 90, 55, 0.12)',
		oddsText: '#fff8e7',
		oddsBg: 'linear-gradient(180deg, #034d2e 0%, #046a3d 100%)',
		oddsBgHover: 'linear-gradient(180deg, #046a3d 0%, #057a4a 100%)',
		oddsBorder: 'rgba(184, 134, 11, 0.42)',
	};
};

export const oddsPickDialogPaperSx = (fullScreen: boolean): SxProps<Theme> => (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		bgcolor: isDark ? '#0b1424' : '#e8f4ef',
		overflow: 'hidden',
		...(fullScreen ? {} : { maxHeight: 'min(90vh, 720px)' }),
		backgroundImage: isDark
			? 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 107, 66, 0.22) 0%, transparent 55%)'
			: 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 168, 107, 0.14) 0%, transparent 55%), linear-gradient(180deg, #e8f4ef 0%, #f5f7fa 45%)',
	};
};

export const oddsPickDialogRootSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	height: '100%',
	maxHeight: '100dvh',
	minHeight: 0,
};

export const oddsPickDialogHeaderSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		flexShrink: 0,
		px: { xs: 1.5, sm: 2 },
		pt: { xs: 1.25, sm: 1.5 },
		pb: 1.25,
		borderBottom: '1px solid',
		borderColor: p.divider,
		bgcolor: p.surfaceGlass,
		backdropFilter: 'blur(14px)',
		boxShadow:
			theme.palette.mode === 'dark'
				? '0 4px 20px rgba(0, 0, 0, 0.25)'
				: '0 2px 12px rgba(4, 90, 55, 0.06)',
	};
};

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
	textTransform: 'none',
	background:
		theme.palette.mode === 'dark'
			? 'linear-gradient(90deg, #9de8c4 0%, #ffd966 100%)'
			: 'linear-gradient(90deg, #034d2e 0%, #046a3d 55%, #8b6914 100%)',
	backgroundClip: 'text',
	WebkitBackgroundClip: 'text',
	color: 'transparent',
});

const oddsPickHeaderControlSx = (theme: Theme): Record<string, unknown> => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		minWidth: 44,
		minHeight: 44,
		borderRadius: 2,
		fontWeight: 700,
		color: isDark ? p.gold : p.gold,
		border: '1px solid',
		borderColor: p.goldBorder,
		bgcolor: isDark ? 'rgba(100, 75, 0, 0.16)' : 'rgba(240, 232, 200, 0.55)',
		transition: 'background-color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
		'&:hover': {
			borderColor: isDark ? 'rgba(255, 214, 0, 0.48)' : 'rgba(184, 134, 11, 0.58)',
			bgcolor: isDark ? 'rgba(100, 75, 0, 0.28)' : 'rgba(240, 232, 200, 0.92)',
			boxShadow: isDark
				? '0 0 12px rgba(255, 214, 0, 0.12)'
				: '0 2px 8px rgba(4, 90, 55, 0.1)',
		},
	};
};

export const oddsPickDialogCloseBtnSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		flexShrink: 0,
		px: 1.5,
		fontSize: '0.85rem',
		fontWeight: 700,
		fontFamily: CUSTOM_BUTTON_FONT,
		textTransform: 'none',
		minWidth: 44,
		minHeight: 44,
		borderRadius: 2,
		color: isDark ? '#fecaca' : '#b91c1c',
		border: '1px solid',
		borderColor: isDark ? 'rgba(248, 113, 113, 0.42)' : 'rgba(220, 38, 38, 0.48)',
		background: isDark
			? 'linear-gradient(180deg, rgba(127, 29, 29, 0.55) 0%, rgba(153, 27, 27, 0.42) 100%)'
			: 'linear-gradient(180deg, rgba(254, 242, 242, 0.95) 0%, rgba(254, 226, 226, 0.88) 100%)',
		boxShadow: isDark
			? 'inset 0 1px 0 rgba(252, 165, 165, 0.12)'
			: 'inset 0 1px 0 rgba(255, 255, 255, 0.85)',
		transition: 'background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, color 0.15s ease',
		'&:hover': {
			color: isDark ? '#fff5f5' : '#991b1b',
			borderColor: isDark ? 'rgba(252, 165, 165, 0.62)' : 'rgba(248, 113, 113, 0.72)',
			background: isDark
				? 'linear-gradient(180deg, rgba(153, 27, 27, 0.72) 0%, rgba(185, 28, 28, 0.58) 100%)'
				: 'linear-gradient(180deg, rgba(254, 226, 226, 0.98) 0%, rgba(252, 165, 165, 0.35) 100%)',
			boxShadow: isDark
				? '0 0 14px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(254, 202, 202, 0.18)'
				: '0 2px 8px rgba(220, 38, 38, 0.14), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
		},
	};
};

export const oddsPickDialogHeaderActionsSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	gap: 0.5,
	flexShrink: 0,
};

export const oddsPickDialogThemeToggleSx: SxProps<Theme> = (theme) => oddsPickHeaderControlSx(theme);

export const oddsPickDialogTeamsRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	gap: { xs: 0.75, sm: 1 },
};

export const oddsPickDialogTeamNameSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		flex: 1,
		fontWeight: 700,
		fontSize: { xs: '0.85rem', sm: '0.95rem' },
		lineHeight: 1.25,
		color: p.text,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
	};
};

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

export const oddsPickDialogTeamAvatarSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		width: { xs: 32, sm: 36 },
		height: { xs: 32, sm: 36 },
		flexShrink: 0,
		borderRadius: 1,
		bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#fff',
		border: '1px solid',
		borderColor: p.divider,
		boxShadow:
			theme.palette.mode === 'dark' ? 'none' : '0 1px 4px rgba(4, 90, 55, 0.08)',
	};
};

export const oddsPickDialogVsSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		flexShrink: 0,
		fontWeight: 800,
		fontSize: '0.9rem',
		color: theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.75)' : p.gold,
		px: 0.25,
	};
};

export const oddsPickDialogBodySx: SxProps<Theme> = {
	flex: 1,
	minHeight: 0,
	overflow: 'auto',
	px: { xs: 1.25, sm: 2 },
	py: 1.5,
	WebkitOverflowScrolling: 'touch',
};

export const oddsPickAccordionSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		mb: 1.25,
		borderRadius: '12px !important',
		overflow: 'hidden',
		border: '1px solid',
		borderColor: isDark ? 'rgba(0, 200, 120, 0.2)' : 'rgba(4, 90, 55, 0.14)',
		bgcolor: p.card,
		boxShadow: isDark
			? '0 4px 20px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
			: '0 4px 16px rgba(4, 90, 55, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
		'&:before': { display: 'none' },
		'&.Mui-expanded': { margin: '0 0 10px 0' },
	};
};

export const oddsPickAccordionSummarySx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		minHeight: 46,
		px: 1.5,
		position: 'relative',
		background: isDark
			? 'linear-gradient(90deg, rgba(0, 68, 42, 0.92) 0%, rgba(0, 90, 55, 0.96) 50%, rgba(0, 68, 42, 0.92) 100%)'
			: 'linear-gradient(90deg, rgba(232, 244, 239, 0.95) 0%, rgba(220, 238, 228, 1) 50%, rgba(232, 244, 239, 0.95) 100%)',
		color: isDark ? '#fff4d6' : p.greenDeep,
		borderBottom: '1px solid',
		borderColor: p.divider,
		'&::before': {
			content: '""',
			position: 'absolute',
			left: 0,
			top: 0,
			bottom: 0,
			width: 3,
			background: isDark
				? 'linear-gradient(180deg, #ffd966 0%, rgba(255, 214, 0, 0.35) 100%)'
				: 'linear-gradient(180deg, #8b6914 0%, #046a3d 100%)',
		},
		'&.Mui-expanded': { minHeight: 46 },
		'& .MuiAccordionSummary-content': {
			my: 1,
			pl: 0.75,
			'&.Mui-expanded': { my: 1 },
		},
		'& .MuiAccordionSummary-expandIconWrapper': {
			color: isDark ? 'rgba(255, 214, 0, 0.8)' : p.gold,
		},
	};
};

export const oddsPickAccordionDetailsSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		px: 0.75,
		py: 0.875,
		bgcolor: isDark ? p.inset : p.inset,
		backgroundImage: isDark
			? 'none'
			: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(244,248,246,0.85) 100%)',
	};
};

/** Область подкатегорий внутри parent-аккордеона — без бокового inset-поля. */
export const oddsPickNestedParentDetailsSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		px: 0.5,
		pt: 0.75,
		pb: 0.75,
		bgcolor: isDark ? 'rgba(8, 14, 24, 0.45)' : 'rgba(248, 251, 249, 0.72)',
		backgroundImage: 'none',
	};
};

export const oddsPickNestedListSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	gap: 0.35,
};

/** Подкатегория — приглушённее parent, без золотой полосы. */
export const oddsPickSubAccordionSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		mb: 0,
		borderRadius: '10px !important',
		overflow: 'hidden',
		border: '1px solid',
		borderColor: isDark ? 'rgba(0, 200, 120, 0.12)' : 'rgba(4, 90, 55, 0.1)',
		bgcolor: isDark ? 'rgba(8, 14, 24, 0.78)' : 'rgba(255, 255, 255, 0.98)',
		boxShadow: isDark ? 'inset 0 1px 0 rgba(255, 255, 255, 0.03)' : '0 1px 4px rgba(4, 90, 55, 0.04)',
		'&:before': { display: 'none' },
		'&.Mui-expanded': { margin: 0 },
	};
};

export const oddsPickSubAccordionSummarySx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		minHeight: 40,
		px: 1.25,
		background: isDark
			? 'linear-gradient(90deg, rgba(0, 42, 28, 0.72) 0%, rgba(0, 55, 36, 0.58) 100%)'
			: 'linear-gradient(90deg, rgba(240, 247, 243, 1) 0%, rgba(232, 241, 236, 1) 100%)',
		color: isDark ? 'rgba(157, 232, 196, 0.88)' : p.textMuted,
		borderBottom: '1px solid',
		borderColor: isDark ? 'rgba(0, 200, 120, 0.08)' : 'rgba(4, 90, 55, 0.08)',
		'&.Mui-expanded': { minHeight: 40 },
		'& .MuiAccordionSummary-content': {
			my: 0.65,
			pl: 0.25,
			'&.Mui-expanded': { my: 0.65 },
		},
		'& .MuiAccordionSummary-expandIconWrapper': {
			color: isDark ? 'rgba(157, 232, 196, 0.5)' : 'rgba(90, 122, 104, 0.55)',
		},
	};
};

export const oddsPickSubAccordionDetailsSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		px: 0.5,
		py: 0.5,
		bgcolor: isDark ? 'rgba(6, 11, 20, 0.55)' : 'rgba(248, 251, 249, 0.95)',
	};
};

export const oddsPickRowSx = (clickable: boolean): SxProps<Theme> => (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		display: 'flex',
		alignItems: 'stretch',
		gap: 0,
		minHeight: 48,
		pl: 1.25,
		pr: 0,
		py: 0,
		mb: 0.5,
		borderRadius: 2,
		overflow: 'hidden',
		border: '1px solid',
		borderColor: p.divider,
		bgcolor: isDark ? 'rgba(11, 20, 36, 0.55)' : '#fff',
		cursor: clickable ? 'pointer' : 'default',
		transition: 'border-color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease',
		boxShadow: isDark ? 'none' : '0 1px 3px rgba(4, 90, 55, 0.05)',
		'&:last-child': { mb: 0 },
		...(clickable
			? {
					'&:active': { transform: 'scale(0.992)' },
					'&:hover': {
						borderColor: isDark ? 'rgba(255, 214, 0, 0.32)' : 'rgba(4, 90, 55, 0.22)',
						bgcolor: p.cardHover,
						boxShadow: isDark
							? '0 0 0 1px rgba(0, 200, 120, 0.12)'
							: '0 3px 10px rgba(4, 90, 55, 0.1)',
						'& > .odds-pick-row-odds': {
							background: p.oddsBgHover,
							borderColor: isDark ? 'rgba(255, 214, 0, 0.38)' : p.oddsBorder,
							boxShadow: isDark
								? 'inset 0 1px 0 rgba(255,255,255,0.12), 0 0 14px rgba(0, 200, 120, 0.18)'
								: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 0 10px rgba(4, 90, 55, 0.12)',
						},
					},
				}
			: {}),
	};
};

export const oddsPickRowLabelSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		flex: 1,
		minWidth: 0,
		display: 'flex',
		alignItems: 'center',
		fontWeight: 600,
		fontSize: '0.9rem',
		color: p.text,
		py: 0.75,
		pr: 1,
	};
};

export const oddsPickRowLineSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		flexShrink: 0,
		fontWeight: 700,
		fontSize: '0.8rem',
		fontVariantNumeric: 'tabular-nums',
		color: theme.palette.mode === 'dark' ? p.green : p.greenMid,
		minWidth: 40,
		textAlign: 'center',
	};
};

/** Кэф — правая панель строки (bookmaker-style), в той же зелёной семье что и секции. */
export const oddsPickRowOddsSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		className: 'odds-pick-row-odds',
		flexShrink: 0,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: { xs: 64, sm: 72 },
		px: 1.25,
		alignSelf: 'stretch',
		fontWeight: 800,
		fontSize: '0.95rem',
		fontVariantNumeric: 'tabular-nums',
		textAlign: 'center',
		color: p.oddsText,
		background: p.oddsBg,
		borderLeft: '1px solid',
		borderColor: p.oddsBorder,
		boxShadow: isDark
			? 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
			: 'inset 0 1px 0 rgba(255, 255, 255, 0.14)',
		transition: 'background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease',
	};
};

export const oddsPickEmptySx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		textAlign: 'center',
		py: 4,
		px: 2,
		fontSize: '0.9rem',
		color: p.textMuted,
	};
};

export const oddsPickConfirmSummarySx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 0.75,
	mt: 1.25,
	mb: 0,
	px: 0.5,
	maxWidth: '100%',
	width: '100%',
};

export const oddsPickConfirmTeamsRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'flex-start',
	justifyContent: 'center',
	gap: { xs: 0.5, sm: 0.75 },
	width: '100%',
};

export const oddsPickConfirmTeamSideSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: 0.35,
	flex: 1,
	minWidth: 0,
	maxWidth: '46%',
};

export const oddsPickConfirmTeamAvatarSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		width: { xs: 32, sm: 36 },
		height: { xs: 32, sm: 36 },
		flexShrink: 0,
		borderRadius: 1,
		bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#fff',
		border: '1px solid',
		borderColor: p.divider,
	};
};

export const oddsPickConfirmTeamNameSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		fontWeight: 600,
		fontSize: isDark ? { xs: '0.75rem', sm: '0.85rem' } : { xs: '0.65rem', sm: '0.75rem' },
		lineHeight: 1.15,
		textAlign: 'center',
		color: isDark ? '#ffffff' : p.textMuted,
		overflowWrap: 'anywhere',
		wordBreak: 'break-word',
		whiteSpace: 'normal',
		hyphens: 'auto',
	};
};

export const oddsPickConfirmVsSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		flexShrink: 0,
		alignSelf: 'center',
		fontWeight: 800,
		fontSize: '0.85rem',
		color: theme.palette.mode === 'dark' ? 'rgba(255, 214, 0, 0.75)' : p.gold,
		px: 0.25,
		mt: 0.25,
	};
};

export const oddsPickConfirmBetRowSx: SxProps<Theme> = {
	display: 'flex',
	flexWrap: 'wrap',
	justifyContent: 'center',
	alignItems: 'baseline',
	gap: 0.5,
	rowGap: 0.25,
	mt: 1.25,
	maxWidth: '100%',
	width: '100%',
	textAlign: 'center',
};

export const oddsPickConfirmBetLabelSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		flexShrink: 0,
		fontWeight: 600,
		fontSize: { xs: '0.9rem', sm: '1rem' },
		lineHeight: 1.2,
		color: isDark ? '#ffffff' : p.textMuted,
	};
};

export const oddsPickConfirmBetTitleSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		fontWeight: 800,
		fontSize: { xs: '1.35rem', sm: '1.5rem' },
		lineHeight: 1.2,
		maxWidth: '100%',
		overflowWrap: 'anywhere',
		color: isDark ? p.green : p.greenDeep,
	};
};

export const oddsPickConfirmOddsSx: SxProps<Theme> = (theme) => ({
	fontWeight: 800,
	fontSize: { xs: '2.25rem', sm: '2.75rem' },
	lineHeight: 1,
	textAlign: 'center',
	fontVariantNumeric: 'tabular-nums',
	maxWidth: '100%',
	color: theme.palette.mode === 'dark' ? '#ffd966' : '#8b6914',
	textShadow:
		theme.palette.mode === 'dark'
			? '0 0 20px rgba(255, 217, 102, 0.28)'
			: '0 1px 8px rgba(139, 105, 20, 0.18)',
});

export const oddsPickConfirmProcessingWrapSx: SxProps<Theme> = {
	position: 'relative',
	width: '100%',
};

export const oddsPickConfirmSummaryDimmedSx: SxProps<Theme> = {
	opacity: 0.38,
	filter: 'blur(1.5px)',
	transform: 'scale(0.98)',
	transition: 'opacity 0.28s ease, filter 0.28s ease, transform 0.28s ease',
	pointerEvents: 'none',
	userSelect: 'none',
};

export const oddsPickConfirmProcessingOverlaySx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		position: 'absolute',
		inset: '-0.35rem -0.5rem',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 1.25,
		borderRadius: 2,
		zIndex: 1,
		background: isDark
			? 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(0, 107, 66, 0.42) 0%, rgba(11, 20, 36, 0.88) 72%)'
			: 'radial-gradient(ellipse 90% 70% at 50% 40%, rgba(0, 168, 107, 0.18) 0%, rgba(255, 255, 255, 0.92) 72%)',
		backdropFilter: 'blur(6px)',
		border: '1px solid',
		borderColor: p.goldBorder,
		boxShadow: isDark
			? '0 0 28px rgba(0, 200, 120, 0.22), inset 0 0 24px rgba(255, 214, 0, 0.06)'
			: '0 8px 24px rgba(4, 90, 55, 0.12), inset 0 0 20px rgba(255, 214, 0, 0.08)',
		animation: 'oddsPickConfirmOverlayIn 0.32s ease',
		'@keyframes oddsPickConfirmOverlayIn': {
			from: { opacity: 0, transform: 'scale(0.96)' },
			to: { opacity: 1, transform: 'scale(1)' },
		},
	};
};

export const oddsPickConfirmProcessingSpinnerRingSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		position: 'relative',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		width: 56,
		height: 56,
		'&::before': {
			content: '""',
			position: 'absolute',
			inset: 0,
			borderRadius: '50%',
			border: '2px solid',
			borderColor: isDark ? 'rgba(255, 214, 0, 0.22)' : 'rgba(184, 134, 11, 0.28)',
			animation: 'oddsPickConfirmRingPulse 1.6s ease-in-out infinite',
		},
		'@keyframes oddsPickConfirmRingPulse': {
			'0%, 100%': { transform: 'scale(1)', opacity: 0.55 },
			'50%': { transform: 'scale(1.08)', opacity: 1 },
		},
	};
};

export const oddsPickConfirmProcessingSpinnerSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	return {
		color: theme.palette.mode === 'dark' ? p.gold : p.greenDeep,
		filter: theme.palette.mode === 'dark' ? 'drop-shadow(0 0 8px rgba(255, 217, 102, 0.45))' : 'none',
	};
};

export const oddsPickConfirmProcessingTextSx: SxProps<Theme> = (theme) => {
	const p = oddsPickPalette(theme.palette.mode);
	const isDark = theme.palette.mode === 'dark';
	return {
		fontWeight: 700,
		fontSize: { xs: '0.9rem', sm: '1rem' },
		lineHeight: 1.25,
		textAlign: 'center',
		color: isDark ? p.green : p.greenDeep,
		px: 1,
		maxWidth: '100%',
		animation: 'oddsPickConfirmTextPulse 1.4s ease-in-out infinite',
		'@keyframes oddsPickConfirmTextPulse': {
			'0%, 100%': { opacity: 0.72 },
			'50%': { opacity: 1 },
		},
	};
};
