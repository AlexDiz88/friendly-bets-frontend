import { Box, Typography } from '@mui/material';
import React from 'react';

export default function SeasonRegister(): JSX.Element {
  return (
    <Box sx={{ textAlign: 'center', mx: 2, mt: 2, mb: 4 }}>
      <Typography sx={{ borderBottom: 2, pb: 1, mx: 2 }}>
        Регистрация на сезон
      </Typography>
    </Box>
  );
}
