import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { useAppDispatch } from '../../store';

export default function BetInputLeague({
  onLeagueSelect,
}: {
  onLeagueSelect: (leagueId: string, matchDay: number) => void;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const activeSeason = useSelector(selectActiveSeason);
  const leagues = activeSeason?.leagues;
  const [selectedLeagueName, setSelectedLeagueName] = useState<string>('');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [matchDay, setMatchDay] = useState<number>(1);

  const handleSeasonChange = (event: SelectChangeEvent): void => {
    const league = event.target.value;
    setSelectedLeagueName(league);
    const selectedLeague = leagues?.find((l) => l.displayNameRu === league);
    if (selectedLeague) {
      setSelectedLeagueId(selectedLeague.id);
      onLeagueSelect(selectedLeague.id, matchDay);
    }
  };

  const handleIncrement = (): void => {
    setMatchDay((prevValue) => {
      const newValue = prevValue + 1;
      onLeagueSelect(selectedLeagueId, newValue);
      return newValue;
    });
  };

  const handleDecrement = (): void => {
    setMatchDay((prevValue) => {
      const newValue = prevValue - 1 < 1 ? prevValue : prevValue - 1;
      onLeagueSelect(selectedLeagueId, newValue);
      return newValue;
    });
  };

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  return (
    <Box sx={{ textAlign: 'left' }}>
      <Typography sx={{ mx: 1, fontWeight: '600' }}>Лига</Typography>
      <Select
        autoWidth
        size="small"
        sx={{ minWidth: '15rem', mb: 1 }}
        labelId="season-title-label"
        id="season-title-select"
        value={selectedLeagueName}
        onChange={handleSeasonChange}
      >
        {leagues &&
          leagues.map((l) => (
            <MenuItem
              sx={{ mx: 0, minWidth: '14.5rem' }}
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
                  sx={{ width: 27, height: 27 }}
                  alt="league_logo"
                  src={`${
                    process.env.PUBLIC_URL
                  }/upload/logo/${l.displayNameEn?.replace(/\s/g, '_')}.png`}
                />

                <Typography sx={{ mx: 1, fontSize: '1rem' }}>
                  {l.displayNameRu}
                </Typography>
              </div>
            </MenuItem>
          ))}
      </Select>
      <Typography sx={{ mx: 1, fontWeight: '600' }}>Тур</Typography>
      <Box
        component="form"
        autoComplete="off"
        display="flex"
        alignItems="center"
        sx={{ minWidth: '5rem', pt: 0 }}
      >
        <IconButton onClick={handleDecrement}>
          <RemoveCircle color="info" sx={{ fontSize: '2.5rem' }} />
        </IconButton>
        <TextField
          size="small"
          type="number"
          value={matchDay}
          onChange={(e) => setMatchDay(Number(e.target.value))}
          inputProps={{
            min: 0,
            max: 50,
          }}
        />
        <IconButton onClick={handleIncrement}>
          <AddCircle color="info" sx={{ fontSize: '2.5rem' }} />
        </IconButton>
      </Box>
    </Box>
  );
}
