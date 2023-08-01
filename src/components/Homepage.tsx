import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { getActiveSeason } from '../features/admin/seasons/seasonsSlice';
import { selectPlayersStats } from '../features/stats/selectors';
import { useAppDispatch } from '../store';
import { getPlayersStatsBySeason } from '../features/stats/statsSlice';
import { selectActiveSeason } from '../features/admin/seasons/selectors';

export default function Homepage(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const playersStats = useSelector(selectPlayersStats);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  useEffect(() => {
    if (activeSeason) {
      dispatch(getPlayersStatsBySeason(activeSeason.id));
    }
  }, [activeSeason, dispatch]);

  return (
    <Box>
      {playersStats.map((pStats) => (
        <Box key={pStats.username}>
          <Box>
            {pStats.username}, {pStats.betCount}, {pStats.wonBetCount},{' '}
            {pStats.returnedBetCount}, {pStats.lostBetCount}, {pStats.emptyBetCount},{' '}
            {pStats.winRate}, {pStats.averageOdds}, {pStats.averageWonBetOdds},{' '}
            {pStats.actualBalance}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
