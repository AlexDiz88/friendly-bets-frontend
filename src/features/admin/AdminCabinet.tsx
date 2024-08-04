import { Box, Typography } from '@mui/material';
import DatabaseUpdate from '../../components/DatabaseUpdate';
import StatsRecalculating from '../stats/StatsRecalculating';
import SeasonsManagement from './seasons/SeasonsManagement';
import TeamsManagement from './teams/TeamsManagement';

export default function AdminCabinet(): JSX.Element {
	return (
		<Box sx={{ textAlign: 'center', mx: 2, mb: 10 }}>
			<Typography sx={{ borderBottom: 1, pb: 1 }}>Admin Panel</Typography>
			<SeasonsManagement />
			<TeamsManagement />
			<StatsRecalculating />
			<DatabaseUpdate />
		</Box>
	);
}
