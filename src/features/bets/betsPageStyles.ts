import type { SxProps, Theme } from '@mui/material';
import { APP_STICKY_BELOW_HEADER_TOP } from '../../components/header/headerLayout';
import { statsThemePalette } from '../stats/statsPageStyles';

/** Горизонтальный отступ на мобильных. */
export const BETS_PAGE_INSET_PX = '1px';

/** Горизонтальный отступ на «Редактирование ставок». */
export const BETS_EDIT_PAGE_INSET_PX = '0.5px';

/** Layout main px — для компенсации на странице редактирования. */
const APP_MAIN_HORIZONTAL_PX = '3px';

/** Как на главной — узкая колонка на sm+. */
export const BETS_DESKTOP_MAX_WIDTH = '25rem';

export const betsContentColumnSx: SxProps<Theme> = {
	width: '100%',
	maxWidth: { xs: '100%', sm: BETS_DESKTOP_MAX_WIDTH },
	mx: { xs: 0, sm: 'auto' },
	boxSizing: 'border-box',
};

export const betsPageRootSx: SxProps<Theme> = {
	width: '100%',
	px: BETS_PAGE_INSET_PX,
	boxSizing: 'border-box',
	maxWidth: { xs: '100%', sm: BETS_DESKTOP_MAX_WIDTH },
	mx: { xs: 0, sm: 'auto' },
};

export const betEditPageRootSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	width: { xs: `calc(100% + 2 * (${APP_MAIN_HORIZONTAL_PX} - ${BETS_EDIT_PAGE_INSET_PX}))`, sm: '100%' },
	px: BETS_EDIT_PAGE_INSET_PX,
	boxSizing: 'border-box',
	maxWidth: { xs: '100%', sm: BETS_DESKTOP_MAX_WIDTH },
	mx: {
		xs: `calc(-1 * (${APP_MAIN_HORIZONTAL_PX} - ${BETS_EDIT_PAGE_INSET_PX}))`,
		sm: 'auto',
	},
};

type ConvexPlateStyle = {
	boxShadow: string;
	backgroundImage: string;
	borderTopColor: string;
	borderBottomColor: string;
};

/** Лёгкая «выпуклость»: верхний блик + тень снизу. */
export function betsConvexPlateSx(theme: Theme, strong = false): ConvexPlateStyle {
	const isDark = theme.palette.mode === 'dark';
	if (strong) {
		return {
			boxShadow: isDark
				? '0 1px 0 rgba(255, 255, 255, 0.14) inset, 0 2px 0 rgba(255, 255, 255, 0.04) inset, 0 4px 12px rgba(0, 0, 0, 0.5), 0 10px 22px rgba(0, 0, 0, 0.38)'
				: '0 1px 0 rgba(255, 255, 255, 0.88) inset, 0 2px 7px rgba(0, 0, 0, 0.08), 0 5px 14px rgba(0, 0, 0, 0.1)',
			backgroundImage: isDark
				? 'linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 42%, transparent 100%)'
				: 'linear-gradient(180deg, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0.22) 42%, transparent 100%)',
			borderTopColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.82)',
			borderBottomColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.12)',
		};
	}
	return {
		boxShadow: isDark
			? '0 1px 0 rgba(255, 255, 255, 0.1) inset, 0 2px 8px rgba(0, 0, 0, 0.45), 0 6px 16px rgba(0, 0, 0, 0.28)'
			: '0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 2px 5px rgba(0, 0, 0, 0.06), 0 4px 10px rgba(0, 0, 0, 0.07)',
		backgroundImage: isDark
			? 'linear-gradient(180deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0) 38%)'
			: 'linear-gradient(180deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.08) 45%, transparent 100%)',
		borderTopColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.7)',
		borderBottomColor: isDark ? 'rgba(0, 0, 0, 0.35)' : 'rgba(0, 0, 0, 0.08)',
	};
}

/** Вкладки: тёмная тема — тёмная панель; светлая — в тон фону приложения. */
const betsTabUi = {
	dark: {
		activeLabel: '#ffffff',
		inactiveLabel: 'rgba(255, 255, 255, 0.72)',
		underline: '#ffffff',
		hoverBg: 'rgba(255, 255, 255, 0.06)',
	},
	light: {
		barBg: 'linear-gradient(180deg, #f2f4f8 0%, #e8ebf2 100%)',
		activeLabel: '#1e3471',
		inactiveLabel: '#64748b',
		underline: '#446bc4',
		hoverBg: 'rgba(68, 107, 196, 0.08)',
	},
} as const;

