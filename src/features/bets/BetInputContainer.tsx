import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import BetInputPlayer from './BetInputPlayer';
import BetInputLeague from './BetInputLeague';
import BetInputTeams from './BetInputTeams';
import BetInputOdds from './BetInputOdds';

export default function BetInputContainer(): JSX.Element {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedLeagueId, setSelectedLeagueId] = useState<string>('');
  const [selectedMatchDay, setSelectedMatchDay] = useState<string>('');
  const [selectedHomeTeamId, setSelectedHomeTeamId] = useState<string>('');
  const [selectedAwayTeamId, setSelectedAwayTeamId] = useState<string>('');
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
      {selectedHomeTeamId && selectedAwayTeamId && (
        <BetInputOdds onOddsSelect={handleOddsSelection} />
      )}
    </Box>
  );
}
