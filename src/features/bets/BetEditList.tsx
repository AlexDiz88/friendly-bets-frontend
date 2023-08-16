import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { useAppDispatch } from '../../store';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import BetCard from './BetCard';
import EmptyBetCard from './EmptyBetCard';
import CompleteBetCard from './CompleteBetCard';
import BetEditButton from '../../components/BetEditButton';

export default function BetEditList(): JSX.Element {
  const dispatch = useAppDispatch();
  const season = useSelector(selectActiveSeason);

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  return (
    <Box>
      <Box sx={{ borderBottom: 1, textAlign: 'center', mx: 3, pb: 0.5, mb: 1.5 }}>
        Редактирование ставок
      </Box>
      {season &&
        season.leagues.slice().map((league) => (
          <Box key={league.id}>
            {league.bets
              .filter((bet) => bet.betStatus !== 'DELETED')
              .reverse()
              .map((bet) => (
                <Box key={bet.id}>
                  {bet.betStatus === 'OPENED' ? (
                    <Box>
                      <BetCard bet={bet} league={league} />
                      <BetEditButton bet={bet} />
                    </Box>
                  ) : (
                    <Box>
                      {bet.betStatus === 'EMPTY' ? (
                        <Box>
                          <EmptyBetCard bet={bet} league={league} />
                          <BetEditButton bet={bet} />
                        </Box>
                      ) : (
                        <Box>
                          <CompleteBetCard bet={bet} league={league} />
                          <BetEditButton bet={bet} />
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              ))}
          </Box>
        ))}
    </Box>
  );
}
