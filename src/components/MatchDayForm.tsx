import { useState } from 'react';
import { Box, Typography, IconButton, TextField } from '@mui/material';
import { RemoveCircle, AddCircle } from '@mui/icons-material';

export default function MatchDayForm({
	defaultValue,
	onMatchDaySelect,
}: {
	defaultValue: string;
	onMatchDaySelect: (matchDay: string) => void;
}): JSX.Element {
	const [matchDay, setMatchDay] = useState<string>(defaultValue);

	const handleIncrement = (): void => {
		setMatchDay((prevValue) => {
			const newValue = Number(prevValue) + 1;
			onMatchDaySelect(newValue.toString());
			return newValue.toString();
		});
	};

	const handleDecrement = (): void => {
		setMatchDay((prevValue) => {
			const newValue = Number(prevValue) - 1 < 1 ? '1' : (Number(prevValue) - 1).toString();
			onMatchDaySelect(newValue);
			return newValue;
		});
	};

	const handleMatchDayChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newValue = e.target.value;
		setMatchDay(newValue);
		onMatchDaySelect(newValue);
	};

	return (
		<Box>
			<Typography sx={{ mx: 1, fontWeight: '600' }}>Тур</Typography>
			<Box
				component="form"
				autoComplete="off"
				display="flex"
				alignItems="center"
				sx={{ minWidth: '5rem', pt: 0 }}
			>
				<IconButton onClick={handleDecrement}>
					<RemoveCircle color="info" sx={{ fontSize: '2.5rem' }} />
				</IconButton>
				<TextField
					size="small"
					type="number"
					value={matchDay}
					onChange={handleMatchDayChange}
					inputProps={{
						min: 0,
						max: 50,
					}}
				/>
				<IconButton onClick={handleIncrement}>
					<AddCircle color="info" sx={{ fontSize: '2.5rem' }} />
				</IconButton>
			</Box>
		</Box>
	);
}
