import { Avatar, Box } from '@mui/material';
import { t } from 'i18next';
import Team from '../../../features/admin/teams/types/Team';
import { pathToLogoImage } from '../../utils/imgBase64Converter';

const TeamAvatar = ({
	team,
	height = 27,
	sx,
}: {
	team: Team | undefined;
	height?: number;
	sx?: {};
}): JSX.Element => {
	return (
		<Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
			<Avatar
				sx={{ mr: 0.3, height, width: height }}
				variant="square"
				alt="team_logo"
				src={pathToLogoImage(team?.title)}
			/>
			{t(`teams:${team?.title || ''}`)}
		</Box>
	);
};

export default TeamAvatar;
