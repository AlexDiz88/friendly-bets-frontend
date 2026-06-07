import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CustomButton from '../../../components/custom/btn/CustomButton';
import AdminSection from '../AdminSection';
import { ADMIN_BUTTON_STACK_SX, ADMIN_FORM_PANEL_SX } from '../adminPanelStyles';
import AddTeamToLeague from './AddTeamToLeague';
import CreateNewTeam from './CreateNewTeam';
import EditTeamPanel from './EditTeamPanel';

export default function TeamsManagement(): JSX.Element {
	const [searchParams] = useSearchParams();
	const openTeamEditFromUrl = searchParams.get('openTeamEdit') === '1';
	const [showAddTeamToLeague, setShowAddTeamToLeague] = useState(false);
	const [showAddNewTeam, setShowAddNewTeam] = useState(false);
	const [showEditTeam, setShowEditTeam] = useState(openTeamEditFromUrl);
	const teamEditRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (openTeamEditFromUrl) {
			setShowEditTeam(true);
			window.requestAnimationFrame(() => {
				teamEditRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			});
		}
	}, [openTeamEditFromUrl]);

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

	const formPanelSx = { ...ADMIN_FORM_PANEL_SX, mb: 0 };

	return (
		<AdminSection title={t('teamManagement')}>
			<Box sx={ADMIN_BUTTON_STACK_SX}>
				<CustomButton
					onClick={() => handleShowAddNewTeam()}
					buttonColor="secondary"
					buttonText={t('newTeam')}
				/>
				{showAddNewTeam && (
					<Box sx={formPanelSx}>
						<CreateNewTeam closeAddNewTeam={closeAddNewTeam} />
					</Box>
				)}

				{!showAddNewTeam && (
					<>
						<CustomButton
							onClick={() => handleShowAddTeamToLeague()}
							buttonColor="info"
							buttonVariant="outlined"
							buttonText={t('addTeamToLeague')}
						/>
						{showAddTeamToLeague && (
							<Box sx={formPanelSx}>
								<AddTeamToLeague closeAddTeamToLeague={closeAddTeamToLeague} />
							</Box>
						)}
					</>
				)}

				<CustomButton
					onClick={() => setShowEditTeam(!showEditTeam)}
					buttonColor="info"
					buttonVariant="outlined"
					buttonText={showEditTeam ? t('hideTeamEditSection') : t('showTeamEditSection')}
				/>
				{showEditTeam && (
					<Box ref={teamEditRef} sx={formPanelSx}>
						<EditTeamPanel />
					</Box>
				)}
			</Box>
		</AdminSection>
	);
}
