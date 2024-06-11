import { useState } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { KeyboardArrowRight } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Avatar } from '@mui/material';

interface Language {
	code: string;
	name: string;
	img: string;
}

export default function MenuPages(): JSX.Element {
	const navigate = useNavigate();
	const { t, i18n } = useTranslation();
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
	const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);

	const pages = [
		t('news'),
		t('byLeagues'),
		t('byTeams'),
		// t('byMatchDay'),
		// t('byMonths'),
		t('archive'),
		t('rules'),
	];
	const languages: Language[] = [
		{ code: 'en', name: 'English', img: 'english.png' },
		{ code: 'de', name: 'Deutsch', img: 'german.png' },
		{ code: 'ru', name: 'Русский', img: 'russian.png' },
	];

	// window.onload = () => {
	// 	const selectedLanguage = localStorage.getItem('selectedLanguage');
	// 	if (selectedLanguage) {
	// 		i18n.changeLanguage(selectedLanguage);
	// 	}
	// };

	const handleNavigate = (page: string): void => {
		if (page === t('news')) {
			navigate('/news');
		} else if (page === t('byMatchDay')) {
			navigate('/in-progress');
		} else if (page === t('byLeagues')) {
			navigate('/stats/leagues');
		} else if (page === t('byTeams')) {
			navigate('/stats/teams');
		} else if (page === t('byMonths')) {
			navigate('/in-progress');
		} else if (page === t('archive')) {
			navigate('/archive');
		} else if (page === t('rules')) {
			navigate('/rules');
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
		// localStorage.setItem('selectedLanguage', lang.code);
		i18n.changeLanguage(lang.code);
		handleCloseLangMenu();
		handleCloseNavMenu();
		// window.location.reload();
	};

	const scrollToTop = (): void => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	return (
		<>
			<Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="menu-appbar"
					aria-haspopup="true"
					onClick={handleOpenNavMenu}
					color="inherit"
				>
					<MenuIcon />
				</IconButton>
				<Menu
					id="menu-appbar"
					anchorEl={anchorElNav}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					keepMounted
					transformOrigin={{
						vertical: 'top',
						horizontal: 'right',
					}}
					open={Boolean(anchorElNav)}
					onClose={handleCloseNavMenu}
					sx={{
						display: { xs: 'block', md: 'none', lg: 'none' },
					}}
				>
					{pages.map((page) => (
						<MenuItem
							key={page}
							onClick={() => {
								handleCloseNavMenu();
								handleNavigate(page);
							}}
						>
							<Typography>{page}</Typography>
						</MenuItem>
					))}
					<MenuItem
						onClick={handleOpenLangMenu}
						sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
					>
						<Typography>{t('language')}</Typography>
						<KeyboardArrowRight />
					</MenuItem>
					<Menu
						id="language-menu"
						anchorEl={anchorElLang}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'left',
						}}
						open={Boolean(anchorElLang)}
						onClose={handleCloseLangMenu}
					>
						{languages.map((lang) => (
							<MenuItem key={lang.code} onClick={() => handleLanguageSelect(lang)}>
								<Box sx={{ mb: 0.8, ml: 0.5, display: 'flex', alignItems: 'center' }}>
									<Avatar
										sx={{ mr: 0.5, width: 30, height: 20, border: 0.5, borderRadius: 0 }}
										alt="language_flag"
										// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
										src={`${import.meta.env.PUBLIC_URL || ''}/upload/locales/${lang.img}`}
									/>
									{lang.name}
								</Box>
							</MenuItem>
						))}
					</Menu>
				</Menu>
			</Box>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
				}}
			>
				<Typography
					variant="h5"
					noWrap
					component="a"
					href="#"
					onClick={scrollToTop}
					sx={{
						px: { xs: 0, md: 0.5 },
						my: 2,
						mx: 1,
						fontWeight: 600,
						fontSize: '1rem',
						color: 'inherit',
						textDecoration: 'none',
						'&:hover': {
							color: '#ff9800',
						},
					}}
				>
					{t('table')}
				</Typography>
				<Typography
					variant="h5"
					noWrap
					component="a"
					href="#/bets"
					onClick={scrollToTop}
					sx={{
						px: { xs: 0, md: 0.5 },
						my: 2,
						mx: 1,
						fontWeight: 600,
						fontSize: '1rem',
						color: 'inherit',
						textDecoration: 'none',
						'&:hover': {
							color: '#ff9800',
						},
					}}
				>
					{t('bets')}
				</Typography>
				<Box
					sx={{
						flexGrow: 1,
						display: { xs: 'none', md: 'flex' },
					}}
				>
					{pages.map((page) => (
						<Typography
							fontFamily="Exo 2"
							fontSize="0.9rem"
							key={page}
							onClickCapture={() => {
								handleCloseNavMenu();
								handleNavigate(page);
								scrollToTop();
							}}
							variant="h5"
							noWrap
							sx={{
								px: { xs: 0, md: 0.5 },
								my: 2,
								mx: 1,
								fontFamily: 'Exo 2',
								fontWeight: 600,
								fontSize: '1rem',
								color: 'inherit',
								textDecoration: 'none',
								cursor: 'pointer',
								'&:hover': {
									color: '#ff9800',
								},
							}}
						>
							{page}
						</Typography>
					))}
				</Box>
			</Box>
		</>
	);
}
