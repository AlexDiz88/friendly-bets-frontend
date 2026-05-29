import type { SxProps, Theme } from '@mui/material';
import {
	GAMEWEEK_CARD_HEIGHT,
	GAMEWEEK_CARD_MAX_WIDTH,
	GAMEWEEK_CARD_MIN_WIDTH,
} from '../../constants';
import {
	betsBalanceChangeSx,
	betsCompletedCardBgSx,
	betsConvexPlateSx,
	betsStatusIconSx,
} from '../bets/betsPageStyles';
import { statsThemePalette } from '../stats/statsPageStyles';

/** Компактная карточка тура — общая геометрия и «выпуклость» как у betsCardSx. */
export const gameweekCompactCardBaseSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	const convex = betsConvexPlateSx(theme, true);
	const isDark = theme.palette.mode === 'dark';
	return {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		flexDirection: 'column',
		minWidth: GAMEWEEK_CARD_MIN_WIDTH,
		maxWidth: GAMEWEEK_CARD_MAX_WIDTH,
		height: GAMEWEEK_CARD_HEIGHT,
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
		mx: 0.5,
		mb: 0.5,
		p: 0.3,
		borderRadius: 2,
		color: p.bodyText,
		backgroundImage: convex.backgroundImage,
		boxShadow: convex.boxShadow,
		cursor: 'pointer',
	};
};

/** Фон открытой / «думает» карточки — как betsCardSx без полной ширины. */
export const gameweekOpenedCardBgSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const convex = betsConvexPlateSx(theme, true);
	return {
		bgcolor: isDark ? 'rgba(38, 38, 38, 0.92)' : '#f5f6f9',
		backgroundImage: convex.backgroundImage,
		boxShadow: convex.boxShadow,
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
	};
};

export function gameweekCompactStatusCardSx(
	status: 'won' | 'lost' | 'returned' | 'empty'
): SxProps<Theme> {
	return [gameweekCompactCardBaseSx, betsCompletedCardBgSx(status)] as SxProps<Theme>;
}

export const gameweekCompactOpenedCardSx: SxProps<Theme> = [
	gameweekCompactCardBaseSx,
	gameweekOpenedCardBgSx,
] as SxProps<Theme>;

export const gameweekCardScoreSx: SxProps<Theme> = (theme) => ({
	px: 0.5,
	pb: 0.3,
	textAlign: 'center',
	fontWeight: 600,
	color: statsThemePalette(theme).name,
});

export const gameweekOddsBadgeSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const p = statsThemePalette(theme);
	return {
		px: 0.3,
		py: 0.2,
		mx: 0.3,
		textAlign: 'center',
		fontSize: '1rem',
		fontWeight: 600,
		lineHeight: 0.8,
		fontVariantNumeric: 'tabular-nums',
		bgcolor: isDark ? 'rgba(250, 204, 21, 0.22)' : '#EAF5CD',
		border: '1px solid',
		borderColor: isDark ? 'rgba(250, 204, 21, 0.35)' : 'rgba(0, 0, 0, 0.2)',
		color: p.name,
	};
};

export const gameweekCardBetTitleSx: SxProps<Theme> = (theme) => ({
	textAlign: 'center',
	fontWeight: 600,
	color: statsThemePalette(theme).name,
});

export const gameweekStatusIconSx = betsStatusIconSx;

export const gameweekBalanceChangeSx = betsBalanceChangeSx;

export const gameweekPlayerRowSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	const isDark = theme.palette.mode === 'dark';
	const convex = betsConvexPlateSx(theme, true);
	return {
		mb: 2,
		p: 0.5,
		border: '2px solid',
		borderColor: isDark ? p.surfaceBorder : 'rgba(0, 0, 60, 0.25)',
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
		borderRadius: 2,
		bgcolor: isDark ? 'rgba(38, 38, 38, 0.72)' : 'rgba(255, 244, 232, 0.81)',
		backgroundImage: isDark ? convex.backgroundImage : undefined,
		boxShadow: convex.boxShadow,
		color: p.name,
	};
};

export const gameweekPlayerHeaderSx: SxProps<Theme> = {
	mb: 0.8,
	ml: 0.5,
	display: 'flex',
	alignItems: 'center',
	fontWeight: 600,
};

export const gameweekExpandedOverlaySx: SxProps<Theme> = {
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	bgcolor: 'rgba(0, 0, 0, 0.5)',
	zIndex: 10,
};

export const gameweekExpandedCardWrapSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const convex = betsConvexPlateSx(theme, true);
	return {
		borderRadius: 2,
		p: 2,
		maxWidth: 400,
		width: 'calc(100% - 2rem)',
		boxSizing: 'border-box',
		bgcolor: isDark ? 'rgba(30, 30, 30, 0.98)' : '#ffffff',
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
		boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.45)',
	};
};

export const gameweekCalendarDateSx: SxProps<Theme> = (theme) => ({
	fontWeight: 600,
	fontSize: '0.85rem',
	lineHeight: 1.2,
	color: statsThemePalette(theme).name,
});

export const gameweekCalendarMatchdaySx: SxProps<Theme> = (theme) => ({
	ml: 0.25,
	fontWeight: 600,
	fontSize: '0.8rem',
	fontFamily: "'Exo 2'",
	color: statsThemePalette(theme).name,
});

export const gameweekCalendarSelectSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	const isDark = theme.palette.mode === 'dark';
	const borderColor = isDark ? p.surfaceBorder : 'rgba(18, 52, 86, 0.86)';
	return {
		'& .MuiOutlinedInput-root': {
			borderRadius: 2,
		},
		'& .MuiOutlinedInput-notchedOutline': {
			borderColor,
			borderRadius: 2,
		},
		'&:hover .MuiOutlinedInput-notchedOutline': {
			borderColor,
		},
		'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderWidth: '1px',
			borderColor,
			borderRadius: 2,
		},
		'& .MuiSelect-select': {
			py: 0.5,
			px: 1,
		},
	};
};

export const gameweekCalendarMenuPaperSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	const isDark = theme.palette.mode === 'dark';
	return {
		maxHeight: 360,
		'& .MuiMenuItem-root:not(:last-of-type)': {
			borderBottom: '1px solid',
			borderColor: isDark ? p.rowBorder : 'rgba(18, 52, 86, 0.2)',
		},
	};
};

export const gameweekThinkingIconSx: SxProps<Theme> = (theme) => ({
	color: theme.palette.mode === 'dark' ? '#fb923c' : '#E76B0C',
	transform: 'scale(1.7)',
});

export const gameweekThinkingLabelSx: SxProps<Theme> = (theme) => ({
	textAlign: 'center',
	fontSize: '0.85rem',
	fontWeight: 600,
	color: statsThemePalette(theme).bodyText,
});
