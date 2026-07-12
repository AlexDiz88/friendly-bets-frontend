import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Tooltip, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import Bet from '../bets/types/Bet';
import {
	gameweekCompactOpenedCardSx,
	gameweekEmptyCardTextSx,
	gameweekHiddenBetBadgeSx,
} from './gameweekPageStyles';

const GameweekHiddenBetCard = ({ bet, onClick }: { bet: Bet; onClick: () => void }): JSX.Element => {
	return (
		<Tooltip title={t('betPlacedHiddenTooltip')}>
			<Box sx={gameweekCompactOpenedCardSx} onClick={onClick}>
				<Box>
					<Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
						<Avatar
							sx={{ width: 30, height: 30 }}
							variant="square"
							alt="team_logo"
							src={pathToLogoImage(bet.homeTeam?.title)}
						/>
						<Box sx={gameweekHiddenBetBadgeSx}>
							<LockOutlinedIcon sx={{ fontSize: '1rem', display: 'block', mx: 'auto' }} />
						</Box>
						<Avatar
							sx={{ width: 30, height: 30 }}
							variant="square"
							alt="team_logo"
							src={pathToLogoImage(bet.awayTeam?.title)}
						/>
					</Box>
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Box sx={gameweekEmptyCardTextSx as SxProps<Theme>}>
						<Box>{t('betPlacedShortLine1')}</Box>
						<Box>{t('betPlacedShortLine2')}</Box>
					</Box>
				</Box>
			</Box>
		</Tooltip>
	);
};

export default GameweekHiddenBetCard;
