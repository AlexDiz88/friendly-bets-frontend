import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import Bet from '../bets/types/Bet';
import {
	gameweekCardBetTitleSx,
	gameweekCompactOpenedCardSx,
	gameweekOddsBadgeSx,
} from './gameweekPageStyles';

const GameweekOpenedCard = ({ bet, onClick }: { bet: Bet; onClick: () => void }): JSX.Element => {
	const titleLen = bet.betTitle?.label.length || 0;

	return (
		<Box sx={gameweekCompactOpenedCardSx} onClick={onClick}>
			<Box>
				<Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Avatar
						sx={{ width: 30, height: 30 }}
						variant="square"
						alt="team_logo"
						src={pathToLogoImage(bet.homeTeam?.title)}
					/>
					<Box sx={gameweekOddsBadgeSx}>{bet.betOdds?.toFixed(2)}</Box>
					<Avatar
						sx={{ width: 30, height: 30 }}
						variant="square"
						alt="team_logo"
						src={pathToLogoImage(bet.awayTeam?.title)}
					/>
				</Box>
			</Box>

			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				{bet.balanceChange !== undefined && (
					<Box
						sx={
							[
								gameweekCardBetTitleSx,
								{
									fontSize: titleLen > 16 ? '0.8rem' : '1.1rem',
									lineHeight: titleLen > 16 ? 0.8 : 1,
									pb: 0.5,
									pt: 0.1,
								},
							] as SxProps<Theme>
						}
					>
						{getFullBetTitle(bet.betTitle)}
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default GameweekOpenedCard;
