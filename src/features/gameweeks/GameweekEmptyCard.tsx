import { GppMaybe } from '@mui/icons-material';
import { Avatar, Box } from '@mui/material';
import { t } from 'i18next';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import {
	GAMEWEEK_CARD_HEIGHT,
	GAMEWEEK_CARD_MAX_WIDTH,
	GAMEWEEK_CARD_MIN_WIDTH,
} from '../../constants';
import Bet from '../bets/types/Bet';

const GameweekEmptyCard = ({ bet }: { bet: Bet }): JSX.Element => {
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
				bgcolor: '#CDCDCD',
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
			}}
		>
			<Box
				sx={{
					fontSize: '0.85rem',
					fontWeight: 600,
					pl: 0.5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<GppMaybe sx={{ color: '#8f2323' }} />
				{t('betNotPlacedShort')}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<Avatar
						sx={{ mr: 0.5, width: 30, height: 30 }}
						alt="team_logo"
						src={pathToLogoImage(bet.leagueCode)}
					/>
					<Box sx={{ pr: 1, fontWeight: 600, fontSize: '1rem', color: 'brown' }}>
						{bet.balanceChange}€
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default GameweekEmptyCard;
