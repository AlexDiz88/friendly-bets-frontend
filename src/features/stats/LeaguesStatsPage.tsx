import { Box, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import { getActiveSeason, getActiveSeasonId } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason, selectActiveSeasonId } from '../admin/seasons/selectors';
import PlayersStats from './PlayersStats';
import { selectPlayersStatsByLeagues } from './selectors';
import { getAllPlayersStatsByLeagues } from './statsSlice';
import LeagueStats from './types/LeagueStats';

export default function LeaguesStatsPage(): JSX.Element {
	const activeSeason = useAppSelector(selectActiveSeason);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const statsByLeagues: LeagueStats[] = useAppSelector(selectPlayersStatsByLeagues);
	const dispatch = useAppDispatch();
	const [selectedLeague, setSelectedLeague] = useState<LeagueStats | undefined>(undefined);
	const [selectedLeagueCode, setSelectedLeagueName] = useState<string>('');
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const sortedPlayersStats = selectedLeague
		? [...selectedLeague.playersStats].sort((a, b) => b.actualBalance - a.actualBalance)
		: [];

	useFetchActiveSeason(activeSeasonId);

	const handleLeagueChange = (event: SelectChangeEvent): void => {
		const leagueName = event.target.value;
		const league = statsByLeagues.find((l) => l.simpleLeague.leagueCode === leagueName);
		setSelectedLeagueName(leagueName);
		setSelectedLeague(league || undefined);
	};

	useEffect(() => {
		if (statsByLeagues?.length === 1) {
			setSelectedLeagueName(statsByLeagues[0].simpleLeague.leagueCode);
			setSelectedLeague(statsByLeagues[0]);
		}
	}, [statsByLeagues]);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllPlayersStatsByLeagues(activeSeasonId))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeasonId]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
		if (!activeSeasonId) {
			dispatch(getActiveSeasonId());
		}
	}, []);

	return (
		<Box>
			{loading ? (
				<CustomLoading />
			) : (
				<Box>
					{loadingError ? (
						<CustomLoadingError />
					) : (
						<Box
							sx={{
								maxWidth: '25rem',
								margin: '0 auto',
								mt: -1,
								pt: 1,
								boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
							}}
						>
							<Box sx={{ textAlign: 'center', fontWeight: 600 }}>
								{t('chooseLeagueForDetailedStatistik')}
							</Box>
							<Box sx={{ my: 1, mx: 1, minWidth: '18rem' }}>
								<LeagueSelect
									value={selectedLeagueCode}
									onChange={handleLeagueChange}
									leagues={activeSeason?.leagues}
									withoutAll
									fullLeagueNames
								/>
							</Box>
							<PlayersStats playersStats={sortedPlayersStats} />
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
