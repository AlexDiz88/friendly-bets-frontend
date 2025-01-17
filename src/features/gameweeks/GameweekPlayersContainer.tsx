import { Avatar, Box, Grid } from '@mui/material';
import { useState } from 'react';
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import { BET_STATUS_EMPTY, BET_STATUS_OPENED, COMPLETED_BET_STATUSES } from '../../constants';
import Season from '../admin/seasons/types/Season';
import CompleteBetCard from '../bets/CompleteBetCard';
import EmptyBetCard from '../bets/EmptyBetCard';
import OpenedBetCard from '../bets/OpenedBetCard';
import Bet from '../bets/types/Bet';
import GameweekCompletedCard from './GameweekCompletedCard';
import GameweekEmptyCard from './GameweekEmptyCard';
import GameweekNoCard from './GameweekNoCard';
import GameweekOpenedCard from './GameweekOpenedCard';

const GameweekPlayersContainer = ({
	activeSeason,
	bets,
	gameweekCardsCount,
}: {
	activeSeason: Season;
	bets: Bet[];
	gameweekCardsCount: number;
}): JSX.Element => {
	const [expandedBetId, setExpandedBetId] = useState<string | null>(null);

	const betsByPlayers: { [key: string]: Bet[] } = {};

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

	const countEmptyBets = (playerId: string): number => {
		const totalBets = betsByPlayers[playerId] || [];
		return totalBets.filter((bet) => bet.betStatus === BET_STATUS_EMPTY).length;
	};

	const sortedPlayers = [...activeSeason.players].sort((a, b) => {
		const balanceDifference = calculateTotalBalanceChange(b.id) - calculateTotalBalanceChange(a.id);
		if (balanceDifference !== 0) {
			return balanceDifference;
		}

		const aBetCount = (betsByPlayers[a.id] || []).length;
		const bBetCount = (betsByPlayers[b.id] || []).length;

		if (aBetCount !== bBetCount) {
			return bBetCount - aBetCount;
		}

		const aEmptyBetCount = countEmptyBets(a.id);
		const bEmptyBetCount = countEmptyBets(b.id);

		return aEmptyBetCount - bEmptyBetCount;
	});

	const handleCardClick = (betId: string): void => {
		setExpandedBetId((prevExpandedBetId) => (prevExpandedBetId === betId ? null : betId));
	};

	const handleCloseExpandedCard = (): void => {
		setExpandedBetId(null);
	};

	return (
		<Box sx={{ m: '0 auto', my: 2, maxWidth: '25rem' }}>
			{sortedPlayers.map((player) => (
				<Box
					key={player.id}
					sx={{
						mb: 2,
						p: 0.5,
						border: '2px solid',
						borderRadius: 2,
						bgcolor: '#FFF4E8CE',
						boxShadow: '1px 4px 7px rgba(0, 0, 60, 0.4), 0px 4px 8px rgba(0, 0, 0, 0.7)',
						filter: expandedBetId ? 'blur(0.75px)' : 'none',
					}}
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
							src={avatarBase64Converter(player.avatar)}
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
												<GameweekCompletedCard bet={bet} onClick={() => handleCardClick(bet.id)} />
											)}
											{BET_STATUS_OPENED === bet.betStatus && (
												<GameweekOpenedCard bet={bet} onClick={() => handleCardClick(bet.id)} />
											)}
											{BET_STATUS_EMPTY === bet.betStatus && (
												<GameweekEmptyCard bet={bet} onClick={() => handleCardClick(bet.id)} />
											)}
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
			{/* Слой развернутой карточки */}
			{expandedBetId && (
				<Box
					position="fixed"
					top={0}
					left={0}
					width="100%"
					height="100%"
					display="flex"
					alignItems="center"
					justifyContent="center"
					bgcolor="rgba(0, 0, 0, 0.5)"
					zIndex={10}
					onClick={handleCloseExpandedCard}
				>
					{bets.map((bet) =>
						bet.id === expandedBetId ? (
							<Box
								key={bet.id}
								onClick={(e) => {
									e.stopPropagation();
									handleCloseExpandedCard();
								}}
								style={{
									background: 'white',
									borderRadius: '8px',
									padding: '16px',
									maxWidth: '400px',
									boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
								}}
							>
								{COMPLETED_BET_STATUSES.includes(bet.betStatus) && <CompleteBetCard bet={bet} />}
								{BET_STATUS_OPENED === bet.betStatus && <OpenedBetCard bet={bet} />}
								{BET_STATUS_EMPTY === bet.betStatus && <EmptyBetCard bet={bet} />}
							</Box>
						) : null
					)}
				</Box>
			)}
		</Box>
	);
};

export default GameweekPlayersContainer;
