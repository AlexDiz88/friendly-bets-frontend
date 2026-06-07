/** Fixed AppBar height (px) — одинаково на всех breakpoints. */
export const APP_HEADER_HEIGHT_PX = 56;

/** Зазор между низом AppBar и контентом страницы (px). */
export const APP_HEADER_CONTENT_GAP_PX = 12;

/** `padding-top` для `<main>` под фиксированным хедером. */
export const APP_MAIN_PADDING_TOP = `calc(${APP_HEADER_HEIGHT_PX}px + ${APP_HEADER_CONTENT_GAP_PX}px)`;

/** `min-height` для `<main>` (нижний отступ Layout: `pb: 3` = 24px). */
export const APP_MAIN_MIN_HEIGHT = `calc(100vh - ${APP_HEADER_HEIGHT_PX}px - ${APP_HEADER_CONTENT_GAP_PX}px - 24px)`;

/** `top` для sticky-блоков сразу под AppBar. */
export const APP_STICKY_BELOW_HEADER_TOP = APP_HEADER_HEIGHT_PX;

/** Ширина окна (px), с которой навигация показывается в хедере, а не в гамбургере. */
export const HEADER_NAV_DESKTOP_MIN_PX = 1440;

const navDesktopUp = `@media (min-width:${HEADER_NAV_DESKTOP_MIN_PX}px)`;

/** Видно только при ширине < 1440px (гамбургер, мобильные меню). */
export const headerNavMobileSx = {
	display: 'flex',
	[navDesktopUp]: {
		display: 'none',
	},
} as const;

/** Видно только при ширине ≥ 1440px (пункты в строке хедера). */
export const headerNavDesktopSx = {
	display: 'none',
	[navDesktopUp]: {
		display: 'contents',
	},
} as const;

export const headerLangMenuMobileSx = {
	display: 'block',
	[navDesktopUp]: {
		display: 'none',
	},
} as const;

export const headerLangMenuDesktopSx = {
	display: 'none',
	[navDesktopUp]: {
		display: 'block',
	},
} as const;
