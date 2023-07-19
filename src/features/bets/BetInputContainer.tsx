import { Box, Typography } from '@mui/material';
import React from 'react';
import BetInputPlayer from './BetInputPlayer';

export default function BetInputContainer(): JSX.Element {
  return (
    <Box>
      <Typography>Bet Input Container</Typography>
      <BetInputPlayer />
    </Box>
  );
}
