import { MobileDatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

interface DatePickerProps {
	label: string;
	value: Dayjs | null;
	onChange: (date: Dayjs | null) => void;
	minDate?: Dayjs;
	maxDate?: Dayjs;
	inputRef?: React.Ref<HTMLInputElement>;
}

const CustomDatePicker = ({
	label,
	value,
	onChange,
	minDate,
	maxDate,
	inputRef,
}: DatePickerProps): JSX.Element => {
	return (
		<MobileDatePicker
			sx={{ my: 1 }}
			label={label}
			inputRef={inputRef}
			format="DD.MM.YYYY"
			value={value}
			minDate={minDate}
			maxDate={maxDate}
			onChange={onChange}
			closeOnSelect
			views={['day']}
			showDaysOutsideCurrentMonth
			dayOfWeekFormatter={(weekday) => `${weekday.format('ddd')}.`}
			slotProps={{
				toolbar: { hidden: true },
				actionBar: { actions: [] },
				day: {
					sx: {
						fontSize: '1.1rem',
						fontWeight: 600,
						fontFamily: "'Exo 2'",
					},
				},
			}}
		/>
	);
};

export default CustomDatePicker;
