import React, { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';

export default function BetInputOdds({
  onOddsSelect,
}: {
  onOddsSelect: (betOdds: string, betSize: string) => void;
}): JSX.Element {
  const [betOdds, setBetOdds] = useState<string>('');
  const [betSize, setBetSize] = useState<string>('10');

  const handleBetOdds = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const odds = event.target.value;
    setBetOdds(odds);
    onOddsSelect(odds, betSize);
  };

  const handleBetSize = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const size = event.target.value;
    setBetSize(size);
    onOddsSelect(betOdds, size);
  };

  return (
    <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', textAlign: 'left' }}>
      <Typography sx={{ ml: 1, mr: 0.5, fontWeight: '600' }}>Кэф</Typography>
      <Box component="form" autoComplete="off" sx={{ width: '5rem', pt: 0 }}>
        <TextField size="small" value={betOdds} onChange={handleBetOdds} />
      </Box>
      <Typography sx={{ ml: 2, mr: 0.5, fontWeight: '600' }}>Сумма</Typography>
      <Box component="form" autoComplete="off" sx={{ width: '3rem', pt: 0 }}>
        <TextField size="small" value={betSize} onChange={handleBetSize} />
      </Box>
    </Box>
  );
}
