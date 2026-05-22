import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { FALLBACK_DEFAULT_BET_SIZE } from './betSizeDefaults';

export default function BetInputOdds({
	defaultBetOdds = '',
	defaultBetSize = String(FALLBACK_DEFAULT_BET_SIZE),
	onOddsSelect,
}: {
	defaultBetOdds?: string;
	defaultBetSize?: string;
	onOddsSelect: (betOdds: string, betSize: string) => void;
}): JSX.Element {
	const [betOdds, setBetOdds] = useState<string>(defaultBetOdds);

	const handleBetOdds = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const odds = event.target.value;
		setBetOdds(odds);
		onOddsSelect(odds, defaultBetSize);
	};

	const handleBetSize = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const size = event.target.value;
		onOddsSelect(betOdds, size);
	};

	return (
		<Box sx={{ mt: 2, display: 'flex', alignItems: 'center', textAlign: 'left' }}>
			<Typography sx={{ ml: 1, mr: 0.5, fontWeight: '600' }}>{t('coef')}</Typography>
			<Box component="form" autoComplete="off" sx={{ width: '5rem', pt: 0 }}>
				<TextField size="small" value={betOdds} onChange={handleBetOdds} />
			</Box>
			<Typography sx={{ ml: 2, mr: 0.5, fontWeight: '600' }}>{t('amount')}</Typography>
			<Box component="form" autoComplete="off" sx={{ width: '3rem', pt: 0 }}>
				<TextField size="small" value={defaultBetSize} onChange={handleBetSize} />
			</Box>
		</Box>
	);
}
