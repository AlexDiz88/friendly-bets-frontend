import { Box } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import CustomButton from '../../../components/custom/btn/CustomButton';
import AdminSection from '../AdminSection';
import { ADMIN_FORM_PANEL_SX } from '../adminPanelStyles';
import AddTeamToLeague from './AddTeamToLeague';
import CreateNewTeam from './CreateNewTeam';
import EditTeamPanel from './EditTeamPanel';

export default function TeamsManagement(): JSX.Element {
	const [showAddTeamToLeague, setShowAddTeamToLeague] = useState(false);
	const [showAddNewTeam, setShowAddNewTeam] = useState(false);

	const handleShowAddNewTeam = (): void => {
		setShowAddNewTeam(!showAddNewTeam);
	};

	const closeAddTeamToLeague = (isClose: boolean): void => {
		setShowAddTeamToLeague(isClose);
	};

	const closeAddNewTeam = (isClose: boolean): void => {
		setShowAddNewTeam(isClose);
	};

	const handleShowAddTeamToLeague = (): void => {
		setShowAddTeamToLeague(!showAddTeamToLeague);
	};

	return (
		<AdminSection title={t('teamManagement')}>
			<CustomButton
				sx={{ width: '100%', mb: showAddNewTeam ? 1.5 : 1 }}
				onClick={() => handleShowAddNewTeam()}
				buttonColor="secondary"
				buttonText={t('newTeam')}
			/>
			{showAddNewTeam && (
				<Box sx={ADMIN_FORM_PANEL_SX}>
					<CreateNewTeam closeAddNewTeam={closeAddNewTeam} />
				</Box>
			)}

			{!showAddNewTeam && (
				<>
					<CustomButton
						sx={{ width: '100%', mb: showAddTeamToLeague ? 1.5 : 0 }}
						onClick={() => handleShowAddTeamToLeague()}
						buttonColor="info"
						buttonVariant="outlined"
						buttonText={t('addTeamToLeague')}
					/>
					{showAddTeamToLeague && (
						<Box sx={ADMIN_FORM_PANEL_SX}>
							<AddTeamToLeague closeAddTeamToLeague={closeAddTeamToLeague} />
						</Box>
					)}
				</>
			)}

			<EditTeamPanel />
		</AdminSection>
	);
}
