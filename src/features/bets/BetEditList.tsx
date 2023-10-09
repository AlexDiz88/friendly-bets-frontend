import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import BetCard from './BetCard';
import EmptyBetCard from './EmptyBetCard';
import CompleteBetCard from './CompleteBetCard';
import BetEditButtons from './BetEditButtons';
import { selectUser } from '../auth/selectors';
import Bet from './types/Bet';

export default function BetEditList(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);
	const [showMessage, setShowMessage] = useState(false);
	const season = useAppSelector(selectActiveSeason);

	const scrollToTop = (): void => {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	useEffect(() => {
		dispatch(getActiveSeason());
		scrollToTop();
	}, [dispatch]);

	// редирект неавторизованных пользователей
	useEffect(() => {
		const timer = setTimeout(() => {
			if (!user) {
				navigate('/');
			} else if (user.role !== 'ADMIN' && user.role !== 'MODERATOR') {
				navigate('/');
			}
		}, 3000);
		return () => clearTimeout(timer);
	}, [navigate, user, season]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowMessage(true);
		}, 1500);
		return () => clearTimeout(timer);
	}, []);

	if (!user || (user && user.role !== 'ADMIN' && user.role !== 'MODERATOR')) {
		return (
			<Box
				sx={{
					p: 5,
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '70vh',
				}}
			>
				{showMessage && (
					<Box sx={{ textAlign: 'center', my: 3, fontWeight: 600, color: 'brown' }}>
						Проверка авторизации на доступ к панели модератора
					</Box>
				)}
				<CircularProgress size={100} color="primary" />
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
			}}
		>
			<Box sx={{ borderBottom: 1, textAlign: 'center', mx: 3, pb: 0.5, mb: 1.5 }}>
				Редактирование ставок
			</Box>
			<Box>
				{season &&
					season.leagues &&
					(() => {
						const allBets: Bet[] = [];
						season.leagues.forEach((l) => {
							allBets.push(...l.bets.filter((bet) => bet.betStatus !== 'DELETED'));
						});

						const sortedBets = allBets.sort((betA, betB) => {
							const dateA = betA.updatedAt
								? new Date(betA.updatedAt)
								: betA.betResultAddedAt
								? new Date(betA.betResultAddedAt)
								: new Date(betA.createdAt);
							const dateB = betB.updatedAt
								? new Date(betB.updatedAt)
								: betB.betResultAddedAt
								? new Date(betB.betResultAddedAt)
								: new Date(betB.createdAt);

							return dateB.getTime() - dateA.getTime();
						});

						return sortedBets.map((bet) => {
							const league = season.leagues.find((l) =>
								l.bets.some((betInLeague) => betInLeague.id === bet.id)
							);

							return (
								<Box key={bet.id}>
									{league && bet.betStatus === 'OPENED' ? (
										<>
											<BetCard bet={bet} league={league} />
											<BetEditButtons bet={bet} seasonId={season.id} league={league} />
										</>
									) : (
										<Box>
											{league && bet.betStatus === 'EMPTY' ? (
												<>
													<EmptyBetCard bet={bet} league={league} />
													<BetEditButtons bet={bet} seasonId={season.id} league={league} />
												</>
											) : (
												<Box>
													{league && (
														<>
															<CompleteBetCard bet={bet} league={league} />
															<BetEditButtons bet={bet} seasonId={season.id} league={league} />
														</>
													)}
												</Box>
											)}
										</Box>
									)}
								</Box>
							);
						});
					})()}
			</Box>
			{season &&
				season.leagues.slice().map((league) => (
					<Box key={league.id}>
						{league.bets
							.filter((bet) => bet.betStatus !== 'DELETED')
							.reverse()
							.map((bet) => (
								<Box key={bet.id}>
									{bet.betStatus === 'OPENED' ? (
										<Box>
											<BetCard bet={bet} league={league} />
											<BetEditButtons bet={bet} seasonId={season.id} league={league} />
										</Box>
									) : (
										<Box>
											{bet.betStatus === 'EMPTY' ? (
												<Box>
													<EmptyBetCard bet={bet} league={league} />
													<BetEditButtons bet={bet} seasonId={season.id} league={league} />
												</Box>
											) : (
												<Box>
													<CompleteBetCard bet={bet} league={league} />
													<BetEditButtons bet={bet} seasonId={season.id} league={league} />
												</Box>
											)}
										</Box>
									)}
								</Box>
							))}
					</Box>
				))}
		</Box>
	);
}