export const betsTabBarSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	const convex = betsConvexPlateSx(theme);
	const isDark = theme.palette.mode === 'dark';

	if (isDark) {
		return {
			display: 'flex',
			width: '100%',
			borderRadius: 2,
			overflow: 'hidden',
			border: '1px solid',
			borderColor: p.headBorder,
			borderTopColor: convex.borderTopColor,
			borderBottomColor: convex.borderBottomColor,
			background: p.headBg,
			boxShadow: convex.boxShadow,
		};
	}

	return {
		display: 'flex',
		width: '100%',
		borderRadius: 2,
		overflow: 'hidden',
		border: '1px solid',
		borderColor: 'rgba(0, 0, 0, 0.09)',
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
		background: betsTabUi.light.barBg,
		backgroundImage: convex.backgroundImage,
		boxShadow: convex.boxShadow,
	};
};

export function betsSwitchButtonSx(active: boolean): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const tab = isDark ? betsTabUi.dark : betsTabUi.light;
		return {
			flex: 1,
			maxWidth: 'none',
			height: '2.25rem',
			pb: 0,
			px: 0.5,
			bgcolor: 'transparent',
			backgroundColor: 'transparent',
			color: 'inherit',
			opacity: 1,
			borderBottom: '2px solid',
			borderBottomColor: active ? tab.underline : 'transparent',
			'&:hover': {
				bgcolor: tab.hoverBg,
				backgroundColor: tab.hoverBg,
			},
			'&:active': {
				bgcolor: 'transparent',
				backgroundColor: 'transparent',
			},
			'&:focus': {
				bgcolor: 'transparent',
				backgroundColor: 'transparent',
			},
		};
	};
}

export function betsSwitchLabelSx(active: boolean): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const tab = isDark ? betsTabUi.dark : betsTabUi.light;
		return {
			fontWeight: active ? 700 : 500,
			fontSize: '0.875rem',
			fontFamily: "'Exo 2'",
			textTransform: 'none',
			lineHeight: 1.2,
			color: active ? tab.activeLabel : tab.inactiveLabel,
			textShadow: isDark && active ? '0 1px 2px rgba(0, 0, 0, 0.35)' : 'none',
		};
	};
}

/** Фильтр лиг на «Подведение итогов матчей» — не хардкодить black/brown. */
export function betsLeagueFilterTabSx(selected: boolean): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const activeColor = isDark ? '#e8b080' : '#8b4513';
		const inactiveColor = isDark ? 'rgba(255, 255, 255, 0.72)' : '#171717';
		return {
			borderRadius: 0,
			borderBottom: '2px solid',
			borderBottomColor: selected ? activeColor : 'transparent',
			color: selected ? activeColor : inactiveColor,
			fontFamily: "'Exo 2'",
			px: 0.5,
			mr: 1,
			fontWeight: selected ? 700 : 500,
			textTransform: 'none',
			minWidth: 0,
			'&:hover': {
				bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
			},
		};
	};
}

/** Непрозрачная подложка под sticky-вкладки — контент не просвечивает при скролле. */
export const betsStickyTabsSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const pageBg = theme.palette.background.default;
	return {
		position: 'sticky',
		top: APP_STICKY_BELOW_HEADER_TOP,
		zIndex: 20,
		pt: 0,
		pb: 0.5,
		mb: 0.5,
		mx: `calc(-1 * ${BETS_PAGE_INSET_PX})`,
		px: BETS_PAGE_INSET_PX,
		bgcolor: pageBg,
		borderBottom: '1px solid',
		borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.07)',
		boxShadow: isDark
			? `0 10px 24px -6px ${pageBg}, 0 6px 16px rgba(0, 0, 0, 0.35)`
			: `0 10px 24px -6px ${pageBg}, 0 4px 14px rgba(0, 0, 0, 0.08)`,
	};
};

export const betsFilterBarSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	const convex = betsConvexPlateSx(theme);
	return {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		my: 0.5,
		px: 0.5,
		py: 0.5,
		borderRadius: 2,
		gap: 0.5,
		boxSizing: 'border-box',
		border: '1px solid',
		borderColor: p.surfaceBorder,
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
		bgcolor: p.bodyBg,
		backgroundImage: convex.backgroundImage,
		boxShadow: convex.boxShadow,
	};
};

