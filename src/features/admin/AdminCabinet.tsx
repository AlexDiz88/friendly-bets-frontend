import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import DatabaseUpdate from '../../components/DatabaseUpdate';
import StatsRecalculating from '../stats/StatsRecalculating';
import SeasonsManagement from './seasons/SeasonsManagement';
import TeamsManagement from './teams/TeamsManagement';
import LeagueFormatAssignment from './leagues/LeagueFormatAssignment';
import SeasonDateAssignment from './seasons/SeasonDateAssignment';
import TournamentFormatsManagement from './tournament-formats/TournamentFormatsManagement';
import useFetchCurrentUser from '../../components/hooks/useFetchCurrentUser';
import CustomButton from '../../components/custom/btn/CustomButton';

export default function AdminCabinet(): JSX.Element {
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleStartLoading = (): void => setIsLoading(true);
	const handleStopLoading = (): void => setIsLoading(false);

	useFetchCurrentUser();

	return (
		<Box sx={{ textAlign: 'center', mx: 2, mb: 10, position: 'relative' }}>
			{isLoading ? (
				<CustomLoading text={t('updateInProgress')} />
			) : (
				<>
					<Typography sx={{ borderBottom: 1, pb: 1 }}>Admin Panel</Typography>

					<CustomButton
						sx={{ mt: 1.5, mb: 1 }}
						buttonText={t('externalSyncIssuesTitle')}
						onClick={() => navigate('/admin/external-sync-issues')}
						buttonColor="secondary"
					/>

					<SeasonsManagement />
					<SeasonDateAssignment />
					<TournamentFormatsManagement />
					<LeagueFormatAssignment />
					<TeamsManagement />
					<StatsRecalculating startLoading={handleStartLoading} stopLoading={handleStopLoading} />
					<DatabaseUpdate startLoading={handleStartLoading} stopLoading={handleStopLoading} />
				</>
			)}
		</Box>
	);
}
