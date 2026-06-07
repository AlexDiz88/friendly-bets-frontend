import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { pathToLogoImage } from '../../utils/imgBase64Converter';

/** Светлая подложка под логотип лиги — на тёмной теме тёмные PNG не теряются в фоне UI. */
export const leagueLogoAvatarSx: SxProps<Theme> = (theme) => {
	const isDark = theme.palette.mode === 'dark';
	return {
		...(isDark && {
			bgcolor: 'rgba(232, 236, 244, 0.92)',
			borderRadius: 0.75,
			boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.12)',
			boxSizing: 'border-box',
			p: '2px',
		}),
		'& .MuiAvatar-img': {
			objectFit: 'contain',
		},
	};
};

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
	sx?: SxProps<Theme>;
	avasx?: SxProps<Theme>;
}): JSX.Element => {
	return (
		<Box sx={{ mr: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', ...sx }}>
			<Avatar
				sx={[{ mr: 0.3, height, width: height }, leagueLogoAvatarSx, avasx] as SxProps<Theme>}
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
