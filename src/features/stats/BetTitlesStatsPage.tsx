import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomLoading from '../../components/custom/loading/CustomLoading';
import CustomLoadingError from '../../components/custom/loading/CustomLoadingError';
import { getSeasons } from '../admin/seasons/seasonsSlice';
import { selectActiveSeasonId, selectSeasons } from '../admin/seasons/selectors';
import PlayerBetStatsByBetTitles from './PlayerBetStatsByBetTitles';
import { selectAllStatsByBetTitlesInSeason } from './selectors';
import { getAllStatsByBetTitlesInSeason } from './statsSlice';

export default function BetTitlesStatsPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const allSeasons = useAppSelector(selectSeasons);
	const playersStatsByBetTitles = useAppSelector(selectAllStatsByBetTitlesInSeason);

	const [selectedSeasonId, setSelectedSeasonId] = useState('');
	const [seasonsReady, setSeasonsReady] = useState(false);
	/** Сезон, для которого stats уже загружены в Redux — убирает мигание старых данных. */
	const [loadedStatsSeasonId, setLoadedStatsSeasonId] = useState<string | null>(null);
	const [loadingError, setLoadingError] = useState(false);

	const players = useMemo(
		() => allSeasons.find((s) => s.id === selectedSeasonId)?.players ?? [],
		[allSeasons, selectedSeasonId]
	);

	const hasValidSeason =
		Boolean(selectedSeasonId) && allSeasons.some((s) => s.id === selectedSeasonId);

	const isPageLoading =
		!loadingError &&
		(!seasonsReady || !hasValidSeason || loadedStatsSeasonId !== selectedSeasonId);

	useEffect(() => {
		let cancelled = false;
		setSeasonsReady(false);

		void dispatch(getSeasons())
			.unwrap()
			.finally(() => {
				if (!cancelled) {
					setSeasonsReady(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [dispatch]);

	useEffect(() => {
		if (!seasonsReady || allSeasons.length === 0) {
			return;
		}

		if (selectedSeasonId && allSeasons.some((s) => s.id === selectedSeasonId)) {
			return;
		}

		if (activeSeasonId && allSeasons.some((s) => s.id === activeSeasonId)) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(allSeasons[allSeasons.length - 1].id);
		}
	}, [seasonsReady, allSeasons, activeSeasonId, selectedSeasonId]);

	useEffect(() => {
		if (!hasValidSeason) {
			return;
		}

		let cancelled = false;
		setLoadingError(false);

		void dispatch(getAllStatsByBetTitlesInSeason(selectedSeasonId))
			.unwrap()
			.then(() => {
				if (!cancelled) {
					setLoadedStatsSeasonId(selectedSeasonId);
				}
			})
			.catch(() => {
				if (!cancelled) {
					setLoadingError(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [selectedSeasonId, hasValidSeason, dispatch]);

	if (isPageLoading) {
		return <CustomLoading />;
	}

	const seasonSelect = (
		<Box sx={{ maxWidth: 300, mx: 'auto', mb: 2 }}>
			<FormControl fullWidth size="small">
				<InputLabel>{t('season')}</InputLabel>
				<Select
					value={selectedSeasonId}
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
	);

	if (loadingError) {
		return (
			<Box>
				{seasonSelect}
				<CustomLoadingError />
			</Box>
		);
	}

	return (
		<Box>
			{seasonSelect}

			<Box sx={{ maxWidth: '25rem', margin: '0 auto', py: 0.5 }}>
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
		</Box>
	);
}
