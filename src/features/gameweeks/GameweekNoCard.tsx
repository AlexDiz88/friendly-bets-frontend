import PsychologyIcon from '@mui/icons-material/Psychology';
import { Box, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import {
	gameweekCompactOpenedCardSx,
	gameweekThinkingIconSx,
	gameweekThinkingLabelSx,
} from './gameweekPageStyles';

const GameweekNoCard = (): JSX.Element => {
	return (
		<Box sx={[gameweekCompactOpenedCardSx, { cursor: 'default' }] as SxProps<Theme>}>
			<Box
				sx={{
					pl: 0.5,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'column',
				}}
			>
				<PsychologyIcon sx={gameweekThinkingIconSx} />
				<Box component="span" sx={gameweekThinkingLabelSx}>
					{t('thinkingAboutBet')}
				</Box>
			</Box>
		</Box>
	);
};

export default GameweekNoCard;
