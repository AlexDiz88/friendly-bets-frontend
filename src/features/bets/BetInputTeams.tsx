import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Avatar,
  Box,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { useAppDispatch } from '../../store';
import { selectActiveSeason } from '../admin/seasons/selectors';

export default function BetInputPlayer({
  onHomeTeamSelect,
  onAwayTeamSelect,
  leagueId,
  resetTeams,
}: {
  onHomeTeamSelect: (homeTeamId: string) => void;
  onAwayTeamSelect: (awayTeamId: string) => void;
  leagueId: string;
  resetTeams: boolean;
}): JSX.Element {
  const dispatch = useAppDispatch();
  const activeSeason = useSelector(selectActiveSeason);
  const leagues = activeSeason?.leagues;
  const league = leagues?.find((l) => l.id === leagueId);
  const [selectedHomeTeamName, setSelectedHomeTeamName] = useState<string>('');
  const [selectedAwayTeamName, setSelectedAwayTeamName] = useState<string>('');

  const handleHomeTeamChange = (event: SelectChangeEvent): void => {
    const teamName = event.target.value;
    setSelectedHomeTeamName(teamName);
    const selectedLeague = leagues?.find((l) => l.id === leagueId);
    if (selectedLeague) {
      const selectedTeam = selectedLeague.teams.find(
        (team) => team.fullTitleRu === teamName
      );
      if (selectedTeam) {
        onHomeTeamSelect(selectedTeam.id);
      }
    }
  };

  const handleAwayTeamChange = (event: SelectChangeEvent): void => {
    const teamName = event.target.value;
    setSelectedAwayTeamName(teamName);
    const selectedLeague = leagues?.find((l) => l.id === leagueId);
    if (selectedLeague) {
      const selectedTeam = selectedLeague.teams.find(
        (team) => team.fullTitleRu === teamName
      );
      if (selectedTeam) {
        onAwayTeamSelect(selectedTeam.id);
      }
    }
  };

  useEffect(() => {
    setSelectedHomeTeamName('');
    setSelectedAwayTeamName('');
    onHomeTeamSelect('');
    onAwayTeamSelect('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leagueId, resetTeams]);

  useEffect(() => {
    dispatch(getActiveSeason());
  }, [dispatch]);

  return (
    <>
      <Box sx={{ textAlign: 'left' }}>
        <Typography sx={{ mx: 1, fontWeight: '600' }}>Хозяева</Typography>
        <Select
          autoWidth
          size="small"
          sx={{ minWidth: '15rem', mb: 1 }}
          labelId="home-team-name-label"
          id="home-team-name-select"
          value={selectedHomeTeamName}
          onChange={handleHomeTeamChange}
        >
          {league &&
            league.teams
              .slice()
              .sort((a, b) =>
                a.fullTitleRu && b.fullTitleRu
                  ? a.fullTitleRu.localeCompare(b.fullTitleRu)
                  : 0
              )
              .map((t) => (
                <MenuItem
                  sx={{ mx: 0, minWidth: '14.5rem' }}
                  key={t.id}
                  value={t.fullTitleRu}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      sx={{ width: 27, height: 27 }}
                      alt="team_logo"
                      src={`/upload/logo/${t.fullTitleEn?.replace(/\s/g, '_')}.png`}
                    />

                    <Typography sx={{ mx: 1, fontSize: '1rem' }}>
                      {t.fullTitleRu}
                    </Typography>
                  </div>
                </MenuItem>
              ))}
        </Select>
      </Box>
      <Box sx={{ textAlign: 'left' }}>
        <Typography sx={{ mx: 1, fontWeight: '600' }}>Гости</Typography>
        <Select
          autoWidth
          size="small"
          sx={{ minWidth: '15rem', mb: 1 }}
          labelId="away-team-name-label"
          id="away-team-name-select"
          value={selectedAwayTeamName}
          onChange={handleAwayTeamChange}
        >
          {league &&
            league.teams
              .slice()
              .sort((a, b) =>
                a.fullTitleRu && b.fullTitleRu
                  ? a.fullTitleRu.localeCompare(b.fullTitleRu)
                  : 0
              )
              .map((t) => (
                <MenuItem
                  sx={{ mx: 0, minWidth: '14.5rem' }}
                  key={t.id}
                  value={t.fullTitleRu}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Avatar
                      sx={{ width: 27, height: 27 }}
                      alt="team_logo"
                      src={`${
                        process.env.PUBLIC_URL
                      }/upload/logo/${t.fullTitleEn?.replace(/\s/g, '_')}.png`}
                    />

                    <Typography sx={{ mx: 1, fontSize: '1rem' }}>
                      {t.fullTitleRu}
                    </Typography>
                  </div>
                </MenuItem>
              ))}
        </Select>
      </Box>
    </>
  );
}
