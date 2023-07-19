import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { useAppDispatch } from '../../store';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';

export default function BetInputPlayer(): JSX.Element {
  const dispatch = useAppDispatch();
  const activeSeason = useSelector(selectActiveSeason);
  const players = activeSeason?.players;
  const [selectedSeasonTitle, setSelectedSeasonTitle] = useState<string>('');

  const handleSeasonChange = (event: SelectChangeEvent): void => {
    setSelectedSeasonTitle(event.target.value);
  };

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  return (
    <Box>
      <Select
        fullWidth
        size="small"
        sx={{ my: 1 }}
        labelId="season-title-label"
        id="season-title-select"
        value={selectedSeasonTitle}
        onChange={handleSeasonChange}
      >
        {players?.map((p) => (
          <MenuItem key={p.id} value={p.username}>
            {p.username}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
