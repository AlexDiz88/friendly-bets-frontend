/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { Box } from '@mui/material';
import Bet from './types/Bet';
import BetInputPlayer from './BetInputPlayer';
import MatchDayForm from '../../components/MatchDayForm';

export default function BetEditForm({ bet }: { bet: Bet }): JSX.Element {
  const [matchDay, setMatchDay] = React.useState<string>(bet.matchDay);

  const handleUserSelection = (): void => {};
  const handleMatchDaySelection = (value: string): void => {
    setMatchDay(value);
    console.log(matchDay);
  };

  return (
    <Box
      sx={{
        maxWidth: '25rem',
        minWidth: '19rem',
        border: 2,
        mx: 0.5,
        mb: 1.5,
        p: 0.5,
        borderRadius: 2,
        bgcolor: 'white',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
      }}
    >
      <BetInputPlayer
        defaultValue={bet.username}
        onUserSelect={handleUserSelection}
      />
      {/* <MatchDayForm
        defaultValue={bet.matchDay}
        onMatchDaySelect={handleMatchDaySelection}
      /> */}
      <Box>{bet.homeTeam.fullTitleRu}</Box>
      <Box>{bet.awayTeam.fullTitleRu}</Box>
      <Box>{bet.betTitle}</Box>
      <Box>{bet.betOdds}</Box>
      <Box>{bet.betSize}</Box>
      <Box>{bet.betStatus}</Box>
      <Box>{bet.gameResult}</Box>
    </Box>
  );
}
