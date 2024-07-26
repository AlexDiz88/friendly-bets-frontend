import { Avatar, Box } from '@mui/material';
import Team from '../features/admin/teams/types/Team';
import pathToLogoImage from './utils/pathToLogoImage';

export default function TeamsInfo({
	homeTeam,
	awayTeam,
}: {
	homeTeam: Team | undefined;
	awayTeam: Team | undefined;
}): JSX.Element {
	return (
		<Box sx={{ fontSize: '0.9rem', mt: 1 }}>
			<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
				<b>Хозяева:</b>
				<Avatar
					component="span"
					variant="square"
					sx={{ px: 0.5, height: 27, width: 'auto' }}
					alt="league_logo"
					src={pathToLogoImage(homeTeam?.title)}
				/>
				{homeTeam?.title} <br />
			</Box>
			<Box component="span" sx={{ display: 'flex', alignItems: 'center' }}>
				<b>Гости:</b>
				<Avatar
					component="span"
					variant="square"
					sx={{ px: 0.5, height: 27, width: 'auto' }}
					alt="league_logo"
					src={pathToLogoImage(awayTeam?.title)}
				/>
				{awayTeam?.title} <br />
			</Box>
		</Box>
	);
}
