import React from 'react';
import { Avatar, Box } from '@mui/material';
import { GppMaybe } from '@mui/icons-material';
import Bet from './types/Bet';
import League from '../admin/leagues/types/League';
import pathToAvatarImage from '../../components/utils/pathToAvatarImage';

export default function EmptyBetCard({
  bet,
  league,
}: {
  bet: Bet;
  league: League;
}): JSX.Element {
  const { player, balanceChange, betSize, matchDay } = bet;
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
        bgcolor: '#e0dfe4',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ mb: 0.8, ml: 0.5, display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ mr: 0.5, width: 30, height: 30 }}
            alt="user_avatar"
            src={pathToAvatarImage(player.avatar)}
          />
          <b>{player.username}</b>
        </Box>
        <Box
          sx={{
            mr: 1,
            display: 'flex',
            alignItems: 'start',
          }}
        >
          <Avatar
            sx={{ mr: 0.5, width: 25, height: 25 }}
            alt="team_logo"
            src={`${process.env.PUBLIC_URL}/upload/logo/${league.displayNameEn
              .toLowerCase()
              .replace(/\s/g, '_')}.png`}
          />
          {league.shortNameRu} - {matchDay}й
        </Box>
      </Box>
      <Box sx={{ textAlign: 'left', ml: 0.5 }}>
        <b>Сумма:</b> {betSize}
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Box
            sx={{
              fontSize: '0.85rem',
              fontWeight: 600,
              pl: 0.5,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <GppMaybe sx={{ color: '#8f2323' }} /> Ставка на тур не сделана
          </Box>
        </Box>
        {balanceChange !== undefined && (
          <Box
            sx={{
              pr: 1,
              fontWeight: 600,
              fontSize: '1.4rem',
              color: 'brown',
            }}
          >
            {balanceChange}€
          </Box>
        )}
      </Box>
    </Box>
  );
}