export const betsListSx: SxProps<Theme> = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',
	width: '100%',
};

export const betsCardSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	const convex = betsConvexPlateSx(theme, true);
	const isDark = theme.palette.mode === 'dark';
	return {
		width: '100%',
		maxWidth: '100%',
		minWidth: 0,
		boxSizing: 'border-box',
		mx: 0,
		my: 0.375,
		px: 0.75,
		py: 0.625,
		borderRadius: 1.5,
		bgcolor: isDark ? 'rgba(38, 38, 38, 0.92)' : '#f5f6f9',
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
		color: p.bodyText,
		backgroundImage: convex.backgroundImage,
		boxShadow: convex.boxShadow,
	};
};

export const betsCardHeaderRowSx: SxProps<Theme> = {
	display: 'flex',
	alignItems: 'center',
	flexWrap: 'wrap',
	justifyContent: 'space-between',
	gap: 0.25,
	mb: 0.25,
};

export const betsCardAvatarSx: SxProps<Theme> = (theme) => ({
	mb: 0,
	ml: 0,
	fontSize: '0.8rem',
	color: statsThemePalette(theme).name,
	fontWeight: 600,
});

export const betsCardTeamsRowSx: SxProps<Theme> = {
	display: 'flex',
	justifyContent: 'flex-start',
	mb: 0.25,
};

export const betsCardTeamsSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.78rem',
	color: statsThemePalette(theme).name,
	fontWeight: 600,
});

export const betsCardBodySx: SxProps<Theme> = (theme) => ({
	textAlign: 'left',
	ml: 0.25,
	fontSize: '0.8rem',
	lineHeight: 1.3,
	color: statsThemePalette(theme).bodyText,
	'&:not(:last-of-type)': {
		mb: 0.125,
	},
});

export const betsCardLabelSx: SxProps<Theme> = (theme) => ({
	fontWeight: 700,
	color: statsThemePalette(theme).name,
});

export const betsCardScoreSx: SxProps<Theme> = (theme) => ({
	textAlign: 'center',
	fontSize: '1.15rem',
	fontWeight: 700,
	color: statsThemePalette(theme).name,
	fontVariantNumeric: 'tabular-nums',
	lineHeight: 1.15,
	my: 0.125,
});

export const betsCardStatusRowSx: SxProps<Theme> = (theme) => {
	const p = statsThemePalette(theme);
	return {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		mt: 0.375,
		pt: 0.375,
		borderTop: '1px solid',
		borderColor: p.rowBorder,
	};
};

export const betsCardStatusLabelSx: SxProps<Theme> = (theme) => ({
	fontSize: '0.75rem',
	fontWeight: 600,
	pl: 0,
	display: 'flex',
	alignItems: 'center',
	gap: 0.25,
	color: statsThemePalette(theme).bodyText,
});

const betsStatusFill: Record<
	'won' | 'lost' | 'returned' | 'empty',
	{ dark: string; light: string }
> = {
	won: { dark: 'rgba(22, 101, 52, 0.55)', light: '#c8ebd6' },
	returned: { dark: 'rgba(113, 63, 18, 0.5)', light: '#f5e9b0' },
	lost: { dark: 'rgba(127, 29, 29, 0.52)', light: '#f5d0d0' },
	empty: { dark: 'rgba(51, 65, 85, 0.48)', light: '#e2e8f0' },
};

export function betsCompletedCardBgSx(
	status: 'won' | 'lost' | 'returned' | 'empty'
): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const convex = betsConvexPlateSx(theme, true);
		const fill = isDark ? betsStatusFill[status].dark : betsStatusFill[status].light;
		return {
			bgcolor: fill,
			backgroundImage: convex.backgroundImage,
			boxShadow: convex.boxShadow,
			borderTopColor: convex.borderTopColor,
			borderBottomColor: convex.borderBottomColor,
		};
	};
}

export function betsStatusIconSx(kind: 'won' | 'lost' | 'returned' | 'empty'): SxProps<Theme> {
	return (theme) => {
		const p = statsThemePalette(theme);
		const colors = {
			won: p.positive,
			lost: p.negative,
			returned: theme.palette.mode === 'dark' ? '#facc15' : '#a16207',
			empty: theme.palette.mode === 'dark' ? '#fca5a5' : '#991b1b',
		};
		return { color: colors[kind], fontSize: '1rem' };
	};
}

