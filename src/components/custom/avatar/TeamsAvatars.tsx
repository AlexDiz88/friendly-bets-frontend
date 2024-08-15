import { Avatar, Box } from '@mui/material';
import { t } from 'i18next';
import Team from '../../../features/admin/teams/types/Team';
import pathToLogoImage from '../../utils/pathToLogoImage';

const TeamsAvatars = ({
	homeTeam,
	awayTeam,
	height = 27,
}: {
	homeTeam: Team | undefined;
	awayTeam: Team | undefined;
	height?: number;
}): JSX.Element => {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				fontSize: '0.9rem',
			}}
		>
			<Avatar
				sx={{ mr: 0.5, height, width: 'auto' }}
				alt="team_logo"
				src={pathToLogoImage(homeTeam?.title)}
			/>
			{t(`teams:${homeTeam?.title || ''}`)}
			<Avatar
				sx={{ mr: 0.5, ml: 1, height, width: 'auto' }}
				alt="team_logo"
				src={pathToLogoImage(awayTeam?.title)}
			/>
			{t(`teams:${awayTeam?.title || ''}`)}
		</Box>
	);
};

export default TeamsAvatars;