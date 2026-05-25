import { Box, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Calendar from '../admin/calendars/types/Calendar';
import GameweekCalendarOption from './GameweekCalendarOption';

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
			sx={{
				'& .MuiOutlinedInput-root': {
					borderRadius: 2,
				},
				'& .MuiOutlinedInput-notchedOutline': {
					borderColor: '#123456DB',
					borderRadius: 2,
				},
				'&:hover .MuiOutlinedInput-notchedOutline': {
					borderColor: '#123456DB',
				},
				'&.Mui-focused .MuiOutlinedInput-notchedOutline': {
					borderWidth: '1px',
					borderColor: '#123456DB',
					borderRadius: 2,
				},
				'& .MuiSelect-select': {
					py: 0.5,
					px: 1,
				},
			}}
			MenuProps={{
				PaperProps: {
					sx: {
						maxHeight: 360,
						'& .MuiMenuItem-root:not(:last-of-type)': {
							borderBottom: '1px solid rgba(18, 52, 86, 0.2)',
						},
					},
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
