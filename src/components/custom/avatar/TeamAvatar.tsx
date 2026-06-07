import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Team from '../../../features/admin/teams/types/Team';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../utils/teamDisplay';
import { leagueLogoAvatarSx } from './LeagueAvatar';

const TeamAvatar = ({
	team,
	height = 27,
	sx,
}: {
	team: Team | undefined;
	height?: number;
	sx?: {};
}): JSX.Element => {
	const { t, i18n } = useTranslation();

	return (
		<Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
			<Avatar
				sx={[{ mr: 0.3, height, width: height }, leagueLogoAvatarSx] as SxProps<Theme>}
				variant="square"
				alt="team_logo"
				src={resolveTeamLogoUrl(team)}
			/>
			{resolveTeamDisplayName(team, t, i18n.language)}
		</Box>
	);
};

export default TeamAvatar;
