import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Dangerous } from '@mui/icons-material';
import BetInputPlayer from './BetInputPlayer';
import BetInputLeague from './BetInputLeague';
import BetInputTeams from './BetInputTeams';
import BetInputOdds from './BetInputOdds';
import BetInputTitle from './BetInputTitle';

export default function BetInputContainer(): JSX.Element {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [selectedMatchDay, setSelectedMatchDay] = useState<string>('');
  const [selectedHomeTeamId, setSelectedHomeTeamId] = useState<string>('');
  const [selectedAwayTeamId, setSelectedAwayTeamId] = useState<string>('');
  const [selectedBetTitle, setSelectedBetTitle] = useState<string>('');
  const [selectedBetOdds, setSelectedBetOdds] = useState<string>('');
  const [selectedBetSize, setSelectedBetSize] = useState<string>('');

  const handleUserSelection = (userId: string): void => {
    setSelectedUserId(userId);
  };

  const handleLeagueSelection = (leagueId: string, matchDay: number): void => {
    setSelectedLeagueId(leagueId);
    setSelectedMatchDay(matchDay.toString());
  };

  const handleHomeTeamSelection = (homeTeamId: string): void => {
    setSelectedHomeTeamId(homeTeamId);
  };

  const handleAwayTeamSelection = (awayTeamId: string): void => {
    setSelectedAwayTeamId(awayTeamId);
  };

  const handleBetCancel = (): void => {
    setSelectedBetTitle('');
  };

  const handleBetTitleSelection = (betTitle: string): void => {
    setSelectedBetTitle(betTitle);
  };

  const handleOddsSelection = (betOdds: string, betSize: string): void => {
    setSelectedBetOdds(betOdds);
    setSelectedBetSize(betSize);
  };

  // TEMP ----------------------------------------- //
  console.log(selectedBetOdds);
  console.log(selectedBetSize);
  // TEMP ----------------------------------------- //

  return (
    <Box sx={{ m: 1 }}>
      <Typography>Bet Input Container</Typography>
      <BetInputPlayer onUserSelect={handleUserSelection} />
      {selectedUserId && <BetInputLeague onLeagueSelect={handleLeagueSelection} />}
      {selectedLeagueId && selectedMatchDay && (
        <BetInputTeams
          onHomeTeamSelect={handleHomeTeamSelection}
          onAwayTeamSelect={handleAwayTeamSelection}
          leagueId={selectedLeagueId}
        />
      )}
      {selectedHomeTeamId && selectedAwayTeamId && !selectedBetTitle && (
        <BetInputTitle onBetTitleSelect={handleBetTitleSelection} />
      )}
      {selectedBetTitle && (
        <Box sx={{ my: 2, width: '18.2rem', display: 'flex' }}>
          <Typography
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '0.85rem',
              width: '17rem',
              height: '2.3rem',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              borderRadius: '4px',
            }}
          >
            {selectedBetTitle}
          </Typography>
          <IconButton onClick={handleBetCancel}>
            <Dangerous
              color="error"
              sx={{ mt: -1.75, ml: -1.5, fontSize: '3rem' }}
            />
          </IconButton>
        </Box>
      )}
      {selectedBetTitle && <BetInputOdds onOddsSelect={handleOddsSelection} />}
    </Box>
  );
}
