import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';

const pages = [
  'Календарь игр',
  'По турам',
  'По турнирам',
  'По командам',
  'По месяцам',
  'Правила',
];

export default function MenuPages(): JSX.Element {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleProfile = (): void => {
    // логика для обработки события клика на "Календарь игр" + добавить прочие меню
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (): void => {
    setAnchorElNav(null);
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
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorElNav)}
          onClose={handleCloseNavMenu}
          sx={{
            display: { xs: 'block', md: 'none' },
          }}
        >
          {pages.map((page) => (
            <MenuItem key={page} onClick={handleCloseNavMenu}>
              <Typography fontFamily="Exo 2" textAlign="center">
                {page}
              </Typography>
            </MenuItem>
          ))}
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
          sx={{
            my: 2,
            mx: 1,
            fontFamily: 'Exo 2',
            fontSize: '1rem',
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': {
              color: '#09e260',
            },
          }}
        >
          Таблица
        </Typography>
        <Typography
          variant="h5"
          noWrap
          component="a"
          href="#/bets"
          sx={{
            my: 2,
            mx: 1,
            fontFamily: 'Exo 2',
            fontSize: '1rem',
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': {
              color: '#09e260',
            },
          }}
        >
          Ставки
        </Typography>
        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          {pages.map((page) => (
            <Typography
              fontFamily="Exo 2"
              fontSize="0.9rem"
              key={page}
              onClickCapture={() => {
                handleCloseNavMenu();
                handleProfile();
              }}
              variant="h5"
              noWrap
              component="a"
              href=""
              sx={{
                my: 2,
                mx: 1,
                fontFamily: 'Exo 2',
                fontSize: '1rem',
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  color: '#09e260',
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
