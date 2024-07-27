import { Typography } from '@mui/material';
import { t } from 'i18next';

export default function BetGameResultInfo({ gameResult }: { gameResult: string }): JSX.Element {
	return (
		<>
			<Typography component="span" sx={{ textAlign: 'center', borderBottom: 1, pb: 0.3 }}>
				<b>{t('acceptBet')}</b>
			</Typography>
			<br />
			<br />
			<Typography
				component="span"
				sx={{
					color: gameResult === t('incorrectGameScore') || gameResult === '' ? 'brown' : 'inherit',
					fontWeight: gameResult === t('incorrectGameScore') || gameResult === '' ? 600 : 400,
				}}
			>
				<b>
					{t('finalScore')} - {gameResult || t('notSpecified')}
				</b>
			</Typography>
		</>
	);
}
