import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './header/Header';

export default function Main(): JSX.Element {
  return (
    <>
      <Header />
      <Box sx={{ mt: 9, mb: 3, mx: 0.5 }}>
        <Outlet />
      </Box>
    </>
  );
}
