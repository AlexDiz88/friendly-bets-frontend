import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Select,
  MenuItem,
  Avatar,
  Typography,
  SelectChangeEvent,
} from '@mui/material';
import pathToAvatarImage from './utils/pathToAvatarImage';
import pathToLogoImage from './utils/pathToLogoImage';
import { selectActiveSeason } from '../features/admin/seasons/selectors';
import { useAppDispatch } from '../store';
import { getActiveSeason } from '../features/admin/seasons/seasonsSlice';

export default function TeamsStatsPage(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const dispatch = useAppDispatch();
  const [selectedLeagueName, setSelectedLeagueName] = useState<string>('Все');
  const [selectedPlayerName, setSelectedPlayerName] = useState<string>('Все');

  const handleLeagueChange = (event: SelectChangeEvent): void => {
    const leagueName = event.target.value;
    setSelectedLeagueName(leagueName);
  };

  const handlePlayerChange = (event: SelectChangeEvent): void => {
    const playerName = event.target.value;
    setSelectedPlayerName(playerName);
  };

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Select
        autoWidth
        size="small"
        sx={{ minWidth: '7rem', ml: -0.2 }}
        labelId="league-title-label"
        id="league-title-select"
        value={selectedLeagueName}
        onChange={handleLeagueChange}
      >
        <MenuItem key="Все" sx={{ ml: -0.5, minWidth: '6.5rem' }} value="Все">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              variant="square"
              sx={{ width: 27, height: 27 }}
              alt="league_logo"
              src={`${process.env.PUBLIC_URL}/upload/logo/total.png`}
            />

            <Typography sx={{ mx: 1, fontSize: '1rem' }}>Все</Typography>
          </div>
        </MenuItem>
        {activeSeason &&
          activeSeason.leagues &&
          activeSeason.leagues.map((l) => (
            <MenuItem
              sx={{ ml: -0.5, minWidth: '6.5rem' }}
              key={l.id}
              value={l.displayNameRu}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Avatar
                  variant="square"
                  sx={{ width: 27, height: 27 }}
                  alt="league_logo"
                  src={pathToLogoImage(l.displayNameEn)}
                />
                <Typography sx={{ mx: 1, fontSize: '1rem' }}>
                  {l.shortNameRu}
                </Typography>
              </div>
            </MenuItem>
          ))}
      </Select>

      <Select
        autoWidth
        size="small"
        sx={{ minWidth: '11.5rem', ml: 0.5 }}
        labelId="player-title-label"
        id="player-title-select"
        value={selectedPlayerName}
        onChange={handlePlayerChange}
      >
        <MenuItem key="Все" sx={{ ml: -0.5, minWidth: '11rem' }} value="Все">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar
              variant="square"
              sx={{ width: 27, height: 27 }}
              alt="league_logo"
              src="/upload/avatars/cool_man.jpg"
            />

            <Typography sx={{ mx: 1, fontSize: '1rem' }}>Все</Typography>
          </div>
        </MenuItem>
        {activeSeason &&
          activeSeason.players
            .slice()
            .sort((a, b) =>
              a.username && b.username ? a.username.localeCompare(b.username) : 0
            )
            .map((p) => (
              <MenuItem
                key={p.id}
                sx={{ ml: -1, minWidth: '6.5rem' }}
                value={p.username}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    sx={{ width: 27, height: 27 }}
                    alt="user_avatar"
                    src={pathToAvatarImage(p.avatar)}
                  />

                  <Typography sx={{ mx: 1, fontSize: '1rem' }}>
                    {p.username}
                  </Typography>
                </div>
              </MenuItem>
            ))}
      </Select>
    </Box>
  );
}
