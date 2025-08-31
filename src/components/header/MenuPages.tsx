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
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectUser } from '../../features/auth/selectors';
import { changeLanguageAsync, saveUserLanguageAsync } from '../../features/languages/languageSlice';
import Language from '../../features/languages/types/Language';
import CustomMenuPageText from '../custom/CustomMenuPageText';

export default function MenuPages(): JSX.Element {
	const user = useAppSelector(selectUser);
	const { t, i18n } = useTranslation();
	useAppSelector((state) => state.language);
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

	const pages = [
		t('news'),
		t('byGameweeks'),
		t('byBetTitles'),
		t('footballData'),
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

	return (
		<>
			{/* Мобильная версия меню */}
			<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="menu-app-bar"
					aria-haspopup="true"
					onClick={handleOpenNavMenu}
					color="inherit"
				>
					<MenuIcon />
				</IconButton>
				<Menu
					id="menu-app-bar"
					anchorEl={anchorElNav}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{ vertical: 'top', horizontal: 'right' }}
					open={Boolean(anchorElNav)}
					onClose={handleCloseNavMenu}
					sx={{
						display: { xs: 'block', md: 'none', lg: 'none' },
					}}
				>
					{pages.map((page) => (
						<MenuItem
							key={page}
							sx={
								page === t('language')
									? {
											display: 'flex',
											alignItems: 'center',
											justifyContent: 'space-between',
									  }
									: undefined
							}
							onClick={
								page === t('language')
									? handleOpenLangMenu
									: () => {
											handleCloseNavMenu();
											handleNavigate(page);
									  }
							}
						>
							{page === t('language') ? (
								<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
									<Avatar
										sx={{ mr: -0.5, width: 30, height: 20, border: 0.5, borderRadius: 0 }}
										alt="language_flag"
										src={`${import.meta.env.PUBLIC_URL || ''}/upload/locales/${
											currentLang?.img ?? 'default.png'
										}`}
									/>
									<Typography sx={{ fontWeight: 600 }}>{page}</Typography>
								</Box>
							) : (
								<Typography sx={{ fontWeight: 600 }}>{page}</Typography>
							)}
							{page === t('language') && <KeyboardArrowRight />}
						</MenuItem>
					))}
				</Menu>
			</Box>

			{/* Десктопная версия меню */}
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<CustomMenuPageText onClick={scrollToTop} href="#" title={t('table')} />
				<CustomMenuPageText onClick={scrollToTop} href="#/bets/opened" title={t('bets')} />
				<Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
					{pages.map((page) =>
						page === t('language') ? (
							<Box
								key={page}
								sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 2 }}
								onClick={(event) => {
									handleOpenLangMenu(event);
									scrollToTop();
									handleCloseNavMenu();
								}}
							>
								<Avatar
									sx={{ mr: -1, width: 26, height: 18, border: 0.5, borderRadius: 0 }}
									alt="language_flag"
									src={`${import.meta.env.PUBLIC_URL || ''}/upload/locales/${
										currentLang?.img ?? 'default.png'
									}`}
								/>
								<CustomMenuPageText title={page} />
							</Box>
						) : (
							<CustomMenuPageText
								key={page}
								onClickCapture={() => {
									handleNavigate(page);
									scrollToTop();
									handleCloseNavMenu();
								}}
								title={page}
							/>
						)
					)}
				</Box>
			</Box>

			<Menu
				id="language-menu"
				anchorEl={anchorElLang}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'left' }}
				open={Boolean(anchorElLang)}
				onClose={handleCloseLangMenu}
			>
				{languages.map((lang) => (
					<MenuItem key={lang.code} onClick={() => handleLanguageSelect(lang)}>
						<Box sx={{ mb: 0.8, ml: 0, display: 'flex', alignItems: 'center' }}>
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
		</>
	);
}
