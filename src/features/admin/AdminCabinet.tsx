import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography } from '@mui/material';
import Seasons from './seasons/Seasons';
import { selectUser } from '../auth/selectors';

export default function AdminCabinet(): JSX.Element {
  const user = useSelector(selectUser);
  const navigate = useNavigate();

  if (user && user.role !== 'ADMIN') {
    navigate('/my/profile');
  }

  return (
    <Box sx={{ textAlign: 'center', mx: 2, mt: 2, mb: 4 }}>
      <Typography sx={{ borderBottom: 2, pb: 1, mx: 2 }}>AdminCabinet</Typography>
      <Seasons />
      <br />
      <div>Добавить участника в сезон / Форма регистрации юзера на сезон</div>
      <br />
      <div>Добавить лигу в сезон</div>
      <br />
      <div>Добавить команду в лигу</div>
      <br />
      <div>Добавить страницу добавления ставок</div>
      <br />
      <div>Закрыть доступ по ссылке в админ кабинет для других</div>
    </Box>
  );
}
