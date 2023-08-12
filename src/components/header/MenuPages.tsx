import React from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';

const pages = [
  'Новости',
  'По турам',
  'По турнирам',
  'По командам',
  'По месяцам',
  'Правила',
];

export default function MenuPages(): JSX.Element {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleNavigate = (page: string): void => {
    if (page === 'Новости') {
      navigate('/news');
    } else if (page === 'По турам') {
      navigate('/in-progress');
    } else if (page === 'По турнирам') {
      navigate('/in-progress');
    } else if (page === 'По командам') {
      navigate('/in-progress');
    } else if (page === 'По месяцам') {
      navigate('/in-progress');
    } else if (page === 'Правила') {
      navigate('/in-progress');
    }
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
            px: { xs: 0, md: 0.5 },
            my: 2,
            mx: 1,
            fontFamily: 'Exo 2',
            fontWeight: 600,
            fontSize: '1rem',
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': {
              color: '#ff9800',
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
            px: { xs: 0, md: 0.5 },
            my: 2,
            mx: 1,
            fontFamily: 'Exo 2',
            fontWeight: 600,
            fontSize: '1rem',
            color: 'inherit',
            textDecoration: 'none',
            '&:hover': {
              color: '#ff9800',
            },
          }}
        >
          Ставки
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
