import { useState } from 'react';
import {
	Box,
	Typography,
	IconButton,
	TextField,
	Select,
	SelectChangeEvent,
	MenuItem,
	Switch,
} from '@mui/material';
import { RemoveCircle, AddCircle } from '@mui/icons-material';

export default function MatchDayForm({
	defaultValue,
	onMatchDaySelect,
}: {
	defaultValue: string;
	onMatchDaySelect: (matchDay: string) => void;
}): JSX.Element {
	const [matchDay, setMatchDay] = useState<string>(defaultValue);
	const [isPlayoffBet, setIsPlayoffBet] = useState(false);
	const playoffMatchDayList: string[] = ['1/8 финала', '1/4 финала', '1/2 финала', 'Финал'];

	const handleIncrement = (): void => {
		setMatchDay((prevValue) => {
			const newValue = playoffMatchDayList.includes(matchDay)
				? '1'
				: (Number(prevValue) + 1).toString();
			onMatchDaySelect(newValue);
			return newValue;
		});
	};

	const handleDecrement = (): void => {
		setMatchDay((prevValue) => {
			const newValue =
				Number(prevValue) - 1 < 1 || playoffMatchDayList.includes(matchDay)
					? '1'
					: (Number(prevValue) - 1).toString();
			onMatchDaySelect(newValue);
			return newValue;
		});
	};

	const cutMatchDayTitle = (title: string): void => {
		const idx = title.indexOf(' ');
		if (idx === -1) {
			onMatchDaySelect(title);
		} else {
			onMatchDaySelect(title.substring(0, idx));
		}
	};

	const handleMatchDayChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newValue = e.target.value;
		setMatchDay(newValue);
		onMatchDaySelect(newValue);
	};

	const handleMatchDaySelect = (e: SelectChangeEvent): void => {
		const newValue = e.target.value;
		setMatchDay(newValue);
		cutMatchDayTitle(e.target.value);
	};

	const handleIsPlayoffBet = (event: React.ChangeEvent<HTMLInputElement>): void => {
		const flag = event.target.checked;
		setIsPlayoffBet(flag);

		const playoffMappings: Record<string, string> = {
			'4': '1/8 финала',
			'6': '1/8 финала',
			'9': '1/8 финала',
			'10': '1/8 финала',
			'11': '1/4 финала',
			'12': '1/4 финала',
			'13': '1/2 финала',
			'14': '1/2 финала',
			'15': 'Финал',
		};

		const matchDayValue = flag ? playoffMappings[defaultValue] || '1/8 финала' : defaultValue;

		setMatchDay(matchDayValue);
		cutMatchDayTitle(matchDayValue);
	};

	return (
		<Box>
			<Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
				<Typography sx={{ mx: 1, fontWeight: '600' }}>Тур</Typography>
				<Typography sx={{ textAlign: 'left', mx: 0, mt: 0.8, fontWeight: '600' }}>
					Play-off?
					<Switch
						checked={isPlayoffBet}
						onChange={handleIsPlayoffBet}
						inputProps={{ 'aria-label': 'controlled' }}
					/>
				</Typography>
			</Box>
			{!isPlayoffBet ? (
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
			) : (
				<Box>
					<Select
						autoWidth
						size="small"
						sx={{ minWidth: '10rem', mt: 1.5, mb: 0.6 }}
						labelId="playoff-matchday-label"
						id="playoff-matchday-select"
						value={matchDay}
						onChange={handleMatchDaySelect}
					>
						{playoffMatchDayList.map((value) => (
							<MenuItem key={value} sx={{ ml: -0.5, minWidth: '6rem' }} value={value}>
								<div
									style={{
										display: 'flex',
										alignItems: 'center',
									}}
								>
									<Typography sx={{ mx: 1, fontSize: '1rem' }}>{value}</Typography>
								</div>
							</MenuItem>
						))}
					</Select>
				</Box>
			)}
		</Box>
	);
}
