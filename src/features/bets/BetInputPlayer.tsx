import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';

export default function BetInputPlayer({
  onUserSelect,
}: {
  onUserSelect: (userId: string) => void;
}): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const players = activeSeason?.players;
  const [selectedUsername, setSelectedUsername] = useState<string>('');

  const handleSeasonChange = (event: SelectChangeEvent): void => {
    const username = event.target.value;
    setSelectedUsername(username);
    const selectedUser = players?.find((player) => player.username === username);
    if (selectedUser) {
      onUserSelect(selectedUser.id);
    }
  };

  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography sx={{ mx: 1, mt: 1, fontWeight: '600' }}>Участник</Typography>
      <Select
        autoWidth
        size="small"
        sx={{ minWidth: '15rem', mb: 1 }}
        labelId="player-username-label"
        id="player-username-select"
        value={selectedUsername}
        onChange={handleSeasonChange}
      >
        {players &&
          players
            .slice()
            .sort((a, b) =>
              a.username && b.username ? a.username.localeCompare(b.username) : 0
            )
            .map((p) => (
              <MenuItem
                sx={{ mx: 0, minWidth: '14.5rem' }}
                key={p.id}
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
                    alt="player_avatar"
                    src={`${process.env.PUBLIC_URL}/upload/logo/${p.avatar?.replace(
                      /\s/g,
                      '_'
                    )}.png`}
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
