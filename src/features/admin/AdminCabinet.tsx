import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import DatabaseUpdate from '../../components/DatabaseUpdate';
import StatsRecalculating from '../stats/StatsRecalculating';
import useFetchCurrentUser from '../../components/hooks/useFetchCurrentUser';
import AdminGroupHeading from './AdminGroupHeading';
import AdminSection from './AdminSection';
import {
	ADMIN_PAGE_HEADER_SX,
	ADMIN_PAGE_SX,
	ADMIN_PAGE_SUBTITLE_SX,
	ADMIN_PAGE_TITLE_SX,
} from './adminPanelStyles';
import LeagueFormatAssignment from './leagues/LeagueFormatAssignment';
import MatchResultSyncSettingsManagement from './match-result-sync/MatchResultSyncSettingsManagement';
import SeasonDateAssignment from './seasons/SeasonDateAssignment';
import SeasonsManagement from './seasons/SeasonsManagement';
import TeamsManagement from './teams/TeamsManagement';
import TournamentFormatsManagement from './tournament-formats/TournamentFormatsManagement';

export default function AdminCabinet(): JSX.Element {
	const [isLoading, setIsLoading] = useState(false);

	const handleStartLoading = (): void => setIsLoading(true);
	const handleStopLoading = (): void => setIsLoading(false);

	useFetchCurrentUser();

	return (
		<Box sx={{ ...ADMIN_PAGE_SX, position: 'relative' }}>
			{isLoading ? (
				<CustomLoading text={t('updateInProgress')} />
			) : (
				<>
					<Box sx={ADMIN_PAGE_HEADER_SX}>
						<Typography component="h1" sx={ADMIN_PAGE_TITLE_SX}>
							{t('adminPanel')}
						</Typography>
						<Typography sx={ADMIN_PAGE_SUBTITLE_SX}>{t('adminPanelSubtitle')}</Typography>
					</Box>

					<AdminGroupHeading label={t('adminPanelGroupSeasons')} />
					<SeasonsManagement />
					<SeasonDateAssignment />

					<AdminGroupHeading label={t('adminPanelGroupTournament')} />
					<TournamentFormatsManagement />
					<LeagueFormatAssignment />

					<AdminGroupHeading label={t('adminPanelGroupSync')} />
					<MatchResultSyncSettingsManagement />

					<AdminGroupHeading label={t('adminPanelGroupTeams')} />
					<TeamsManagement />

					<AdminGroupHeading label={t('adminPanelGroupMaintenance')} />
					<AdminSection
						title={t('dbManagement')}
						hint={t('adminPanelMaintenanceHint')}
						variant="danger"
					>
						<StatsRecalculating
							startLoading={handleStartLoading}
							stopLoading={handleStopLoading}
						/>
						<DatabaseUpdate startLoading={handleStartLoading} stopLoading={handleStopLoading} />
					</AdminSection>
				</>
			)}
		</Box>
	);
}
