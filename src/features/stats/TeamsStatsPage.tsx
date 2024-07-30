import { Box, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import useFilterLanguageChange from '../../components/hooks/useFilterLanguageChange';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import PlayerSelect from '../../components/selectors/PlayerSelect';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { selectAllStatsByTeamsInSeason } from './selectors';
import { getAllStatsByTeamsInSeason } from './statsSlice';
import TeamsStats from './TeamsStats';

export default function TeamsStatsPage(): JSX.Element {
	const activeSeason = useAppSelector(selectActiveSeason);
	const statsByTeams = useAppSelector(selectAllStatsByTeamsInSeason);
	const dispatch = useAppDispatch();
	const [selectedLeagueCode, setSelectedLeagueCode] = useState<string>('');
	const [selectedPlayerName, setSelectedPlayerName] = useState<string>(t('all'));
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const filteredStats =
		selectedPlayerName === t('all')
			? statsByTeams.filter((stats) => stats.leagueStats && stats.leagueCode === selectedLeagueCode)
			: statsByTeams.filter(
					(stats) =>
						!stats.leagueStats &&
						stats.username === selectedPlayerName &&
						stats.leagueCode === selectedLeagueCode
			  );

	useFilterLanguageChange(setSelectedPlayerName);
	// TODO: переделать систему отлова загрузки и ошибок (React Query??)
	useFetchActiveSeason(activeSeason?.id);

	const handleLeagueChange = (e: SelectChangeEvent): void => {
		setSelectedLeagueCode(e.target.value);
	};

	const handlePlayerChange = (e: SelectChangeEvent): void => {
		setSelectedPlayerName(e.target.value);
	};

	useEffect(() => {
		if (statsByTeams && statsByTeams.length > 0) {
			setSelectedLeagueCode(statsByTeams[0].leagueCode || '');
		}
	}, [statsByTeams]);

	useEffect(() => {
		if (activeSeason) {
			dispatch(getAllStatsByTeamsInSeason(activeSeason.id))
				.then(() => {
					setLoading(false);
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeason]);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, []);

	return (
		<Box>
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
									mt: -2,
									pt: 2,
									boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
								}}
							>
								<Box sx={{ display: 'flex', justifyContent: 'center' }}>
									<LeagueSelect
										value={selectedLeagueCode}
										onChange={handleLeagueChange}
										leagues={activeSeason?.leagues}
										withoutAll
									/>

									<PlayerSelect
										value={selectedPlayerName}
										onChange={handlePlayerChange}
										players={activeSeason?.players}
									/>
								</Box>
								<TeamsStats playersStatsByTeams={filteredStats} />
							</Box>
						)}
					</Box>
				)}
			</Box>
		</Box>
	);
}
