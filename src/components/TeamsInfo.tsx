import { Box, Avatar } from '@mui/material';
import React from 'react';
import pathToLogoImage from './utils/pathToLogoImage';
import Team from '../features/admin/teams/types/Team';

export default function TeamsInfo({
  homeTeam,
  awayTeam,
}: {
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
}): JSX.Element {
  return (
    <Box sx={{ fontSize: '0.9rem', mt: 1 }}>
      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
        <b>Хозяева:</b>
        <Avatar
          component="span"
          variant="square"
          sx={{ px: 0.5, height: 27, width: 'auto' }}
          alt="league_logo"
          src={pathToLogoImage(homeTeam?.fullTitleEn)}
        />
        {homeTeam?.fullTitleRu} <br />
      </Box>
      <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
        <b>Гости:</b>
        <Avatar
          component="span"
          variant="square"
          sx={{ px: 0.5, height: 27, width: 'auto' }}
          alt="league_logo"
          src={pathToLogoImage(awayTeam?.fullTitleEn)}
        />
        {awayTeam?.fullTitleRu} <br />
      </Box>
    </Box>
  );
}
