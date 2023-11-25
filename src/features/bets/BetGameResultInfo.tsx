import { Typography } from '@mui/material';

export default function BetGameResultInfo({ gameResult }: { gameResult: string }): JSX.Element {
	return (
		<>
			<Typography component="span" sx={{ textAlign: 'center', borderBottom: 1, pb: 0.3 }}>
				<b>Подтвердить</b>
			</Typography>
			<br />
			<br />
			<Typography
				component="span"
				sx={{
					color:
						gameResult === 'Некорректный счёт матча!' || gameResult === '' ? 'brown' : 'inherit',
					fontWeight: gameResult === 'Некорректный счёт матча!' || gameResult === '' ? 600 : 400,
				}}
			>
				<b>Итоговый счёт - {gameResult || 'Не указан!'}</b>
			</Typography>
		</>
	);
}
