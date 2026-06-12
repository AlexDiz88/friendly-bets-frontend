import { Avatar, Box, type SxProps, type Theme } from '@mui/material';
import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import { BET_STATUS_RETURNED, BET_STATUS_WON } from '../../constants';
import BetStatusIcon from '../bets/BetStatusIcon';
import Bet from '../bets/types/Bet';
import {
	gameweekBalanceChangeSx,
	gameweekBetOutcomeRowSx,
	gameweekCardScoreSx,
	gameweekCompactStatusCardSx,
} from './gameweekPageStyles';

const GameweekCompletedCard = ({
	bet,
	onClick,
}: {
	bet: Bet;
	onClick: () => void;
}): JSX.Element => {
	const gameScoreView = getGameScoreView(bet.gameScore, false);

	const index = gameScoreView.indexOf('[');

	let part1 = '';
	let part2 = '';

	if (index !== -1) {
		part1 = gameScoreView.substring(0, index);
		part2 = gameScoreView.substring(index);
	} else {
		part1 = gameScoreView;
	}

	const statusKind =
		bet.betStatus === BET_STATUS_WON ? 'won' : bet.betStatus === BET_STATUS_RETURNED ? 'returned' : 'lost';

	return (
		<Box sx={gameweekCompactStatusCardSx(statusKind)} onClick={onClick}>
			<Box>
				<Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Avatar
						sx={{ width: 30, height: 30 }}
						variant="square"
						alt="team_logo"
						src={pathToLogoImage(bet.homeTeam?.title)}
					/>
					<Box
						sx={
							[
								gameweekCardScoreSx,
								{ fontSize: index === -1 ? '1.1rem' : '0.95rem' },
							] as SxProps<Theme>
						}
					>
						{index === -1 ? (
							<Box>{part1}</Box>
						) : (
							<>
								<Box sx={{ mt: -0 }}>{part1}</Box>
								<Box sx={{ mt: -0.5, mb: -0.4 }}>{part2}</Box>
							</>
						)}
					</Box>
					<Avatar
						sx={{ width: 30, height: 30 }}
						variant="square"
						alt="team_logo"
						src={pathToLogoImage(bet.awayTeam?.title)}
					/>
				</Box>
			</Box>

			<Box sx={gameweekBetOutcomeRowSx}>
				<BetStatusIcon betStatus={bet.betStatus} />
				{bet.balanceChange !== undefined && (
					<Box
						sx={
							[
								gameweekBalanceChangeSx(bet.balanceChange),
								{ fontSize: '1.1rem', lineHeight: 1 },
							] as SxProps<Theme>
						}
					>
						{Number.isInteger(bet.balanceChange) ? bet.balanceChange : bet.balanceChange.toFixed(2)}
						€
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default GameweekCompletedCard;
