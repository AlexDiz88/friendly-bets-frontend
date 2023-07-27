import React from 'react';
import { Box, Typography } from '@mui/material';
import Bet from './types/Bet';

export default function BetCard({
  bet,
  leagueName,
}: {
  bet: Bet;
  leagueName: string;
}): JSX.Element {
  const { username, homeTeamTitle, awayTeamTitle, betTitle, betOdds, betSize } = bet;
  return (
    <Box sx={{ border: 2, mx: 0.5, my: 1.5, p: 0.5, borderRadius: 2 }}>
      <Typography>
        {leagueName}, {username}
      </Typography>
      <Typography>
        {homeTeamTitle} - {awayTeamTitle}
      </Typography>
      <Typography>
        <b>Ставка:</b> {betTitle}
      </Typography>
      <Typography>
        <b>Кэф:</b> {betOdds}, <b>Сумма:</b> {betSize}
      </Typography>
    </Box>
  );
}
