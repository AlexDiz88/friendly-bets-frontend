import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';

export default function BetInputOdds({
	defaultBetOdds,
	defaultBetSize,
	onOddsSelect,
}: {
	defaultBetOdds: string;
	defaultBetSize: string;
	onOddsSelect: (betOdds: string, betSize: string) => void;
}): JSX.Element {
	const [betOdds, setBetOdds] = useState<string>(defaultBetOdds);
	const [betSize, setBetSize] = useState<string>(defaultBetSize);

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
			<Typography sx={{ ml: 1, mr: 0.5, fontWeight: '600' }}>{t('coef')}</Typography>
			<Box component="form" autoComplete="off" sx={{ width: '5rem', pt: 0 }}>
				<TextField size="small" value={betOdds} onChange={handleBetOdds} />
			</Box>
			<Typography sx={{ ml: 2, mr: 0.5, fontWeight: '600' }}>{t('amount')}</Typography>
			<Box component="form" autoComplete="off" sx={{ width: '3rem', pt: 0 }}>
				<TextField size="small" value={betSize} onChange={handleBetSize} />
			</Box>
		</Box>
	);
}
