import PsychologyIcon from '@mui/icons-material/Psychology';
import { Box } from '@mui/material';
import { t } from 'i18next';
import {
	GAMEWEEK_CARD_HEIGHT,
	GAMEWEEK_CARD_MAX_WIDTH,
	GAMEWEEK_CARD_MIN_WIDTH,
} from '../../constants';

const GameweekNoCard = (): JSX.Element => {
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
				bgcolor: '#E5E5E5',
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
			}}
		>
			<Box
				sx={{
					textAlign: 'center',
					fontSize: '0.85rem',
					fontWeight: 600,
					pl: 0.5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}
			>
				{/* <HelpIcon sx={{ color: '#E76B0C', scale: '120%' }} /> */}
				<PsychologyIcon sx={{ color: '#E76B0C', scale: '170%' }} />
				{t('thinkingAboutBet')}
			</Box>
		</Box>
	);
};

export default GameweekNoCard;
