import type { SelectProps, SxProps, Theme } from '@mui/material';

/** Общая высота compact-селектов (лига, тур) — 34px. */
export const COMPACT_SELECT_HEIGHT = 34;

/** Высота строки в выпадающем списке (см. filterSelectMenuItemSx minHeight + my). */
export const FILTER_SELECT_MENU_ITEM_ROW_PX = 44;
export const FILTER_SELECT_MENU_VERTICAL_PAD_PX = 12;
export const FILTER_SELECT_MENU_MAX_HEIGHT = '90vh';

/** Список: высота под число пунктов, не выше 90vh. */
export function filterSelectListMenuMaxHeightCss(itemCount: number): string {
	const count = Math.max(itemCount, 1);
	const estimated = count * FILTER_SELECT_MENU_ITEM_ROW_PX + FILTER_SELECT_MENU_VERTICAL_PAD_PX;
	return `min(${estimated}px, ${FILTER_SELECT_MENU_MAX_HEIGHT})`;
}

/** Сетка туров: высота по числу строк. */
export function filterSelectGridMenuMaxHeightCss(itemCount: number, columns: number): string {
	const cols = Math.max(columns, 1);
	const rows = Math.ceil(Math.max(itemCount, 1) / cols);
	const rowPx = 44;
	const gapPx = 8;
	const padPx = 16;
	const estimated = rows * rowPx + Math.max(0, rows - 1) * gapPx + padPx;
	return `min(${estimated}px, ${FILTER_SELECT_MENU_MAX_HEIGHT})`;
}

export function filterSelectMenuPaperHeightSx(
	itemCount: number,
	mode: 'list' | 'grid' = 'list',
	gridColumns = 1
): SxProps<Theme> {
	return () => ({
		maxHeight:
			mode === 'grid'
				? filterSelectGridMenuMaxHeightCss(itemCount, gridColumns)
				: filterSelectListMenuMaxHeightCss(itemCount),
	});
}

/** Палитра фильтр-селектов (в тон страницы ставок / primary приложения). */
const filterUi = {
	dark: {
		fieldBg: 'rgba(255, 255, 255, 0.09)',
		fieldBgHover: 'rgba(255, 255, 255, 0.12)',
		border: 'rgba(255, 255, 255, 0.16)',
		borderHover: 'rgba(255, 255, 255, 0.28)',
		borderFocus: 'rgba(255, 255, 255, 0.45)',
		text: '#f5f5f5',
		muted: 'rgba(255, 255, 255, 0.55)',
		icon: 'rgba(255, 255, 255, 0.72)',
		menuBg: '#1e2230',
		menuBorder: 'rgba(255, 255, 255, 0.1)',
		itemHover: 'rgba(255, 255, 255, 0.08)',
		itemSelected: 'rgba(91, 141, 239, 0.28)',
	},
	light: {
		fieldBg: 'rgba(255, 255, 255, 0.88)',
		fieldBgHover: '#ffffff',
		border: 'rgba(68, 107, 196, 0.22)',
		borderHover: 'rgba(68, 107, 196, 0.38)',
		borderFocus: '#446bc4',
		text: '#1e3471',
		muted: '#64748b',
		icon: '#446bc4',
		menuBg: '#ffffff',
		menuBorder: 'rgba(0, 0, 0, 0.09)',
		itemHover: 'rgba(68, 107, 196, 0.08)',
		itemSelected: 'rgba(68, 107, 196, 0.14)',
	},
} as const;

export type FilterSelectVariant = 'standard' | 'compactLeague' | 'compactMatchday';

function palette(theme: Theme) {
	return theme.palette.mode === 'dark' ? filterUi.dark : filterUi.light;
}

function fieldShadow(theme: Theme): string {
	const isDark = theme.palette.mode === 'dark';
	return isDark
		? '0 1px 0 rgba(255, 255, 255, 0.1) inset, 0 2px 6px rgba(0, 0, 0, 0.35)'
		: '0 1px 0 rgba(255, 255, 255, 0.95) inset, 0 2px 6px rgba(0, 0, 0, 0.07)';
}

