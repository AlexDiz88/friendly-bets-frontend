import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Box, Tab, Tabs } from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { useAppDispatch } from '../../store';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import BetCard from './BetCard';
import CompleteBetCard from './CompleteBetCard';
import EmptyBetCard from './EmptyBetCard';
import Bet from './types/Bet';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.defaultProps = {
  children: null,
};

function a11yProps(index: number): { id: string; 'aria-controls': string } {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BetsList(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const dispatch = useAppDispatch();
  const [value, setValue] = useState(0);

  const handleBetsTypeChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
  };

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch, value]);

  return (
    <Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs
            sx={{ my: -1 }}
            value={value}
            onChange={handleBetsTypeChange}
            aria-label="basic tabs example"
          >
            <Tab
              component="span"
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
              }}
              label="Текущие"
              id={a11yProps(0).id}
              aria-controls={a11yProps(0)['aria-controls']}
            />
            <Tab
              component="span"
              sx={{ fontWeight: 600, textTransform: 'none', fontSize: '1rem' }}
              label="Завершенные"
              id={a11yProps(1).id}
              aria-controls={a11yProps(1)['aria-controls']}
            />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box>
              {activeSeason &&
                activeSeason.leagues &&
                activeSeason.leagues.map((l) => (
                  <Box key={l.id}>
                    {l.bets
                      .filter((bet) => bet.betStatus === 'OPENED')
                      .map((bet) => (
                        <Box key={bet.id}>
                          <BetCard bet={bet} league={l} />
                        </Box>
                      ))}
                  </Box>
                ))}
            </Box>
          </Box>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Box>
              {activeSeason &&
                activeSeason.leagues &&
                (() => {
                  // Создаем массив всех ставок из всех лиг
                  const allBets: Bet[] = [];
                  activeSeason.leagues.forEach((l) => {
                    allBets.push(
                      ...l.bets.filter(
                        (bet) =>
                          bet.betStatus === 'WON' ||
                          bet.betStatus === 'RETURNED' ||
                          bet.betStatus === 'LOST' ||
                          bet.betStatus === 'EMPTY'
                      )
                    );
                  });

                  // Сортируем массив всех ставок по дате создания
                  const sortedBets = allBets.sort(
                    (betA, betB) =>
                      new Date(betB.betResultAddedAt).getTime() -
                      new Date(betA.betResultAddedAt).getTime()
                  );

                  return sortedBets.map((bet) => {
                    const league = activeSeason.leagues.find((l) =>
                      l.bets.some((betInLeague) => betInLeague.id === bet.id)
                    );

                    return (
                      <Box key={bet.id}>
                        {league &&
                          (bet.betStatus === 'EMPTY' ? (
                            <EmptyBetCard bet={bet} league={league} />
                          ) : (
                            <CompleteBetCard bet={bet} league={league} />
                          ))}
                      </Box>
                    );
                  });
                })()}
            </Box>
          </Box>
        </CustomTabPanel>
      </Box>
    </Box>
  );
}
