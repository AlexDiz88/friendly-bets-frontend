import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { selectPlayersStats } from '../features/stats/selectors';
import { useAppDispatch } from '../store';
import { getPlayersStatsBySeason } from '../features/stats/statsSlice';
import { selectActiveSeason } from '../features/admin/seasons/selectors';
import MainTable from './MainTable';

export default function Homepage(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const playersStats = useSelector(selectPlayersStats);
  const dispatch = useAppDispatch();

  const sortedPlayersStats = [...playersStats].sort(
    (a, b) => b.actualBalance - a.actualBalance
  );

  useEffect(() => {
    if (activeSeason) {
      dispatch(getPlayersStatsBySeason(activeSeason.id));
    }
  }, [activeSeason, dispatch]);

  return (
    <Box
      sx={{
        maxWidth: '25rem',
        margin: '0 auto',
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
      }}
    >
      <MainTable playersStats={sortedPlayersStats} />
    </Box>
  );
}
