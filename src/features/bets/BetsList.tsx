import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { useAppDispatch } from '../../store';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import BetCard from './BetCard';
import CompleteBetCard from './CompleteBetCard';
import EmptyBetCard from './EmptyBetCard';
import Bet from './types/Bet';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import pathToAvatarImage from '../../components/utils/pathToAvatarImage';

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

  const handleBetsTypeChange = (
    event: React.SyntheticEvent,
    newValue: number
  ): void => {
    setValue(newValue);
    setSelectedLeagueName('Все');
    setSelectedPlayerName('Все');
  };

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch, value]);

  return (
    <Box>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Tabs
            sx={{ mb: 1, mt: -2 }}
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
                pb: 0.5,
              }}
              label="Текущие"
              id={a11yProps(0).id}
              aria-controls={a11yProps(0)['aria-controls']}
            />
            <Tab
              component="span"
              sx={{
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '1rem',
                pb: 0.5,
              }}
              label="Завершенные"
              id={a11yProps(1).id}
              aria-controls={a11yProps(1)['aria-controls']}
            />
          </Tabs>
        </Box>

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
                  src="/upload/avatars/cool_man.jpg"
                />

                <Typography sx={{ mx: 1, fontSize: '1rem' }}>Все</Typography>
              </div>
            </MenuItem>
            {activeSeason &&
              activeSeason.players.map((p) => (
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

        <Box sx={{ mt: -2 }}>
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
                  (() => {
                    const allBets: Bet[] = [];
                    activeSeason.leagues.forEach((l) => {
                      allBets.push(
                        ...l.bets.filter((bet) => bet.betStatus === 'OPENED')
                      );
                    });

                    // Применяем фильтрацию по выбранной лиге
                    const filteredBetsByLeague =
                      selectedLeagueName === 'Все'
                        ? allBets
                        : allBets.filter((bet) => {
                            const league = activeSeason.leagues.find((l) =>
                              l.bets.some((betInLeague) => betInLeague.id === bet.id)
                            );
                            return (
                              league && league.displayNameRu === selectedLeagueName
                            );
                          });

                    // Применяем фильтрацию по выбранному игроку
                    const filteredBetsByPlayer =
                      selectedPlayerName === 'Все'
                        ? filteredBetsByLeague
                        : filteredBetsByLeague.filter(
                            (bet) => bet.player.username === selectedPlayerName
                          );

                    const sortedBets = filteredBetsByPlayer.sort(
                      (betA, betB) =>
                        new Date(betB.createdAt).getTime() -
                        new Date(betA.createdAt).getTime()
                    );

                    return sortedBets.map((bet) => {
                      const league = activeSeason.leagues.find((l) =>
                        l.bets.some((betInLeague) => betInLeague.id === bet.id)
                      );

                      return (
                        <Box key={bet.id}>
                          {league && <BetCard bet={bet} league={league} />}
                        </Box>
                      );
                    });
                  })()}
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

                    // Применяем фильтрацию по выбранной лиге
                    const filteredBetsByLeague =
                      selectedLeagueName === 'Все'
                        ? allBets
                        : allBets.filter((bet) => {
                            const league = activeSeason.leagues.find((l) =>
                              l.bets.some((betInLeague) => betInLeague.id === bet.id)
                            );
                            return (
                              league && league.displayNameRu === selectedLeagueName
                            );
                          });

                    // Применяем фильтрацию по выбранному игроку
                    const filteredBetsByPlayer =
                      selectedPlayerName === 'Все'
                        ? filteredBetsByLeague
                        : filteredBetsByLeague.filter(
                            (bet) => bet.player.username === selectedPlayerName
                          );

                    const sortedBets = filteredBetsByPlayer.sort((betA, betB) => {
                      const dateA = betA.betResultAddedAt
                        ? new Date(betA.betResultAddedAt)
                        : new Date(betA.createdAt);
                      const dateB = betB.betResultAddedAt
                        ? new Date(betB.betResultAddedAt)
                        : new Date(betB.createdAt);
                      return dateB.getTime() - dateA.getTime();
                    });

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
    </Box>
  );
}
