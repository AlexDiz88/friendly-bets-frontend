import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Tooltip,
  IconButton,
  Avatar,
  Typography,
  MenuItem,
  Menu,
} from '@mui/material';
import { useAppDispatch } from '../store';
import { selectUser } from '../features/auth/selectors';
import { getProfile, logout } from '../features/auth/authSlice';

const authSettings = ['Мой профиль', 'Моя статистика', 'Выйти'];
const settings = ['Войти', 'Зарегистрироваться'];

export default function UserSettings(): JSX.Element {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleProfile = (): void => {
    // логика для обработки события клика на "Мой профиль"
  };

  const handleStatistics = (): void => {
    // логика для обработки события клика на "Моя статистика"
  };

  const handleLogout = React.useCallback(async () => {
    const dispatchResult = await dispatch(logout());

    if (logout.fulfilled.match(dispatchResult)) {
      dispatch(getProfile());
      navigate('/auth/login');
    }

    if (logout.rejected.match(dispatchResult)) {
      throw new Error(dispatchResult.error.message);
    }
  }, [dispatch, navigate]);

  const handleLogin = (): void => {
    navigate('/auth/login');
  };

  const handleRegister = (): void => {
    navigate('/auth/register');
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', flexGrow: 1 }}>
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar
            alt="Remy Sharp"
            src="https://kartinkin.net/pics/uploads/posts/2022-09/1662642172_2-kartinkin-net-p-risunok-na-avatarku-dlya-muzhchin-instagra-2.jpg"
          />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{ mt: '45px' }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {(user !== undefined ? authSettings : settings).map((setting: string) => (
          <MenuItem
            key={setting}
            onClick={() => {
              if (setting === 'Мой профиль') {
                handleProfile();
              } else if (setting === 'Моя статистика') {
                handleStatistics();
              } else if (setting === 'Выйти') {
                handleLogout();
              } else if (setting === 'Войти') {
                handleLogin();
              } else if (setting === 'Зарегистрироваться') {
                handleRegister();
              }
              handleCloseUserMenu();
            }}
          >
            <Typography textAlign="center">{setting}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}
