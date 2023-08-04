import React, { useState } from 'react';
import { Avatar, Box, Button, TextField, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/auth/selectors';
import { useAppDispatch } from '../../store';
import { editEmail, editUsername } from '../../features/auth/authSlice';
import NotificationSnackbar from '../utils/NotificationSnackbar';

export default function Profile(): JSX.Element {
  const user = useSelector(selectUser);
  const dispatch = useAppDispatch();
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);

  const [newEmail, setNewEmail] = useState(user?.email || '');
  const [newName, setNewName] = useState(user?.username || '');

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'error' | 'warning' | 'info'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarDuration, setSnackbarduration] = useState(3000);

  const handleEditEmail = (): void => {
    setShowEmailInput(true);
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

  const handleCancelName = (): void => {
    if (user?.username) {
      setNewName(user?.username);
    }
    setShowNameInput(false);
  };

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
      setSnackbarduration(5000);
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, newEmail]);

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
      setSnackbarduration(10000);
      if (dispatchResult.error.message) {
        setSnackbarMessage(dispatchResult.error.message);
      }
    }
  }, [dispatch, newName]);

  const handleCloseSnackbar = (): void => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ textAlign: 'center', mx: 2, mt: 2, mb: 4 }}>
      <Typography sx={{ borderBottom: 2, pb: 1, mx: 2 }}>Личный кабинет</Typography>
      <Box sx={{ p: 2 }}>
        <Avatar
          sx={{ mr: 1, height: '7rem', width: '7rem', border: 1 }}
          alt="user_avatar"
          src="https://kartinkin.net/pics/uploads/posts/2022-09/1662642172_2-kartinkin-net-p-risunok-na-avatarku-dlya-muzhchin-instagra-2.jpg"
        />
      </Box>
      <Typography sx={{ textAlign: 'left', pt: 1, mx: 2 }}>
        <b>Email:</b> {user?.email}
      </Typography>
      {showEmailInput ? (
        <Box sx={{ textAlign: 'left', mx: 2, mt: 1, mb: 2 }}>
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
        <Box sx={{ textAlign: 'left', mx: 2, mt: 1, mb: 2 }}>
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
      <Typography sx={{ textAlign: 'left', pt: 1, mx: 2 }}>
        <b>Имя:</b> {user?.username}
      </Typography>
      {showNameInput ? (
        <Box sx={{ textAlign: 'left', mx: 2, mt: 1, mb: 2 }}>
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
        <Typography sx={{ pb: 1, mx: 2, borderBottom: 2 }}>
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
