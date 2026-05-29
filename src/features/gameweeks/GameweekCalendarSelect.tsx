import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Calendar from '../admin/calendars/types/Calendar';
import GameweekCalendarOption from './GameweekCalendarOption';
import { gameweekCalendarMenuPaperSx, gameweekCalendarSelectSx } from './gameweekPageStyles';

type GameweekCalendarSelectProps = {
	calendars: Calendar[];
	value: string;
	onChange: (nodeId: string) => void;
};

export default function GameweekCalendarSelect({
	calendars,
	value,
	onChange,
}: GameweekCalendarSelectProps): JSX.Element {
	const handleChange = (event: SelectChangeEvent<string>): void => {
		onChange(event.target.value);
	};

	const selected = calendars.find((c) => c.id === value);

	return (
		<Select
			fullWidth
			size="small"
			value={value}
			onChange={handleChange}
			displayEmpty
			renderValue={() =>
				selected ? (
					<Box sx={{ py: 0.25 }}>
						<GameweekCalendarOption calendar={selected} />
					</Box>
				) : (
					''
				)
			}
			sx={gameweekCalendarSelectSx}
			MenuProps={{
				PaperProps: {
					sx: gameweekCalendarMenuPaperSx,
				},
			}}
		>
			{calendars.map((calendar) => (
				<MenuItem key={calendar.id} value={calendar.id} sx={{ py: 0.75 }}>
					<GameweekCalendarOption calendar={calendar} />
				</MenuItem>
			))}
		</Select>
	);
}
