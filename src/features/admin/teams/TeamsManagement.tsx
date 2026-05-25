import { Box } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import CustomButton from '../../../components/custom/btn/CustomButton';
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
		<Box sx={{ margin: '0 auto', textAlign: 'center', width: 'min(24rem, 100%)', mt: 1.5, px: 1 }}>
			<Box sx={{ borderBottom: 2, pb: 2 }}>
				<Box sx={{ fontSize: 22, fontWeight: 600, mb: 1.5 }}>{t('teamManagement')}</Box>
				<CustomButton
					sx={{ px: 3, mb: 1 }}
					onClick={() => handleShowAddNewTeam()}
					buttonColor="secondary"
					buttonText={t('newTeam')}
				/>
				{showAddNewTeam && (
					<Box>
						<CreateNewTeam closeAddNewTeam={closeAddNewTeam} />
					</Box>
				)}
				{!showAddNewTeam && (
					<Box sx={{ mt: 1 }}>
						<CustomButton
							onClick={() => handleShowAddTeamToLeague()}
							buttonText={t('addTeamToLeague')}
						/>
						{showAddTeamToLeague && (
							<Box>
								<AddTeamToLeague closeAddTeamToLeague={closeAddTeamToLeague} />
							</Box>
						)}
					</Box>
				)}
			</Box>

			<EditTeamPanel />
		</Box>
	);
}
