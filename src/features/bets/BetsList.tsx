import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { useAppDispatch } from '../../store';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import BetCard from './BetCard';

export default function BetsList(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  return (
    <Box>
      {activeSeason && (
        <Box>
          {activeSeason.leagues.map((l) => (
            <Box key={l.id}>
              {l.bets
                .filter((bet) => bet.betStatus === 'OPENED')
                .map((bet) => (
                  <Box key={bet.id}>
                    <BetCard bet={bet} leagueName={l.displayNameRu} />
                  </Box>
                ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
