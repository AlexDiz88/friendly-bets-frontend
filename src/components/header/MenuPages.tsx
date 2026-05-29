/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { KeyboardArrowRight } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/selectors';
import { changeLanguageAsync, saveUserLanguageAsync } from '../../features/languages/languageSlice';
import Language from '../../features/languages/types/Language';
import CustomMenuPageText from '../custom/CustomMenuPageText';
import {
	headerIconButtonSx,
	headerNavLinkActiveSx,
	headerNavMenuItemActiveSx,
} from './headerPageStyles';
import {
	headerLangMenuDesktopSx,
	headerLangMenuMobileSx,
	headerNavDesktopSx,
	headerNavMobileSx,
} from './headerLayout';

export interface HeaderMenuState {
	t: (key: string) => string;
	pages: string[];
	languages: Language[];
	currentLang: Language | undefined;
	anchorElNav: HTMLElement | null;
	anchorElLang: HTMLElement | null;
	handleNavigate: (page: string) => void;
	handleOpenNavMenu: (event: React.MouseEvent<HTMLElement>) => void;
	handleCloseNavMenu: () => void;
	handleOpenLangMenu: (event: React.MouseEvent<HTMLElement>) => void;
	handleCloseLangMenu: () => void;
	handleLanguageSelect: (lang: Language) => void;
	scrollToTop: () => void;
	isNavPageActive: (page: string) => boolean;
}

export function isHeaderNavPageActive(
	page: string,
	pathname: string,
	t: (key: string) => string,
): boolean {
	if (page === t('table')) {
		return pathname === '/' || pathname === '';
	}
	if (page === t('bets')) {
		return pathname === '/bets' || pathname.startsWith('/bets/');
	}
	const pathByPage: Record<string, string> = {
		[t('wc26.menu')]: '/world-cup-2026',
		[t('news')]: '/news',
		[t('byGameweeks')]: '/gameweeks',
		[t('byBetTitles')]: '/stats/bet-titles',
		[t('externalMatchResults')]: '/football-data/matchday',
		[t('byLeagues')]: '/stats/leagues',
		[t('byTeams')]: '/stats/teams',
		[t('archive')]: '/archive',
		[t('rules')]: '/rules',
	};
	const base = pathByPage[page];
	if (!base) {
		return false;
	}
	return pathname === base || pathname.startsWith(`${base}/`);
}

export function useHeaderMenu(): HeaderMenuState {
	const user = useAppSelector(selectUser);
	const { t, i18n } = useTranslation();
	useAppSelector((state) => state.language);
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const dispatch = useAppDispatch();
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

	const pages = [
		t('wc26.menu'),
		t('news'),
		t('byGameweeks'),
		t('byBetTitles'),
		t('externalMatchResults'),
		t('byLeagues'),
		t('byTeams'),
		t('archive'),
		t('rules'),
		t('language'),
	];

	const languages: Language[] = [
		{ code: 'en', name: 'English', img: 'english.png' },
		{ code: 'de', name: 'Deutsch', img: 'german.png' },
		{ code: 'ru', name: 'Русский', img: 'russian.png' },
	];
	const currentLang = languages.find((l) => l.code === i18n.language);

	const handleNavigate = (page: string): void => {
		switch (page) {
			case t('wc26.menu'):
				navigate('/world-cup-2026');
				break;
			case t('news'):
				navigate('/news');
				break;
			case t('byGameweeks'):
				navigate('/gameweeks');
				break;
			case t('byBetTitles'):
				navigate('/stats/bet-titles');
				break;
			case t('footballData'):
				navigate('/stats/football-data');
				break;
			case t('externalMatchResults'):
				navigate('/football-data/matchday');
				break;
			case t('byLeagues'):
				navigate('/stats/leagues');
				break;
			case t('byTeams'):
				navigate('/stats/teams');
				break;
			case t('archive'):
				navigate('/archive');
				break;
			case t('rules'):
				navigate('/rules');
				break;
			default:
				break;
		}
	};

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElNav(event.currentTarget);
	};

	const handleCloseNavMenu = (): void => {
		setAnchorElNav(null);
	};

	const handleOpenLangMenu = (event: React.MouseEvent<HTMLElement>): void => {
		setAnchorElLang(event.currentTarget);
	};

	const handleCloseLangMenu = (): void => {
		setAnchorElLang(null);
	};

	const handleLanguageSelect = (lang: Language): void => {
		if (user) {
			dispatch(saveUserLanguageAsync(lang.code));
		} else {
			dispatch(changeLanguageAsync(lang.code));
		}
		handleCloseLangMenu();
		handleCloseNavMenu();
	};

	const scrollToTop = (): void => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const isNavPageActive = (page: string): boolean =>
		isHeaderNavPageActive(page, pathname, t);

	return {
		t,
		pages,
		languages,
		currentLang,
		anchorElNav,
		anchorElLang,
		handleNavigate,
		handleOpenNavMenu,
		handleCloseNavMenu,
		handleOpenLangMenu,
		handleCloseLangMenu,
		handleLanguageSelect,
		scrollToTop,
		isNavPageActive,
	};
}

