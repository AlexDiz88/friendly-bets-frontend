import { Box, Container } from '@mui/material';
import { t } from 'i18next';
import ScheduleEuro2024 from './news/ScheduleEuro2024';
import StartSeason2324 from './news/StartSeason2324';
import StartSeason2425 from './news/StartSeason2425';
import StartSeason2526 from './news/StartSeason2526';

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
				{t('websiteNews')}
			</Box>
			<StartSeason2526 />
			<StartSeason2425 />
			<ScheduleEuro2024 />
			<StartSeason2324 />
		</Container>
	);
}
