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
				variant="square"
				sx={{ px: 0.5, height, width: height }}
				alt="team_logo"
				src={pathToLogoImage(team?.title)}
			/>
			{t(`teams:${team?.title || ''}`)}
		</Box>
	);
};

export default TeamAvatar;
