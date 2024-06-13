import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
import BetCard from './BetCard';
import EmptyBetCard from './EmptyBetCard';
import CompleteBetCard from './CompleteBetCard';
import BetEditButtons from './BetEditButtons';
import { selectUser } from '../auth/selectors';
import { selectAllBets, selectTotalPages } from './selectors';
import { getAllBets } from './betsSlice';
import SeasonResponseError from '../admin/seasons/types/SeasonResponseError';

export default function BetEditList(): JSX.Element {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const user = useAppSelector(selectUser);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const allBets = useAppSelector(selectAllBets);
	const [showMessage, setShowMessage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);
	const [page, setPage] = useState<number>(1);
	const totalPages = useAppSelector(selectTotalPages);

	const handlePageChange = (pageNumber: number): void => {
		setPage(pageNumber);
	};

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId());
		}
	}, []);

	useEffect(() => {
		setLoading(true);
		if (activeSeasonId) {
			dispatch(getAllBets({ seasonId: activeSeasonId, pageNumber: page - 1 }))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeasonId, page]);

	useEffect(() => {
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId())
				.unwrap()
				.then(() => {
					setLoading(false);
				})
				.catch((error: SeasonResponseError) => {
					if (error.message === 'Сезон со статусом ACTIVE не найден') {
						navigate('/no-active-season');
					} else {
						setLoadingError(true);
					}
					setLoading(false);
				});
		}
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
	}, [navigate, user]);

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

			{loading ? (
				<Box
					sx={{
						height: '70vh',
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
					}}
				>
					<CircularProgress sx={{ mt: 5 }} size={100} color="primary" />
				</Box>
			) : (
				<Box>
					{loadingError ? (
						<Box sx={{ textAlign: 'center', fontWeight: 600, color: 'brown' }}>
							Ошибка загрузки. Попробуйте обновить страницу
						</Box>
					) : (
						<Box>
							<Box>
								{allBets &&
									(() => {
										const sortedBets = [...allBets].sort((betA, betB) => {
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
											return (
												<Box key={bet.id}>
													{bet.betStatus === 'OPENED' ? (
														<>
															<BetCard bet={bet} />
															<BetEditButtons bet={bet} />
														</>
													) : (
														<Box>
															{bet.betStatus === 'EMPTY' ? (
																<>
																	<EmptyBetCard bet={bet} />
																	<BetEditButtons bet={bet} />
																</>
															) : (
																<Box>
																	<CompleteBetCard bet={bet} />
																	<BetEditButtons bet={bet} />
																</Box>
															)}
														</Box>
													)}
												</Box>
											);
										});
									})()}
							</Box>
						</Box>
					)}
					<Stack
						sx={{
							marginTop: 2,
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<Button
							sx={{
								width: 60,
								padding: '10px 50px',
								backgroundColor: '#e2e7fd',
								color: 'black',
							}}
							variant="contained"
							disabled={page === 1}
							onClick={() => handlePageChange(page - 1)}
						>
							<Typography sx={{ fontSize: 20 }}>&lt;</Typography>
						</Button>
						<Button
							sx={{ width: 60, padding: '10px 50px', margin: '0 15px', backgroundColor: '#afafaf' }}
							variant="contained"
							onClick={() => handlePageChange(page)}
						>
							<Typography sx={{ fontSize: 20, fontWeight: 600, fontFamily: 'Exo 2' }}>
								{page}
							</Typography>
						</Button>
						<Button
							sx={{
								width: 60,
								padding: '10px 50px',
								backgroundColor: '#e2e7fd',
								color: 'black',
							}}
							variant="contained"
							disabled={page === totalPages}
							onClick={() => handlePageChange(page + 1)}
						>
							<Typography sx={{ fontSize: 20 }}>&gt;</Typography>
						</Button>
					</Stack>
				</Box>
			)}
		</Box>
	);
}
