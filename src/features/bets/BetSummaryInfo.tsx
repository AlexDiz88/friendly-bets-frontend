import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import User from '../auth/types/User';
import League from '../admin/leagues/types/League';
import Team from '../admin/teams/types/Team';
import pathToLogoImage from '../../components/utils/pathToLogoImage';

export default function BetSummaryInfo({
  message,
  player,
  league,
  matchDay,
  homeTeam,
  awayTeam,
  isNot,
  betTitle,
  betOdds,
  betSize,
  betStatus,
  gameResult,
}: {
  message: string;
  player: User | undefined;
  league: League | undefined;
  matchDay: string;
  homeTeam: Team | undefined;
  awayTeam: Team | undefined;
  betTitle: string;
  isNot: boolean;
  betOdds: string;
  betSize: string;
  gameResult: string;
  betStatus: string;
}): JSX.Element {
  return (
    <>
      <Typography
        component="span"
        sx={{ textAlign: 'center', borderBottom: 1, pb: 0.3 }}
      >
        <b>{message}</b>
        <br />
      </Typography>
      <Typography component="span" sx={{ fontSize: '0.9rem' }}>
        <b>Участник:</b> {player?.username} <br />
        <Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
          <b>Лига:</b>
          <Avatar
            component="span"
            variant="square"
            sx={{ px: 0.5, height: 27, width: 'auto' }}
            alt="league_logo"
            src={`${process.env.PUBLIC_URL}/upload/logo/${league?.displayNameEn
              .toLowerCase()
              .replace(/\s/g, '_')}.png`}
          />
          {league?.displayNameRu} <br />
        </Box>
        <b>Тур:</b> {matchDay} <br />
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
        <b>Ставка:</b> {betTitle}
        {isNot ? ' - нет' : ''} <br />
        <b>Кэф:</b> {betOdds} <br />
        <b>Сумма:</b> {betSize} <br />
        {betStatus && betStatus !== 'OPENED' && (
          <>
            <b>Статус ставки:</b> {betStatus}
            <br />
            <b>Итовый счёт: </b>
            <Typography
              component="span"
              sx={{
                color:
                  gameResult === 'Некорректный счёт матча!' || gameResult === ''
                    ? 'brown'
                    : 'inherit',
                fontWeight:
                  gameResult === 'Некорректный счёт матча!' || gameResult === ''
                    ? 600
                    : 400,
              }}
            >
              {gameResult || 'Не указан!'}
            </Typography>
          </>
        )}
      </Typography>
    </>
  );
}
