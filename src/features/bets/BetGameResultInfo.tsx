import { Box } from '@mui/material';
import { t } from 'i18next';

export default function BetGameResultInfo({ gameResult }: { gameResult: string }): JSX.Element {
	return (
		<>
			<Box sx={{ textAlign: 'left', borderBottom: 1, pb: 0.3, mb: 1.5 }}>
				<b>{t('acceptBet')}</b>
			</Box>
			<Box
				sx={{
					color: gameResult === t('incorrectGameScore') || gameResult === '' ? 'brown' : 'inherit',
					fontWeight: gameResult === t('incorrectGameScore') || gameResult === '' ? 600 : 400,
				}}
			>
				<b>
					{t('finalScore')} - {gameResult || t('notSpecified')}
				</b>
			</Box>
		</>
	);
}
