import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/selectors';
import { useAppDispatch } from '../../store';
import {
  editEmail,
  editPassword,
  editUsername,
  getProfile,
} from '../../features/auth/authSlice';
import NotificationSnackbar from '../utils/NotificationSnackbar';
import pathToAvatarImage from '../utils/pathToAvatarImage';
import UploadForm from '../UploadForm';

export default function Profile(): JSX.Element {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
  const [newName, setNewName] = useState(user?.username || '');
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarDuration, setSnackbarduration] = useState(2000);

  const handleToggleCurrentPasswordVisibility = (): void => {
    setShowCurrentPassword((prevShowPassword: boolean) => !prevShowPassword);
  };

  const handleToggleNewPasswordVisibility = (): void => {
    setShowNewPassword((prevShowPassword: boolean) => !prevShowPassword);
  };

  const handleEditEmail = (): void => {
    setShowEmailInput(true);
  };

  const handleEditPassword = (): void => {
    setShowPasswordInput(true);
  };

  const handleEditName = (): void => {
    setShowNameInput(true);
  };

  const handleCancelEmail = (): void => {
    if (user?.email) {
      setNewEmail(user.email);
    }
    setShowEmailInput(false);
  };

  const handleCancelPassword = (): void => {
    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordRepeat('');
    setShowPasswordInput(false);
  };

  const handleCancelName = (): void => {
    if (user?.username) {
      setNewName(user?.username);
    }
    setShowNameInput(false);
  };

  // сохраняем email
  const handleSaveEmail = React.useCallback(async () => {
    const dispatchResult = await dispatch(editEmail({ email: newEmail }));
    if (editEmail.fulfilled.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Email успешно изменен');
      setShowEmailInput(false);
    }
    if (editEmail.rejected.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('error');
      setSnackbarduration(3000);
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, newEmail]);

  // сохраняем пароль
  const handleSavePassword = React.useCallback(async () => {
    const dispatchResult = await dispatch(
      editPassword({ currentPassword, newPassword, newPasswordRepeat })
    );
    if (editPassword.fulfilled.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Пароль успешно изменен');
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordRepeat('');
      setShowPasswordInput(false);
    }
    if (editPassword.rejected.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('error');
      setSnackbarduration(3000);
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, currentPassword, newPassword, newPasswordRepeat]);

  // сохраняем имя
  const handleSaveName = React.useCallback(async () => {
    const dispatchResult = await dispatch(editUsername({ username: newName }));
    if (editUsername.fulfilled.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('success');
      setSnackbarMessage('Имя успешно изменено');
      setShowNameInput(false);
    }
    if (editUsername.rejected.match(dispatchResult)) {
      setOpenSnackbar(true);
      setSnackbarSeverity('error');
      setSnackbarduration(6000);
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, newName]);

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch, openSnackbar]);

  // редирект неаутентифицированных пользователей
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        navigate('/auth/login');
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate, user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!user) {
    return (
      <Box
        sx={{
          p: 5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        {showMessage && (
          <Box sx={{ textAlign: 'center', my: 3, fontWeight: 600, color: 'brown' }}>
            Проверка авторизации на доступ к личному кабинету
          </Box>
        )}
        <CircularProgress size={100} color="primary" />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        mx: 2,
        mt: 2,
        mb: 4,
      }}
    >
      <Typography sx={{ borderBottom: 2, pb: 1, mx: 2, px: 7 }}>
        Личный кабинет
      </Typography>
      <Box sx={{ p: 2 }}>
        <Avatar
          sx={{ mr: 1, height: '7rem', width: '7rem', border: 1 }}
          alt="user_avatar"
          src={pathToAvatarImage(user.avatar)}
        />
      </Box>

      {!showUploadForm && (
        <Button
          sx={{ height: '1.8rem', px: 1 }}
          variant="contained"
          onClick={() => setShowUploadForm(true)}
        >
          <Typography
            variant="button"
            fontWeight="600"
            fontSize="0.9rem"
            fontFamily="Shantell Sans"
          >
            Изменить фото
          </Typography>
        </Button>
      )}
      {showUploadForm && <UploadForm onClose={() => setShowUploadForm(false)} />}

      <Typography sx={{ textAlign: 'center', pt: 1, mx: 2 }}>
        <b>Email:</b> {user?.email}
      </Typography>
      {showEmailInput ? (
        <Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
          <TextField
            size="small"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            sx={{ mr: 1, mb: 1.5 }}
          />
          <Button
            sx={{ height: '1.8rem', px: 1, mr: 1 }}
            variant="contained"
            color="error"
            onClick={handleCancelEmail}
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Отмена
            </Typography>
          </Button>
          <Button
            onClick={handleSaveEmail}
            sx={{ height: '1.8rem', px: 1 }}
            variant="contained"
            color="success"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Изменить
            </Typography>
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
          <Button
            sx={{ height: '1.8rem', px: 2 }}
            variant="contained"
            onClick={handleEditEmail}
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Изменить Email
            </Typography>
          </Button>
        </Box>
      )}

      {showPasswordInput ? (
        <Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
          <TextField
            size="small"
            fullWidth
            required
            id="current-password"
            label="Текущий пароль"
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            sx={{ mr: 1, mb: 1.5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleCurrentPasswordVisibility}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            size="small"
            fullWidth
            required
            id="new-password"
            label="Новый пароль"
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mr: 1, mb: 1.5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleNewPasswordVisibility}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            size="small"
            fullWidth
            required
            id="new-password-repeat"
            label="Новый пароль (еще раз)"
            type={showNewPassword ? 'text' : 'password'}
            value={newPasswordRepeat}
            onChange={(e) => setNewPasswordRepeat(e.target.value)}
            sx={{ mr: 1, mb: 1.5 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleToggleNewPasswordVisibility}
                    edge="end"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            sx={{ height: '1.8rem', px: 1, mr: 1 }}
            variant="contained"
            color="error"
            onClick={handleCancelPassword}
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Отмена
            </Typography>
          </Button>
          <Button
            onClick={handleSavePassword}
            sx={{ height: '1.8rem', px: 1 }}
            variant="contained"
            color="success"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Изменить
            </Typography>
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
          <Button
            sx={{ height: '1.8rem', px: 2 }}
            variant="contained"
            onClick={handleEditPassword}
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Изменить пароль
            </Typography>
          </Button>
        </Box>
      )}

      <Typography sx={{ textAlign: 'center', pt: 1, mx: 2 }}>
        <b>Имя:</b> {user?.username}
      </Typography>
      {showNameInput ? (
        <Box sx={{ textAlign: 'center', mx: 2, mt: 1, mb: 2 }}>
          <TextField
            size="small"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mr: 1, mb: 1.5 }}
          />

          <Button
            sx={{ height: '1.8rem', px: 1, mr: 1 }}
            variant="contained"
            color="error"
            onClick={handleCancelName}
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Отмена
            </Typography>
          </Button>
          <Button
            onClick={handleSaveName}
            sx={{ height: '1.8rem', px: 1 }}
            variant="contained"
            color="success"
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Изменить
            </Typography>
          </Button>
        </Box>
      ) : (
        <Box sx={{ textAlign: 'left', mx: 2, mt: 1, mb: 2 }}>
          <Button
            sx={{ height: '1.8rem', px: 2 }}
            variant="contained"
            onClick={handleEditName}
          >
            <Typography
              variant="button"
              fontWeight="600"
              fontSize="0.9rem"
              fontFamily="Shantell Sans"
            >
              Изменить имя
            </Typography>
          </Button>
        </Box>
      )}
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ pb: 1, px: 7, mx: 2, borderBottom: 2 }}>
          Текущий сезон:
        </Typography>
        <Typography sx={{ mt: 1, mx: 2, fontWeight: 600, color: 'brown' }}>
          Контент в разработке
        </Typography>
      </Box>
      <Box textAlign="center">
        <NotificationSnackbar
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          message={snackbarMessage}
          duration={snackbarDuration}
        />
      </Box>
    </Box>
  );
}
