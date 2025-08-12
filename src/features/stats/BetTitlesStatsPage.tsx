import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import { getSeasons } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId, selectSeasons } from '../admin/seasons/selectors';
import User from '../auth/types/User';
import PlayerBetStatsByBetTitles from './PlayerBetStatsByBetTitles';
import { selectAllStatsByBetTitlesInSeason } from './selectors';
import { getAllStatsByBetTitlesInSeason } from './statsSlice';

export default function BetTitlesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const allSeasons = useAppSelector(selectSeasons);
	const playersStatsByBetTitles = useAppSelector(selectAllStatsByBetTitlesInSeason);

	const [selectedSeasonId, setSelectedSeasonId] = useState<string>(activeSeasonId || '');
	const [players, setPlayers] = useState<User[]>();
	const [loading, setLoading] = useState(false);
	const [loadingError, setLoadingError] = useState(false);

	useEffect(() => {
		dispatch(getSeasons());
	}, []);

	useEffect(() => {
		if (selectedSeasonId || allSeasons.length === 0) return;

		if (activeSeasonId) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(allSeasons[allSeasons.length - 1].id);
		}
	}, [activeSeasonId, allSeasons, selectedSeasonId]);

	useEffect(() => {
		if (!selectedSeasonId) return;

		setLoading(true);
		setLoadingError(false);

		const selectedSeason = allSeasons.find((s) => s.id === selectedSeasonId);
		setPlayers(selectedSeason?.players);

		dispatch(getAllStatsByBetTitlesInSeason(selectedSeasonId))
			.then(() => setLoading(false))
			.catch(() => {
				setLoadingError(true);
				setLoading(false);
			});
	}, [selectedSeasonId, allSeasons]);

	return (
		<Box>
			{loading ? (
				<CustomLoading />
			) : loadingError ? (
				<CustomLoadingError />
			) : (
				<>
					{/* Селектор сезона */}
					<Box sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
						<FormControl fullWidth size="small">
							<InputLabel>{t('season')}</InputLabel>
							<Select
								value={
									allSeasons.some((season) => season.id === selectedSeasonId)
										? selectedSeasonId
										: ''
								}
								label={t('season')}
								onChange={(e) => setSelectedSeasonId(e.target.value)}
							>
								{allSeasons.map((season) => (
									<MenuItem key={season.id} value={season.id}>
										{season.title}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					{/* Таблица / сообщение */}
					<Box
						sx={{
							maxWidth: '25rem',
							margin: '0 auto',
							py: 0.5,
							boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.9)',
							bgcolor: '#283229ff',
							border: 2,
							borderRadius: 2,
						}}
					>
						{playersStatsByBetTitles.length === 0 ? (
							<Box
								sx={{
									textAlign: 'center',
									fontWeight: 600,
									color: '#ffffff',
									fontSize: 16,
								}}
							>
								{t('noBetTitlesStats')}
							</Box>
						) : (
							<PlayerBetStatsByBetTitles
								playersStatsByBetTitles={playersStatsByBetTitles}
								players={players || []}
							/>
						)}
					</Box>
				</>
			)}
		</Box>
	);
}
