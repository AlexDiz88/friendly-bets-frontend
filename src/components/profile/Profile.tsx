import React from 'react';
import { Box, Typography } from '@mui/material';

export default function Profile(): JSX.Element {
  return (
    <Box sx={{ textAlign: 'center', mx: 2, mt: 2, mb: 4 }}>
      <Typography sx={{ borderBottom: 2, pb: 1, mx: 2 }}>Личный кабинет</Typography>
      <Box sx={{ mt: 3 }}>
        <Typography sx={{ pb: 1, mx: 2 }}>Текущий сезон:</Typography>
      </Box>
    </Box>
  );
}
