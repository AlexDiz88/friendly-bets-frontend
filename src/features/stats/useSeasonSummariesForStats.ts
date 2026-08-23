import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { SEASON_STATUS_ACTIVE } from '../../constants';
import { getSeasonSummaries } from '../admin/seasons/seasonsSlice';
import {
	selectActiveSeason,
	selectActiveSeasonId,
	selectSeasonSummaries,
} from '../admin/seasons/selectors';
import { sortSeasonsNewestFirst } from '../admin/seasons/sortSeasons';
import SeasonSummary from '../admin/seasons/types/SeasonSummary';
import SimpleUser from '../auth/types/SimpleUser';

export default function useSeasonSummariesForStats(): {
	seasonsNewestFirst: SeasonSummary[];
	selectedSeasonId: string;
	setSelectedSeasonId: (id: string) => void;
	leagues: SeasonSummary['leagues'];
	players: SimpleUser[];
	hasValidSeason: boolean;
	summariesError: boolean;
} {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const summaries = useAppSelector(selectSeasonSummaries);

	const [selectedSeasonId, setSelectedSeasonId] = useState(activeSeason?.id ?? '');
	const [summariesError, setSummariesError] = useState(false);

	const seasonChoices = useMemo((): SeasonSummary[] => {
		if (summaries.length > 0) {
			return summaries;
		}
		if (!activeSeason) {
			return [];
		}
		return [
			{
				id: activeSeason.id,
				title: activeSeason.title,
				startDate: activeSeason.startDate,
				endDate: activeSeason.endDate,
				status: activeSeason.status,
				players: activeSeason.players,
				leagues: activeSeason.leagues,
			},
		];
	}, [summaries, activeSeason]);

	const seasonsNewestFirst = useMemo(
		() => sortSeasonsNewestFirst(seasonChoices),
		[seasonChoices]
	);

	const selectedSeason = useMemo(
		() => seasonChoices.find((season) => season.id === selectedSeasonId),
		[seasonChoices, selectedSeasonId]
	);

	const leagues = selectedSeason?.leagues ?? [];

	const players = useMemo(() => {
		const raw = selectedSeason?.players ?? [];
		if (!activeSeason?.players?.length) {
			return raw;
		}
		const avatarsById = new Map(
			activeSeason.players.map((player) => [player.id, player.avatar])
		);
		return raw.map((player) =>
			player.avatar ? player : { ...player, avatar: avatarsById.get(player.id) }
		);
	}, [selectedSeason, activeSeason]);

	const hasValidSeason =
		Boolean(selectedSeasonId) && seasonChoices.some((season) => season.id === selectedSeasonId);

	useEffect(() => {
		if (summaries.length > 0) {
			return;
		}

		let cancelled = false;
		setSummariesError(false);

		void dispatch(getSeasonSummaries())
			.unwrap()
			.catch(() => {
				if (!cancelled) {
					setSummariesError(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [dispatch, summaries.length]);

	useEffect(() => {
		if (seasonChoices.length === 0) {
			return;
		}

		if (selectedSeasonId && seasonChoices.some((season) => season.id === selectedSeasonId)) {
			return;
		}

		const activeInList = seasonChoices.find((season) => season.status === SEASON_STATUS_ACTIVE);
		if (activeInList) {
			setSelectedSeasonId(activeInList.id);
		} else if (activeSeasonId && seasonChoices.some((season) => season.id === activeSeasonId)) {
			setSelectedSeasonId(activeSeasonId);
		} else {
			setSelectedSeasonId(seasonsNewestFirst[0].id);
		}
	}, [seasonChoices, seasonsNewestFirst, activeSeasonId, selectedSeasonId]);

	return {
		seasonsNewestFirst,
		selectedSeasonId,
		setSelectedSeasonId,
		leagues,
		players,
		hasValidSeason,
		summariesError,
	};
}