function LanguagePickerMenu({
	menu,
	sx,
}: {
	menu: HeaderMenuState;
	sx?: object;
}): JSX.Element {
	return (
		<Menu
			id="language-menu"
			anchorEl={menu.anchorElLang}
			anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			transformOrigin={{ vertical: 'top', horizontal: 'left' }}
			open={Boolean(menu.anchorElLang)}
			onClose={menu.handleCloseLangMenu}
			sx={sx}
		>
			{menu.languages.map((lang) => (
				<MenuItem key={lang.code} onClick={() => menu.handleLanguageSelect(lang)}>
					<Box sx={{ display: 'flex', alignItems: 'center' }}>
						<Avatar
							sx={{ mr: 0.5, width: 30, height: 20, border: 0.5, borderRadius: 0 }}
							alt="language_flag"
							src={`${import.meta.env.PUBLIC_URL || ''}/upload/locales/${lang.img}`}
						/>
						{lang.name}
					</Box>
				</MenuItem>
			))}
		</Menu>
	);
}

/** Гамбургер — левая колонка (xs–sm). */
export function HeaderNavLeft({ menu }: { menu: HeaderMenuState }): JSX.Element {
	return (
		<Box sx={{ ...headerNavMobileSx, alignItems: 'center', minWidth: 40 }}>
			<IconButton
				size="large"
				aria-label="main navigation"
				aria-controls="menu-app-bar"
				aria-haspopup="true"
				onClick={menu.handleOpenNavMenu}
				sx={headerIconButtonSx}
			>
				<MenuIcon />
			</IconButton>
			<Menu
				id="menu-app-bar"
				anchorEl={menu.anchorElNav}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				open={Boolean(menu.anchorElNav)}
				onClose={menu.handleCloseNavMenu}
			>
				{menu.pages.map((page) => (
					<MenuItem
						key={page}
						sx={[
							page === menu.t('language')
								? {
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'space-between',
								  }
								: undefined,
							menu.isNavPageActive(page) && headerNavMenuItemActiveSx,
						]}
						onClick={
							page === menu.t('language')
								? menu.handleOpenLangMenu
								: () => {
										menu.handleCloseNavMenu();
										menu.handleNavigate(page);
								  }
						}
					>
						{page === menu.t('language') ? (
							<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
								<Avatar
									sx={{ mr: -0.5, width: 30, height: 20, border: 0.5, borderRadius: 0 }}
									alt="language_flag"
									src={`${import.meta.env.PUBLIC_URL || ''}/upload/locales/${
										menu.currentLang?.img ?? 'default.png'
									}`}
								/>
								<Typography sx={{ fontWeight: 600 }}>{page}</Typography>
							</Box>
						) : (
							<Typography sx={{ fontWeight: menu.isNavPageActive(page) ? 800 : 600 }}>
								{page}
							</Typography>
						)}
						{page === menu.t('language') && <KeyboardArrowRight />}
					</MenuItem>
				))}
			</Menu>
			<LanguagePickerMenu menu={menu} sx={headerLangMenuMobileSx} />
		</Box>
	);
}

/** Ссылки — центральная колонка, по центру окна на любой ширине. */
export function HeaderNavCenter({ menu }: { menu: HeaderMenuState }): JSX.Element {
	return (
		<>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexWrap: 'wrap',
					rowGap: 0,
					maxWidth: '100%',
					px: { xs: 0.5, sm: 1 },
				}}
			>
				<CustomMenuPageText
					onClick={menu.scrollToTop}
					href="#"
					title={menu.t('table')}
					active={menu.isNavPageActive(menu.t('table'))}
					sx={menu.isNavPageActive(menu.t('table')) ? headerNavLinkActiveSx : undefined}
				/>
				<CustomMenuPageText
					onClick={menu.scrollToTop}
					href="#/bets/opened"
					title={menu.t('bets')}
					active={menu.isNavPageActive(menu.t('bets'))}
					sx={menu.isNavPageActive(menu.t('bets')) ? headerNavLinkActiveSx : undefined}
				/>
				<Box sx={headerNavDesktopSx}>
					{menu.pages.map((page) =>
						page === menu.t('language') ? (
							<Box
								key={page}
								sx={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}
								onClick={(event) => {
									menu.handleOpenLangMenu(event);
									menu.scrollToTop();
									menu.handleCloseNavMenu();
								}}
							>
								<Avatar
									sx={{ ml: 1, mr: -0.5, width: 26, height: 18, border: 0.5, borderRadius: 0 }}
									alt="language_flag"
									src={`${import.meta.env.PUBLIC_URL || ''}/upload/locales/${
										menu.currentLang?.img ?? 'default.png'
									}`}
								/>
								<CustomMenuPageText title={page} />
							</Box>
						) : (
							<CustomMenuPageText
								key={page}
								onClickCapture={() => {
									menu.handleNavigate(page);
									menu.scrollToTop();
									menu.handleCloseNavMenu();
								}}
								title={page}
								active={menu.isNavPageActive(page)}
								sx={menu.isNavPageActive(page) ? headerNavLinkActiveSx : undefined}
							/>
						)
					)}
				</Box>
			</Box>
			<LanguagePickerMenu menu={menu} sx={headerLangMenuDesktopSx} />
		</>
	);
}

/** @deprecated */
export default function MenuPages(): JSX.Element {
	const menu = useHeaderMenu();
	return (
		<>
			<HeaderNavLeft menu={menu} />
			<HeaderNavCenter menu={menu} />
		</>
	);
}
