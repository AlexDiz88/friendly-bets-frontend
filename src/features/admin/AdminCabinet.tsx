import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import DatabaseUpdate from '../../components/DatabaseUpdate';
import StatsRecalculating from '../stats/StatsRecalculating';
import SeasonsManagement from './seasons/SeasonsManagement';
import TeamsManagement from './teams/TeamsManagement';

export default function AdminCabinet(): JSX.Element {
	const [isLoading, setIsLoading] = useState(false);

	const handleStartLoading = (): void => setIsLoading(true);
	const handleStopLoading = (): void => setIsLoading(false);

	return (
		<Box sx={{ textAlign: 'center', mx: 2, mb: 10, position: 'relative' }}>
			{isLoading ? (
				<CustomLoading text={t('updateInProgress')} />
			) : (
				<>
					<Typography sx={{ borderBottom: 1, pb: 1 }}>Admin Panel</Typography>

					<SeasonsManagement />
					<TeamsManagement />
					<StatsRecalculating startLoading={handleStartLoading} stopLoading={handleStopLoading} />
					<DatabaseUpdate startLoading={handleStartLoading} stopLoading={handleStopLoading} />
				</>
			)}
		</Box>
	);
}
