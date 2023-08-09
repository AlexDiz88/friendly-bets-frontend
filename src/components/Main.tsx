import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './header/Header';
import { useAppDispatch } from '../store';
import { getProfile } from '../features/auth/authSlice';
import { getActiveSeason } from '../features/admin/seasons/seasonsSlice';

export default function Main(): JSX.Element {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getProfile());
    dispatch(getActiveSeason());
  }, [dispatch]);

  return (
    <>
      <Header />
      <Box sx={{ mt: 9, mb: 3, mx: 0.5 }}>
        <Outlet />
      </Box>
    </>
  );
}
