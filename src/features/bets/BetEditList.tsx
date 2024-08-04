import { Box } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButtonGroupPagination from '../../components/custom/btn/CustomButtonGroupPagination';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import { getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
import BetCard from './BetCard';
import BetEditButtons from './BetEditButtons';
import { getAllBets } from './betsSlice';
import CompleteBetCard from './CompleteBetCard';
import EmptyBetCard from './EmptyBetCard';
import { selectAllBets, selectTotalPages } from './selectors';

export default function BetEditList(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const allBets = useAppSelector(selectAllBets);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);
	const [page, setPage] = useState<number>(1);
	const totalPages = useAppSelector(selectTotalPages);

	useFetchActiveSeason(activeSeasonId);

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

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
			<Box sx={{ borderBottom: 1, textAlign: 'center', mx: 3, pb: 0.5, mb: 1.5 }}>
				{t('editingBets')}
			</Box>

			{loading ? (
				<CustomLoading />
			) : (
				<Box>
					{loadingError ? (
						<CustomLoadingError />
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
					<CustomButtonGroupPagination
						page={page}
						totalPages={totalPages}
						handlePageChange={handlePageChange}
					/>
				</Box>
			)}
		</Box>
	);
}
