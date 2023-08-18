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
import { useAppDispatch } from '../../store';
import { selectUser } from '../../features/auth/selectors';
import { getProfile, logout } from '../../features/auth/authSlice';
import pathToAvatarImage from '../utils/pathToAvatarImage';

const adminSettings = [
  'Внести ставку',
  'Подвести итоги',
  'Админ кабинет',
  'Удалить ставку',
  'Выйти',
];
const moderSettings = [
  'Внести ставку',
  'Подвести итоги',
  'Редактирование ставок',
  'Мой профиль',
  'Моя статистика',
  'Регистрация на турнир',
  'Выйти',
];
const authSettings = [
  'Мой профиль',
  'Моя статистика',
  'Регистрация на турнир',
  'Выйти',
];
const notAuthSettings = ['Войти', 'Зарегистрироваться'];
let settings: string[] = [];

export default function UserSettings(): JSX.Element {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  if (user === undefined) {
    settings = notAuthSettings;
  } else if (user.role === 'USER') {
    settings = authSettings;
  } else if (user.role === 'MODERATOR') {
    settings = moderSettings;
  } else if (user.role === 'ADMIN') {
    settings = adminSettings;
  }

  const handleBetsEditList = (): void => {
    navigate('/bets/edit');
  };

  const handleMyProfile = (): void => {
    navigate('/my/profile');
  };

  const handleMyStatistic = (): void => {
    navigate('/my/stats');
  };

  const handleBetInput = (): void => {
    navigate('/bet-input');
  };

  const handleAdminCabinet = (): void => {
    navigate('/admin/cabinet');
  };

  const handleSeasonRegister = (): void => {
    navigate('/season/register');
  };

  const handleBetsCheck = (): void => {
    navigate('/bets/check');
  };

  const handleBetDelete = (): void => {
    // логика для обработки события клика на "Удалить ставку"
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
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        flexGrow: 1,
        pl: { xs: 0, md: 3 },
      }}
    >
      <Tooltip title="Open settings">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar alt="avatar" src={pathToAvatarImage(user?.avatar)} />
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
        {settings.map((setting: string) => (
          <MenuItem
            key={setting}
            onClick={() => {
              if (setting === 'Мой профиль') {
                handleMyProfile();
              } else if (setting === 'Моя статистика') {
                handleMyStatistic();
              } else if (setting === 'Выйти') {
                handleLogout();
              } else if (setting === 'Войти') {
                handleLogin();
              } else if (setting === 'Зарегистрироваться') {
                handleRegister();
              } else if (setting === 'Внести ставку') {
                handleBetInput();
              } else if (setting === 'Удалить ставку') {
                handleBetDelete();
              } else if (setting === 'Админ кабинет') {
                handleAdminCabinet();
              } else if (setting === 'Регистрация на турнир') {
                handleSeasonRegister();
              } else if (setting === 'Подвести итоги') {
                handleBetsCheck();
              } else if (setting === 'Редактирование ставок') {
                handleBetsEditList();
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
