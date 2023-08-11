import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Seasons from './seasons/Seasons';
import { selectUser } from '../auth/selectors';
import { useAppDispatch } from '../../store';
import { getProfile } from '../auth/authSlice';

export default function AdminCabinet(): JSX.Element {
  const dispatch = useAppDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      // Если пользовательне авторизован, перенаправляем на главную
      navigate('/');
    } else if (user.role !== 'ADMIN') {
      // Если пользователь не админ, также перенаправляем на главную
      navigate('/');
    } else {
      dispatch(getProfile());
    }
  }, [dispatch, navigate, user]);

  if (!user || user.role !== 'ADMIN') {
    return (
      <div>
        <Typography sx={{ m: 1, fontSize: '1rem', fontWeight: 600, color: 'brown' }}>
          У вас нет доступа к админ-панели
          <br /> Вы будете перенаправлены на главную страницу
        </Typography>
      </div>
    );
  }

  return (
    <Box sx={{ textAlign: 'center', mx: 2, mb: 4 }}>
      <Typography sx={{ borderBottom: 2, pb: 1, mx: 2 }}>AdminCabinet</Typography>
      <Seasons />
    </Box>
  );
}
