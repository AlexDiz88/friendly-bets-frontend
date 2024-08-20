import { Box, SelectChangeEvent } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomErrorMessage from '../../components/custom/CustomErrorMessage';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import useFetchActiveSeason from '../../components/hooks/useFetchActiveSeason';
import useFilterLanguageChange from '../../components/hooks/useFilterLanguageChange';
import LeagueSelect from '../../components/selectors/LeagueSelect';
import PlayerSelect from '../../components/selectors/PlayerSelect';
import { TOTAL_STATS_BY_TEAMS_USER_ID } from '../../constants';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { selectError, selectStatsByTeams } from './selectors';
import { getStatsByTeams } from './statsSlice';
import TeamsStats from './TeamsStats';

export default function TeamsStatsPage(): JSX.Element {
	const activeSeason = useAppSelector(selectActiveSeason);
	const statsByTeams = useAppSelector(selectStatsByTeams);
	const errorText = useAppSelector(selectError);
	const dispatch = useAppDispatch();
	const [selectedLeagueCode, setSelectedLeagueCode] = useState<string>('');
	const [selectedPlayerName, setSelectedPlayerName] = useState<string>(t('all'));
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

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
		if (activeSeason && statsByTeams) {
			const league = activeSeason.leagues.find((l) => l.id === statsByTeams.leagueId);
			setSelectedLeagueCode(league?.leagueCode || '');
		}
	}, [statsByTeams]);

	useEffect(() => {
		if (activeSeason) {
			setSelectedLeagueCode(activeSeason.leagues[0].leagueCode || '');
		}
	}, [activeSeason]);

	useEffect(() => {
		if (activeSeason) {
			const league = activeSeason.leagues.find((l) => l.leagueCode === selectedLeagueCode);
			let userId;
			if (selectedPlayerName === t('all')) {
				userId = TOTAL_STATS_BY_TEAMS_USER_ID;
			} else {
				const user = activeSeason.players.find((p) => p.username === selectedPlayerName);
				userId = user?.id;
			}
			if (league && userId) {
				setLoading(true);
				dispatch(getStatsByTeams({ seasonId: activeSeason.id, leagueId: league?.id, userId }))
					.then(() => {
						setLoading(false);
					})
					.catch(() => {
						setLoadingError(true);
						setLoading(false);
					});
			}
		}
	}, [activeSeason, selectedLeagueCode, selectedPlayerName]);

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
							<Box>
								<CustomLoadingError />
							</Box>
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
								{statsByTeams ? (
									<TeamsStats playersStatsByTeams={statsByTeams} />
								) : (
									<CustomErrorMessage message={errorText} />
								)}
							</Box>
						)}
					</Box>
				)}
			</Box>
		</Box>
	);
}
