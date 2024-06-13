import { Box, Container } from '@mui/material';
import StartSeason2324 from './news/StartSeason2324';
import ScheduleEuro2024 from './news/ScheduleEuro2024';

export default function News(): JSX.Element {
	return (
		<Container>
			<Box
				sx={{
					textAlign: 'center',
					borderBottom: 2,
					mx: 2,
					pb: 1,
					mb: 2,
					fontWeight: 600,
				}}
			>
				Новости сайта
			</Box>
			<ScheduleEuro2024 />
			<StartSeason2324 />
		</Container>
	);
}
