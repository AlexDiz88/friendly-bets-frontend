import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Team from '../../../features/admin/teams/types/Team';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../utils/teamDisplay';
import { leagueLogoAvatarSx } from './LeagueAvatar';

const TeamsAvatars = ({
	homeTeam,
	awayTeam,
	height = 27,
	sx,
}: {
	homeTeam: Team | undefined;
	awayTeam: Team | undefined;
	height?: number;
	sx?: SxProps<Theme>;
}): JSX.Element => {
	const { t, i18n } = useTranslation();

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: '0.9rem',
				...sx,
			}}
		>
			<Avatar
				sx={[{ mr: 0.3, height, width: height }, leagueLogoAvatarSx] as SxProps<Theme>}
				variant="square"
				alt="team_logo"
				src={resolveTeamLogoUrl(homeTeam)}
			/>
			{resolveTeamDisplayName(homeTeam, t, i18n.language)}
			<Avatar
				sx={[{ mr: 0.3, ml: 1, height, width: height }, leagueLogoAvatarSx] as SxProps<Theme>}
				variant="square"
				alt="team_logo"
				src={resolveTeamLogoUrl(awayTeam)}
			/>
			{resolveTeamDisplayName(awayTeam, t, i18n.language)}
		</Box>
	);
};

export default TeamsAvatars;
