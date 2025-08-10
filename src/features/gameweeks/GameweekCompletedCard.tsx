import { GppBad, GppGood, RestorePage } from '@mui/icons-material';
import { Avatar, Box } from '@mui/material';
import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import {
	BET_STATUS_RETURNED,
	BET_STATUS_WON,
	GAMEWEEK_CARD_HEIGHT,
	GAMEWEEK_CARD_MAX_WIDTH,
	GAMEWEEK_CARD_MIN_WIDTH,
} from '../../constants';
import Bet from '../bets/types/Bet';

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
				bgcolor:
					bet.betStatus === BET_STATUS_WON
						? '#daf3db'
						: bet.betStatus === BET_STATUS_RETURNED
						? '#f8f9d6'
						: '#f3dada',
				boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 4px 8px rgba(0, 0, 0, 0.7)',
				cursor: 'pointer',
			}}
			onClick={onClick}
		>
			<Box>
				<Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Avatar
						sx={{ width: 30, height: 30 }}
						variant="square"
						alt="team_logo"
						src={pathToLogoImage(bet.homeTeam?.title)}
					/>
					<Box
						sx={{
							px: 0.5,
							pb: 0.3,
							textAlign: 'center',
							fontSize: index === -1 ? '1.1rem' : '0.95rem',
							fontWeight: 600,
						}}
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

			<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
				<Box>
					<Box sx={{ display: 'flex', alignItems: 'center', ml: -1, mt: -0.3 }}>
						{bet.betStatus === BET_STATUS_WON ? (
							<GppGood sx={{ color: 'green', scale: '85%' }} />
						) : bet.betStatus === BET_STATUS_RETURNED ? (
							<RestorePage sx={{ color: '#b89e00' }} />
						) : (
							<GppBad sx={{ color: '#bd0000' }} />
						)}
					</Box>
				</Box>
				{bet.balanceChange !== undefined && (
					<Box
						sx={{
							fontWeight: 600,
							fontSize: '1.1rem',
							color: bet.balanceChange > 0 ? 'green' : bet.balanceChange < 0 ? 'brown' : 'black',
						}}
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
