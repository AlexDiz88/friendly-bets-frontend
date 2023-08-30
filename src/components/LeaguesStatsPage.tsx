import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { selectPlayersStatsByLeagues } from '../features/stats/selectors';
import { useAppDispatch } from '../store';
import { getPlayersStatsByLeagues } from '../features/stats/statsSlice';
import { selectActiveSeason } from '../features/admin/seasons/selectors';
import { getActiveSeason } from '../features/admin/seasons/seasonsSlice';
import LeagueStats from '../features/stats/types/LeagueStats';
import pathToLogoImage from './utils/pathToLogoImage';
import StatsTable from './StatsTable';

export default function LeaguesStatsPage(): JSX.Element {
  const activeSeason = useSelector(selectActiveSeason);
  const statsByLeagues: LeagueStats[] = useSelector(selectPlayersStatsByLeagues);
  const dispatch = useAppDispatch();
  const [selectedLeague, setSelectedLeague] = useState<LeagueStats | undefined>(
    undefined
  );
  const [selectedLeagueName, setSelectedLeagueName] =
    useState<string>('Выберите лигу');
  const [loading, setLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(false);

  const sortedPlayersStats = selectedLeague
    ? [...selectedLeague.playersStats].sort(
        (a, b) => b.actualBalance - a.actualBalance
      )
    : [];

  const handleLeagueChange = (event: SelectChangeEvent): void => {
    const leagueName = event.target.value;
    const league = statsByLeagues.find((l) => l.league.displayNameRu === leagueName);
    setSelectedLeagueName(leagueName);
    setSelectedLeague(league || undefined);
  };

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  useEffect(() => {
    if (activeSeason) {
      dispatch(getPlayersStatsByLeagues(activeSeason.id))
        .then(() => {
          setLoading(false);
        })
        .catch(() => {
          setLoadingError(true);
          setLoading(false);
        });
    }
  }, [activeSeason, dispatch]);

  return (
    <Box>
      {loading ? (
        <Box
          sx={{
            height: '70vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>
            Подождите идёт загрузка данных
          </Box>
          <CircularProgress sx={{ mt: 5 }} size={100} color="primary" />
        </Box>
      ) : (
        <Box>
          {loadingError ? (
            <Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>
              Ошибка загрузки. Попробуйте обновить страницу
            </Box>
          ) : (
            <Box
              sx={{
                maxWidth: '25rem',
                margin: '0 auto',
                mt: -1.5,
                pt: 0,
                boxShadow:
                  '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
              }}
            >
              <Box
                sx={{
                  p: 1,
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                Выберите лигу для просмотра детальной статистики по ней
              </Box>
              <Select
                size="small"
                sx={{ minWidth: '12rem', mx: 1, mb: 1 }}
                labelId="league-stats-label"
                id="league-stats-select"
                value={selectedLeagueName}
                onChange={handleLeagueChange}
              >
                {statsByLeagues.map((stats) => (
                  <MenuItem
                    key={stats.league.displayNameRu}
                    value={stats.league.displayNameRu}
                    sx={{ ml: -0.5, minWidth: '11rem' }}
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
                        src={pathToLogoImage(stats.league.displayNameEn)}
                      />
                      <Typography sx={{ mx: 1, fontSize: '1rem' }}>
                        {stats.league.displayNameRu}
                      </Typography>
                    </div>
                  </MenuItem>
                ))}
              </Select>
              <StatsTable playersStats={sortedPlayersStats} />
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
