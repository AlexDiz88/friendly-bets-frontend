import { Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/ru';
import timezone from 'dayjs/plugin/timezone';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { t } from 'i18next';
import CustomDatePicker from '../../../components/custom/dialog/CustomDatePicker';

dayjs.locale('de');
dayjs.extend(updateLocale);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.updateLocale('de', { weekStart: 1 });

interface DateRangePickerProps {
	onStartDateChange: (date: Dayjs | null) => void;
	onEndDateChange: (date: Dayjs | null) => void;
	startDate: Dayjs | null;
	endDate: Dayjs | null;
	locale?: string;
}

const DateRangePicker = ({
	onStartDateChange,
	onEndDateChange,
	startDate,
	endDate,
	locale = 'de',
}: DateRangePickerProps): JSX.Element => {
	const handleStartDateChange = (newValue: Dayjs | null): void => {
		onStartDateChange(newValue);
	};

	const handleEndDateChange = (newValue: Dayjs | null): void => {
		onEndDateChange(newValue);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
			<Box sx={{ mr: 0.5 }}>
				<CustomDatePicker
					label={t('matchdayStartDate')}
					value={startDate}
					onChange={handleStartDateChange}
					maxDate={endDate ? endDate : undefined}
				/>
			</Box>
			<CustomDatePicker
				label={t('matchdayEndDate')}
				value={endDate}
				onChange={handleEndDateChange}
				minDate={startDate ? startDate : undefined}
			/>
		</LocalizationProvider>
	);
};

export default DateRangePicker;
