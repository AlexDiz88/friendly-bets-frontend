import { Avatar, Box, Button, Typography } from '@mui/material';
import { t } from 'i18next';
import League from '../../../features/admin/leagues/types/League';
import pathToLogoImage from '../../utils/pathToLogoImage';

const CustomLeagueButton = ({
	key,
	league,
	onClick,
}: {
	league: League | undefined;
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
	key?: string;
}): JSX.Element => {
	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				border: '1px solid',
				borderRadius: 2,
				background: 'rgba(122, 180, 255, 0.1)',
				boxShadow: '0 4px 8px rgba(150, 150, 255, 0.3)',
				mx: 0.3,
				width: '5.2rem',
			}}
		>
			<Button sx={{ py: 1.5 }} onClick={onClick}>
				<Avatar
					variant="square"
					sx={{ width: 27, height: 27 }}
					alt="league_logo"
					src={pathToLogoImage(league?.leagueCode)}
				/>
				<Typography
					sx={{
						mx: 1,
						fontSize: '1rem',
						fontWeight: 600,
						fontFamily: "'Exo 2'",
						color: '#123456',
					}}
				>
					{t(`leagueShortName.${league?.leagueCode || ''}`)}
				</Typography>
			</Button>
		</Box>
	);
};

export default CustomLeagueButton;
