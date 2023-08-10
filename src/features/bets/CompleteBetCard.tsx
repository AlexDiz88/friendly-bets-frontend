import React from 'react';
import { Avatar, Box } from '@mui/material';
import { GppGood, RestorePage, GppBad } from '@mui/icons-material';
import Bet from './types/Bet';
import League from '../admin/leagues/types/League';

export default function CompleteBetCard({
  bet,
  league,
}: {
  bet: Bet;
  league: League;
}): JSX.Element {
  const {
    username,
    homeTeam,
    awayTeam,
    betTitle,
    betOdds,
    betSize,
    gameResult,
    betStatus,
    balanceChange,
    matchDay,
  } = bet;

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
        bgcolor:
          betStatus === 'WON'
            ? '#daf3db'
            : betStatus === 'RETURNED'
            ? '#f8f9d6'
            : '#f3dada',
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
            src="https://kartinkin.net/pics/uploads/posts/2022-09/1662642172_2-kartinkin-net-p-risunok-na-avatarku-dlya-muzhchin-instagra-2.jpg"
          />
          <b>{username}</b>
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
            src={`${
              process.env.PUBLIC_URL
            }/upload/logo/${league.displayNameEn.replace(/\s/g, '_')}.png`}
          />
          {league.shortNameRu} - {matchDay}й
        </Box>
      </Box>
      <Box sx={{ fontSize: '0.9rem' }}>
        <Box style={{ display: 'flex', justifyContent: 'center' }}>
          <Avatar
            sx={{ mr: 0.5, width: 25, height: 25 }}
            alt="team_logo"
            src={`${
              process.env.PUBLIC_URL
            }/upload/logo/${homeTeam.fullTitleEn.replace(/\s/g, '_')}.png`}
          />
          {homeTeam.fullTitleRu}
          <Avatar
            sx={{ mr: 0.5, ml: 1, width: 25, height: 25 }}
            alt="team_logo"
            src={`${
              process.env.PUBLIC_URL
            }/upload/logo/${awayTeam.fullTitleEn.replace(/\s/g, '_')}.png`}
          />
          {awayTeam.fullTitleRu}
        </Box>
      </Box>
      <Box sx={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 600 }}>
        {gameResult}
      </Box>
      <Box sx={{ textAlign: 'left', ml: 0.5 }}>
        <b>Ставка:</b> {betTitle}
      </Box>
      <Box sx={{ textAlign: 'left', ml: 0.5 }}>
        <b>Кэф:</b> {betOdds.toFixed(2)}, <b>Сумма:</b> {betSize}
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
            {betStatus === 'WON' ? (
              <GppGood sx={{ color: 'green' }} />
            ) : betStatus === 'RETURNED' ? (
              <RestorePage sx={{ color: '#b89e00' }} />
            ) : (
              <GppBad sx={{ color: '#bd0000' }} />
            )}

            {betStatus === 'WON'
              ? 'Ставка сыграла'
              : betStatus === 'RETURNED'
              ? 'Ставка вернулась'
              : 'Ставка не сыграла'}
          </Box>
        </Box>
        {balanceChange !== undefined && (
          <Box
            sx={{
              pr: 1,
              fontWeight: 600,
              fontSize: '1.4rem',
              color:
                balanceChange > 0 ? 'green' : balanceChange < 0 ? 'brown' : 'black',
            }}
          >
            {Number.isInteger(balanceChange)
              ? balanceChange
              : balanceChange.toFixed(2)}
            €
          </Box>
        )}
      </Box>
    </Box>
  );
}
