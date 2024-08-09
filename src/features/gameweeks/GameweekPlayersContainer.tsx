import { Avatar, Box, Grid } from '@mui/material';
import pathToAvatarImage from '../../components/utils/pathToAvatarImage';
import { BET_STATUS_EMPTY, BET_STATUS_OPENED, COMPLETED_BET_STATUSES } from '../../constants';
import Season from '../admin/seasons/types/Season';
import Bet from '../bets/types/Bet';
import GameweekCompletedCard from './GameweekCompletedCard';
import GameweekEmptyCard from './GameweekEmptyCard';
import GameweekNoCard from './GameweekNoCard';
import GameweekOpenedCard from './GameweekOpenedCard';

const GameweekPlayersContainer = ({
	activeSeason,
	bets,
	gameweekLeaguesCount,
}: {
	activeSeason: Season;
	bets: Bet[];
	gameweekLeaguesCount: number;
}): JSX.Element => {
	const betsByPlayers: { [key: string]: Bet[] } = {};
	const gameweekCardsCount = activeSeason.betCountPerMatchDay * gameweekLeaguesCount;

	activeSeason.players.forEach((player) => {
		betsByPlayers[player.id] = [];
	});

	bets.forEach((bet) => {
		if (betsByPlayers[bet.player.id]) {
			betsByPlayers[bet.player.id].push(bet);
		}
	});

	const calculateTotalBalanceChange = (playerId: string): number => {
		const playerBets = betsByPlayers[playerId] || [];
		return playerBets.reduce((total, bet) => total + (bet.balanceChange || 0), 0);
	};

	const sortedPlayers = [...activeSeason.players].sort(
		(a, b) => calculateTotalBalanceChange(b.id) - calculateTotalBalanceChange(a.id)
	);

	return (
		<Box sx={{ m: '0 aut', my: 2, maxWidth: '25rem' }}>
			{sortedPlayers.map((player) => (
				<Box
					key={player.id}
					sx={{ mb: 2, p: 0.5, border: '2px solid', borderRadius: 2, bgcolor: '#FFF4E8CE' }}
				>
					<Box sx={{ mb: 0.8, ml: 0.5, display: 'flex', alignItems: 'center', fontWeight: 600 }}>
						<Box
							sx={{
								mr: 1,
								fontSize: '1.25rem',
								color:
									calculateTotalBalanceChange(player.id) > 0
										? 'green'
										: calculateTotalBalanceChange(player.id) < 0
										? 'brown'
										: 'black',
							}}
						>
							{calculateTotalBalanceChange(player.id).toFixed(2)}€
						</Box>
						<Avatar
							sx={{ mr: 0.5, width: 30, height: 30, border: 1, borderColor: 'gray' }}
							alt="user_avatar"
							src={pathToAvatarImage(player.avatar)}
						/>
						{player.username}
					</Box>
					<Grid container spacing={1}>
						{Array.from({ length: gameweekCardsCount }).map((_, index) => {
							const bet = betsByPlayers[player.id][index];
							return (
								<Grid item xs={6} sm={6} key={bet ? bet.id : `empty-${player.id}-${index}`}>
									{bet && bet.betStatus ? (
										<>
											{COMPLETED_BET_STATUSES.includes(bet.betStatus) && (
												<GameweekCompletedCard bet={bet} />
											)}
											{BET_STATUS_OPENED === bet.betStatus && <GameweekOpenedCard bet={bet} />}
											{BET_STATUS_EMPTY === bet.betStatus && <GameweekEmptyCard bet={bet} />}
										</>
									) : (
										<GameweekNoCard />
									)}
								</Grid>
							);
						})}
					</Grid>
				</Box>
			))}
		</Box>
	);
};

export default GameweekPlayersContainer;