export function betsBalanceChangeSx(value: number): SxProps<Theme> {
	return (theme) => {
		const p = statsThemePalette(theme);
		return {
			pr: 0,
			fontWeight: 700,
			fontSize: '1.05rem',
			fontVariantNumeric: 'tabular-nums',
			color: value > 0 ? p.positive : value < 0 ? p.negative : p.name,
		};
	};
}

/** Размеры аватаров внутри компактной карточки. */
export const BETS_CARD_USER_AVATAR_SIZE = 32;
export const BETS_CARD_LOGO_SIZE = 22;

/** Минимальная зона касания для пагинации (смартфон). */
export const BETS_PAGINATION_TOUCH_MIN = 48;

export const betsPaginationRootSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	const convex = betsConvexPlateSx(theme);
	const p = statsThemePalette(theme);
	return {
		mt: 1.25,
		mb: 0.5,
		py: 0.75,
		px: 0.75,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		gap: 0.75,
		width: '100%',
		boxSizing: 'border-box',
		borderRadius: 2,
		border: '1px solid',
		borderColor: isDark ? p.surfaceBorder : 'rgba(0, 0, 0, 0.09)',
		borderTopColor: convex.borderTopColor,
		borderBottomColor: convex.borderBottomColor,
		background: isDark ? p.headBg : betsTabUi.light.barBg,
		backgroundImage: isDark ? undefined : convex.backgroundImage,
		boxShadow: convex.boxShadow,
	};
};

export function betsPaginationNavBtnSx(disabled: boolean): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const tab = isDark ? betsTabUi.dark : betsTabUi.light;
		return {
			width: BETS_PAGINATION_TOUCH_MIN,
			height: BETS_PAGINATION_TOUCH_MIN,
			flexShrink: 0,
			borderRadius: 1.5,
			border: '1px solid',
			borderColor: isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(68, 107, 196, 0.28)',
			bgcolor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.65)',
			color: isDark ? tab.activeLabel : tab.activeLabel,
			boxShadow: isDark
				? '0 1px 0 rgba(255, 255, 255, 0.12) inset, 0 2px 6px rgba(0, 0, 0, 0.35)'
				: '0 1px 0 rgba(255, 255, 255, 0.9) inset, 0 2px 6px rgba(0, 0, 0, 0.08)',
			transition: 'transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
			'&:hover': disabled
				? undefined
				: {
						bgcolor: isDark ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.92)',
						transform: 'translateY(-1px)',
						boxShadow: isDark
							? '0 2px 10px rgba(0, 0, 0, 0.4)'
							: '0 4px 12px rgba(68, 107, 196, 0.2)',
					},
			'&.Mui-disabled': {
				opacity: 0.4,
				color: isDark ? 'rgba(255, 255, 255, 0.35)' : tab.inactiveLabel,
				borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)',
			},
		};
	};
}

export const betsPaginationIndicatorSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		flex: 1,
		minWidth: 0,
		minHeight: BETS_PAGINATION_TOUCH_MIN,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		px: 1.25,
		borderRadius: 1.5,
		border: '1px solid',
		borderColor: isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(30, 52, 113, 0.35)',
		background: isDark
			? 'linear-gradient(135deg, rgba(91, 141, 239, 0.45) 0%, rgba(30, 52, 113, 0.75) 55%, rgba(30, 52, 113, 0.85) 100%)'
			: 'linear-gradient(135deg, #6b8fd4 0%, #446bc4 52%, #1e3471 100%)',
		boxShadow: isDark
			? '0 1px 0 rgba(255, 255, 255, 0.15) inset, 0 3px 12px rgba(0, 0, 0, 0.4)'
			: '0 1px 0 rgba(255, 255, 255, 0.35) inset, 0 3px 10px rgba(68, 107, 196, 0.28)',
	};
};

export const betsPaginationPageTextSx: SxProps<Theme> = {
	fontFamily: "'Exo 2'",
	fontWeight: 800,
	fontSize: '1rem',
	lineHeight: 1,
	textTransform: 'none',
	color: '#f8fafc',
	fontVariantNumeric: 'tabular-nums',
	textShadow: '0 1px 2px rgba(0, 0, 0, 0.35)',
};