/** Корневые стили MUI Select (outlined). */
export function filterSelectRootSx(variant: FilterSelectVariant = 'standard'): SxProps<Theme> {
	return (theme) => {
		const p = palette(theme);
		const isCompact = variant !== 'standard';
		const height = isCompact ? COMPACT_SELECT_HEIGHT : 40;
		const selectJustify = variant === 'compactMatchday' ? 'center' : 'flex-start';
		const selectAlign = variant === 'compactMatchday' ? 'center' : 'flex-start';

		return {
			height,
			fontSize: isCompact ? '0.8rem' : '0.875rem',
			fontFamily: "'Exo 2', sans-serif",
			color: p.text,
			borderRadius: 1.5,
			bgcolor: p.fieldBg,
			boxShadow: fieldShadow(theme),
			transition: 'background-color 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
			'&.MuiInputBase-root': {
				height,
			},
			'& .MuiOutlinedInput-notchedOutline': {
				borderColor: p.border,
				borderWidth: 1,
			},
			'&:hover': {
				bgcolor: p.fieldBgHover,
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: p.borderHover,
				},
			},
			'&.Mui-focused': {
				bgcolor: p.fieldBgHover,
				boxShadow: isCompact
					? fieldShadow(theme)
					: theme.palette.mode === 'dark'
						? '0 0 0 2px rgba(91, 141, 239, 0.35), 0 2px 8px rgba(0, 0, 0, 0.4)'
						: '0 0 0 2px rgba(68, 107, 196, 0.22), 0 2px 8px rgba(68, 107, 196, 0.12)',
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: p.borderFocus,
					borderWidth: 1,
				},
			},
			'& .MuiSelect-select': {
				display: 'flex',
				alignItems: 'center',
				justifyContent: selectJustify,
				textAlign: selectAlign,
				py: 0.5,
				px: 0.75,
				pr: variant === 'compactMatchday' ? '1.75rem !important' : '2rem !important',
				minHeight: 'unset !important',
				height: '100%',
				boxSizing: 'border-box',
				lineHeight: 1.2,
			},
			'& .MuiSelect-icon': {
				color: p.icon,
				right: 6,
				fontSize: '1.35rem',
				transition: 'transform 0.2s ease',
			},
			'&.Mui-focused .MuiSelect-icon': {
				transform: 'rotate(180deg)',
			},
			'&.Mui-disabled': {
				opacity: 0.5,
			},
		};
	};
}

/** В ряду фильтров (ставки, статистика). */
export const filterSelectLeagueLayoutSx: SxProps<Theme> = {
	flex: '1 1 42%',
	minWidth: 0,
	maxWidth: { xs: '48%', sm: '11.5rem' },
};

export const filterSelectPlayerLayoutSx: SxProps<Theme> = {
	flex: '1 1 52%',
	minWidth: 0,
	width: '100%',
	maxWidth: { xs: '52%', sm: '12rem' },
};

export const filterSelectMenuPaperSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	const isDark = theme.palette.mode === 'dark';
	return {
		mt: 0.5,
		borderRadius: 2,
		border: '1px solid',
		borderColor: p.menuBorder,
		bgcolor: p.menuBg,
		backgroundImage: isDark
			? 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 28%)'
			: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,1) 100%)',
		boxShadow: isDark
			? '0 12px 32px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255,255,255,0.06) inset'
			: '0 10px 28px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255,255,255,0.8) inset',
		overflow: 'hidden',
	};
};

export const filterSelectMenuItemSx: SxProps<Theme> = (theme) => {
	const p = palette(theme);
	return {
		borderRadius: 1,
		mx: 0.5,
		my: 0.2,
		minHeight: 40,
		fontSize: '0.875rem',
		color: p.text,
		'&.Mui-selected': {
			bgcolor: p.itemSelected,
			fontWeight: 600,
			'&:hover': {
				bgcolor: p.itemSelected,
			},
		},
		'&:hover': {
			bgcolor: p.itemHover,
		},
	};
};

/** Пункты списка игроков: без бокового mx, padding как у .MuiSelect-select (0.75). */
export const filterSelectPlayerMenuItemSx: SxProps<Theme> = [
	filterSelectMenuItemSx,
	{
		mx: 0,
		px: 0.75,
		borderRadius: 0,
		width: '100%',
		boxSizing: 'border-box',
	},
];

export const filterSelectAllLabelSx: SxProps<Theme> = (theme) => ({
	mx: 0.75,
	fontSize: '0.875rem',
	fontWeight: 600,
	color: palette(theme).text,
});

export const filterSelectAllAvatarSx: SxProps<Theme> = {
	width: 28,
	height: 28,
	borderRadius: 1,
	flexShrink: 0,
};

export type FilterSelectMenuOptions = {
	/** Сетка (туры): число колонок для расчёта высоты. */
	gridColumns?: number;
};

export function filterSelectPlayerMenuProps(itemCount: number): SelectProps['MenuProps'] {
	return {
		...filterSelectMenuProps(itemCount),
		// Иначе Popover сдвигает меню от якоря (особенно у края viewport).
		marginThreshold: 0,
		MenuListProps: {
			sx: {
				py: 0.5,
				px: 0,
				maxHeight: 'none',
				overflowY: 'auto',
				width: '100%',
				boxSizing: 'border-box',
			},
		},
	};
}

export function filterSelectMenuProps(
	itemCount: number,
	extraPaperSx?: SxProps<Theme>,
	options?: FilterSelectMenuOptions
): SelectProps['MenuProps'] {
	const isGrid = options?.gridColumns != null && options.gridColumns > 0;
	const heightSx = filterSelectMenuPaperHeightSx(
		itemCount,
		isGrid ? 'grid' : 'list',
		options?.gridColumns ?? 1
	);

	const paperSx = [filterSelectMenuPaperSx, heightSx, extraPaperSx].filter(
		Boolean
	) as SxProps<Theme>;

	return {
		anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
		transformOrigin: { vertical: 'top', horizontal: 'left' },
		marginThreshold: 0,
		PaperProps: {
			sx: paperSx,
		},
		MenuListProps: {
			sx: {
				py: 0.5,
				maxHeight: 'none',
				overflowY: 'auto',
			},
		},
	};
}
