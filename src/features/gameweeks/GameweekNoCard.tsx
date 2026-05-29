import PsychologyIcon from '@mui/icons-material/Psychology';
import { Box } from '@mui/material';
import { t } from 'i18next';
import {
	gameweekNoCardContentSx,
	gameweekNoCardSx,
	gameweekNoCardTitleSx,
	gameweekThinkingIconSx,
} from './gameweekPageStyles';

const GameweekNoCard = (): JSX.Element => {
	return (
		<Box sx={gameweekNoCardSx}>
			<Box sx={gameweekNoCardContentSx}>
				<PsychologyIcon sx={gameweekThinkingIconSx} />
				<Box sx={gameweekNoCardTitleSx}>{t('thinkingAboutBet')}</Box>
			</Box>
		</Box>
	);
};

export default GameweekNoCard;
