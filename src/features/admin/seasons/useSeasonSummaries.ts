import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { getSeasonSummaries } from './seasonsSlice';
import { selectActiveSeason, selectSeasonSummaries } from './selectors';
import { sortSeasonsNewestFirst } from './sortSeasons';
import SeasonSummary from './types/SeasonSummary';

export default function useSeasonSummaries(): {
	seasonChoices: SeasonSummary[];
	seasonsNewestFirst: SeasonSummary[];
	summariesReady: boolean;
	summariesError: boolean;
} {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const summaries = useAppSelector(selectSeasonSummaries);

	const [summariesReady, setSummariesReady] = useState(summaries.length > 0);
	const [summariesError, setSummariesError] = useState(false);

	const seasonChoices = useMemo((): SeasonSummary[] => {
		const base: SeasonSummary[] =
			summaries.length > 0
				? summaries
				: activeSeason
					? [
							{
								id: activeSeason.id,
								title: activeSeason.title,
								startDate: activeSeason.startDate,
								endDate: activeSeason.endDate,
								status: activeSeason.status,
								players: activeSeason.players,
								leagues: activeSeason.leagues,
							},
						]
					: [];
		if (!activeSeason?.players?.length) {
			return base;
		}
		const avatarsById = new Map(
			activeSeason.players.map((player) => [player.id, player.avatar])
		);
		return base.map((season) => ({
			...season,
			players: season.players.map((player) =>
				player.avatar ? player : { ...player, avatar: avatarsById.get(player.id) }
			),
		}));
	}, [summaries, activeSeason]);

	const seasonsNewestFirst = useMemo(
		() => sortSeasonsNewestFirst(seasonChoices),
		[seasonChoices]
	);

	useEffect(() => {
		if (summaries.length > 0) {
			setSummariesReady(true);
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
			})
			.finally(() => {
				if (!cancelled) {
					setSummariesReady(true);
				}
			});

		return () => {
			cancelled = true;
		};
	}, [dispatch, summaries.length]);

	return {
		seasonChoices,
		seasonsNewestFirst,
		summariesReady,
		summariesError,
	};
}
