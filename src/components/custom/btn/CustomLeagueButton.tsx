import { Box, Button } from '@mui/material';
import League from '../../../features/admin/leagues/types/League';
import LeagueAvatar from '../avatar/LeagueAvatar';

const CustomLeagueButton = ({
	league,
	onClick,
}: {
	league: League | undefined;
	onClick(event: React.MouseEvent<HTMLButtonElement>): void;
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
				<LeagueAvatar
					leagueCode={league?.leagueCode}
					sx={{ mx: 1, fontSize: '1rem', fontWeight: 600, fontFamily: "'Exo 2'", color: '#123456' }}
				/>
			</Button>
		</Box>
	);
};

export default CustomLeagueButton;
