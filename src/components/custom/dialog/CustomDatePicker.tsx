import { MobileDatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';

interface DatePickerProps {
	label: string;
	value: Dayjs | null;
	onChange: (date: Dayjs | null) => void;
	minDate?: Dayjs;
	maxDate?: Dayjs;
	inputRef?: React.Ref<HTMLInputElement>;
	/** Высота как у CustomButton (2.25rem), без вертикальных отступов */
	compact?: boolean;
}

const CustomDatePicker = ({
	label,
	value,
	onChange,
	minDate,
	maxDate,
	inputRef,
	compact = false,
}: DatePickerProps): JSX.Element => {
	return (
		<MobileDatePicker
			sx={{ my: compact ? 0 : 1 }}
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
				textField: {
					size: compact ? 'small' : 'medium',
					sx: {
						...(compact && {
							'& .MuiInputBase-root': {
								height: '2.25rem',
							},
							'& input': {
								py: 0,
							},
						}),
						'& input': {
							fontSize: compact ? '0.875rem' : '1.1rem',
							fontWeight: 600,
						},
						'& input::placeholder': {
							fontSize: '0rem',
						},
					},
				},
			}}
		/>
	);
};

export default CustomDatePicker;
