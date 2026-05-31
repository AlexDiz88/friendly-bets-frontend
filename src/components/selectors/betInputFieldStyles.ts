import type { SxProps, Theme } from '@mui/material';
import { APP_HEADER_CONTENT_GAP_PX } from '../header/headerLayout';
import {
	filterSelectMenuItemSx,
	filterSelectMenuProps,
	filterSelectPlayerMenuItemSx,
	filterSelectPlayerMenuProps,
	filterSelectRootSx,
} from './filterSelectStyles';

/** Корень страницы «Добавление ставок» — без лишнего зазора под AppBar. */
export const betInputPageRootSx: SxProps<Theme> = {
	mt: `-${APP_HEADER_CONTENT_GAP_PX}px`,
	mx: 1,
	mb: 10,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	minWidth: '15rem',
};

/** Единый вид outlined-селектов на странице добавления/редактирования ставки. */
export const betInputSelectSx = [
	filterSelectRootSx('standard'),
	{ minWidth: '15rem', mb: 1 },
] as SxProps<Theme>;

export const betInputSelectMenuProps = (itemCount: number) => filterSelectMenuProps(itemCount);

export const betInputPlayerSelectMenuProps = (itemCount: number) =>
	filterSelectPlayerMenuProps(itemCount);

export const betInputMenuItemSx = filterSelectMenuItemSx;

export const betInputPlayerMenuItemSx = filterSelectPlayerMenuItemSx;

export const betInputSelectedBetSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		ml: 1,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: '0.85rem',
		fontWeight: 600,
		fontFamily: "'Exo 2'",
		width: '19rem',
		height: '2.4rem',
		border: '1px solid',
		borderColor: isDark ? 'rgba(59, 130, 246, 0.38)' : 'rgba(37, 99, 235, 0.38)',
		borderRadius: '6px',
		bgcolor: isDark ? 'rgba(13, 31, 60, 0.65)' : 'rgba(232, 240, 255, 0.95)',
		color: isDark ? '#f0f7ff' : '#0d1f3c',
		boxShadow: isDark
			? '0 1px 0 rgba(147, 197, 253, 0.16) inset, 0 2px 8px rgba(10, 22, 40, 0.35)'
			: '0 1px 0 rgba(255, 255, 255, 0.95) inset, 0 2px 6px rgba(13, 31, 60, 0.08)',
	};
};

/** TextField «Кэф» / «Сумма» — те же границы, что у селектов. */
export const betInputTextFieldSx = [
	filterSelectRootSx('standard'),
	{
		'& .MuiInputBase-root': {
			height: 40,
		},
	},
] as SxProps<Theme>;
