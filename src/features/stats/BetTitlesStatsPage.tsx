import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import { getSeasons } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId, selectSeasons } from '../admin/seasons/selectors';
import PlayerBetStatsByBetTitles from './PlayerBetStatsByBetTitles';
import { selectAllStatsByBetTitlesInSeason } from './selectors';
import { getAllStatsByBetTitlesInSeason } from './statsSlice';

const statsPanelSx = {
	maxWidth: '25rem',
	margin: '0 auto',
	py: 0.5,
	minHeight: 160,
	position: 'relative' as const,
};

export default function BetTitlesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const allSeasons = useAppSelector(selectSeasons);
	const playersStatsByBetTitles = useAppSelector(selectAllStatsByBetTitlesInSeason);

	const [selectedSeasonId, setSelectedSeasonId] = useState<string>(activeSeasonId || '');
	const [statsLoading, setStatsLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);

	const players = useMemo(
		() => allSeasons.find((s) => s.id === selectedSeasonId)?.players ?? [],
		[allSeasons, selectedSeasonId]
	);

	useEffect(() => {
		dispatch(getSeasons());
	}, [dispatch]);

	useEffect(() => {
		if (selectedSeasonId || allSeasons.length === 0) return;

		if (activeSeasonId) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(allSeasons[allSeasons.length - 1].id);
		}
	}, [activeSeasonId, allSeasons, selectedSeasonId]);

	useEffect(() => {
		if (!selectedSeasonId) {
			setStatsLoading(allSeasons.length === 0);
			return;
		}

		let cancelled = false;
		setStatsLoading(true);
		setLoadingError(false);

		void dispatch(getAllStatsByBetTitlesInSeason(selectedSeasonId))
			.unwrap()
			.catch(() => {
				if (!cancelled) {
					setLoadingError(true);
				}
			})
			.finally(() => {
				if (!cancelled) {
					setStatsLoading(false);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [selectedSeasonId, dispatch]);

	const showPanel = Boolean(selectedSeasonId) || allSeasons.length > 0;

	return (
		<Box>
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

			{loadingError ? (
				<CustomLoadingError />
			) : showPanel ? (
				<Box sx={statsPanelSx}>
					{statsLoading && (
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								minHeight: 160,
							}}
						>
							<CircularProgress size={48} thickness={4} />
						</Box>
					)}

					{!statsLoading && (
						<Box
							key={selectedSeasonId}
							sx={{
								'@keyframes betTitlesFadeIn': {
									from: { opacity: 0 },
									to: { opacity: 1 },
								},
								animation: 'betTitlesFadeIn 0.2s ease-out',
							}}
						>
							{playersStatsByBetTitles.length === 0 ? (
								<Box
									sx={{
										textAlign: 'center',
										fontWeight: 600,
										fontSize: 16,
										py: 2,
									}}
								>
									{t('noBetTitlesStats')}
								</Box>
							) : (
								<PlayerBetStatsByBetTitles
									playersStatsByBetTitles={playersStatsByBetTitles}
									players={players}
								/>
							)}
						</Box>
					)}
				</Box>
			) : null}
		</Box>
	);
}
