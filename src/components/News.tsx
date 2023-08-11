import { Box, Container } from '@mui/material';
import React from 'react';
import StartSeason2324 from './news/StartSeason2324';

export default function News(): JSX.Element {
  return (
    <Container>
      <Box
        sx={{
          textAlign: 'center',
          borderBottom: 2,
          mx: 2,
          pb: 1,
          mb: 2,
          fontWeight: 600,
        }}
      >
        Новости сайта
      </Box>
      <StartSeason2324 />
    </Container>
  );
}
