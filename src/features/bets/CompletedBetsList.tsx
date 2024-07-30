import { Box, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButtonGroupPagination from '../../components/custom/btn/CustomButtonGroupPagination';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFilterLanguageChange from '../../components/hooks/useFilterLanguageChange';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import PlayerSelect from '../../components/selectors/PlayerSelect';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { getCompletedBets } from './betsSlice';
import CompleteBetCard from './CompleteBetCard';
import EmptyBetCard from './EmptyBetCard';
import { selectCompletedBets, selectTotalPages } from './selectors';

const CompletedBetsList = (): JSX.Element => {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const completedBets = useAppSelector(selectCompletedBets);
	const [selectedLeagueCode, setSelectedLeagueCode] = useState<string>(t('all'));
	const [selectedPlayerName, setSelectedPlayerName] = useState<string>(t('all'));
	const totalPages = useAppSelector(selectTotalPages);
	const [page, setPage] = useState<number>(1);
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	useFilterLanguageChange(setSelectedLeagueCode, setSelectedPlayerName);

	const handlePageChange = (pageNumber: number): void => {
		setPage(pageNumber);
	};

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setSelectedLeagueCode(e.target.value);
	};

	const handlePlayerChange = (e: SelectChangeEvent): void => {
		setSelectedPlayerName(e.target.value);
	};

	useEffect(() => {
		let pageSize = '14';
		if (selectedPlayerName === t('all') && selectedLeagueCode !== t('all')) {
			pageSize = '7';
		}
		if (selectedPlayerName !== t('all') && selectedLeagueCode === t('all')) {
			pageSize = '4';
		}
		if (selectedPlayerName !== t('all') && selectedLeagueCode !== t('all')) {
			pageSize = '4';
		}
		if (activeSeason) {
			const selectedPlayer = activeSeason.players.find((p) => p.username === selectedPlayerName);
			const selectedLeague = activeSeason.leagues.find((l) => l.leagueCode === selectedLeagueCode);
			dispatch(
				getCompletedBets({
					seasonId: activeSeason.id,
					playerId: selectedPlayer?.id,
					leagueId: selectedLeague?.id,
					pageSize,
					pageNumber: page - 1,
				})
			)
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
		setLoading(true);
	}, [selectedPlayerName, selectedLeagueCode, activeSeason, page]);

	return (
		<>
			{loading ? (
				<CustomLoading />
			) : (
				<>
					<Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
						<LeagueSelect
							value={selectedLeagueCode}
							onChange={handleLeagueChange}
							leagues={activeSeason?.leagues}
						/>

						<PlayerSelect
							value={selectedPlayerName}
							onChange={handlePlayerChange}
							players={activeSeason?.players}
						/>
					</Box>

					{loadingError ? (
						<CustomLoadingError />
					) : (
						<Box>
							<Box>
								<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
									{completedBets &&
										Array.isArray(completedBets) &&
										completedBets.length > 0 &&
										completedBets.map((bet) => (
											<Box key={bet.id}>
												{bet.betStatus === 'EMPTY' ? (
													<EmptyBetCard bet={bet} />
												) : (
													<CompleteBetCard bet={bet} />
												)}
											</Box>
										))}
								</Box>
								<CustomButtonGroupPagination
									page={page}
									totalPages={totalPages}
									handlePageChange={handlePageChange}
								/>
							</Box>
						</Box>
					)}
				</>
			)}
		</>
	);
};

export default CompletedBetsList;
