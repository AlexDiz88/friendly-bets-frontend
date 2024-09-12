import { Avatar, Box } from '@mui/material';
import { t } from 'i18next';
import { pathToLogoImage } from '../../utils/imgBase64Converter';

const LeagueAvatar = ({
	leagueCode,
	matchDay,
	height = 27,
	fullName = false,
	sx,
	avasx,
}: {
	leagueCode: string | undefined;
	matchDay?: string;
	height?: number;
	fullName?: boolean;
	sx?: {};
	avasx?: {};
}): JSX.Element => {
	return (
		<Box sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>
			<Avatar
				sx={{ mr: 0.3, height, width: 'auto', ...avasx }}
				variant="square"
				alt="league_logo"
				src={pathToLogoImage(leagueCode)}
			/>
			{fullName
				? t(`leagueFullName.${leagueCode || ''}`)
				: t(`leagueShortName.${leagueCode || ''}`)}
			{matchDay ? `-${matchDay}` : ''}
		</Box>
	);
};

export default LeagueAvatar;
