import { Avatar, Box } from '@mui/material';
import pathToLogoImage from '../../components/utils/pathToLogoImage';
import {
	GAMEWEEK_CARD_HEIGHT,
	GAMEWEEK_CARD_MAX_WIDTH,
	GAMEWEEK_CARD_MIN_WIDTH,
} from '../../constants';
import Bet from '../bets/types/Bet';

const GameweekOpenedCard = ({ bet }: { bet: Bet }): JSX.Element => {
	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
				minWidth: GAMEWEEK_CARD_MIN_WIDTH,
				maxWidth: GAMEWEEK_CARD_MAX_WIDTH,
				height: GAMEWEEK_CARD_HEIGHT,
				border: 2,
				mx: 0.5,
				mb: 0.5,
				p: 0.3,
				borderRadius: 2,
				bgcolor: 'whitesmoke',
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
			}}
		>
			<Box>
				<Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Avatar
						sx={{ width: 30, height: 30 }}
						alt="team_logo"
						src={pathToLogoImage(bet.homeTeam.title)}
					/>
					<Box
						sx={{
							px: 0.3,
							py: 0.2,
							mx: 0.3,
							textAlign: 'center',
							fontSize: '1rem',
							fontWeight: 600,
							lineHeight: 0.8,
							bgcolor: '#EAF5CD',
							border: '1px solid',
						}}
					>
						{bet.betOdds.toFixed(2)}
					</Box>
					<Avatar
						sx={{ width: 30, height: 30 }}
						alt="team_logo"
						src={pathToLogoImage(bet.awayTeam.title)}
					/>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				{bet.balanceChange !== undefined && (
					<Box
						sx={{
							textAlign: 'center',
							fontWeight: 600,
							fontSize: bet.betTitle.length > 16 ? '0.8rem' : '1.1rem',
							lineHeight: bet.betTitle.length > 16 ? 0.8 : 1,
							pb: 0.5,
							pt: 0.1,
						}}
					>
						{bet.betTitle}
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default GameweekOpenedCard;
