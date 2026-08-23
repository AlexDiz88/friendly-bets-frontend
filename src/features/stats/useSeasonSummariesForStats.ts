import { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from '../../app/hooks';
import { SEASON_STATUS_ACTIVE } from '../../constants';
import { selectActiveSeasonId } from '../admin/seasons/selectors';
import SeasonSummary from '../admin/seasons/types/SeasonSummary';
import useSeasonSummaries from '../admin/seasons/useSeasonSummaries';
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
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const { seasonChoices, seasonsNewestFirst, summariesError } = useSeasonSummaries();

	const [selectedSeasonId, setSelectedSeasonId] = useState(
		() =>
			seasonChoices.find((season) => season.status === SEASON_STATUS_ACTIVE)?.id ??
			activeSeasonId ??
			''
	);

	const selectedSeason = useMemo(
		() => seasonChoices.find((season) => season.id === selectedSeasonId),
		[seasonChoices, selectedSeasonId]
	);

	const leagues = selectedSeason?.leagues ?? [];
	const players = selectedSeason?.players ?? [];

	const hasValidSeason =
		Boolean(selectedSeasonId) && seasonChoices.some((season) => season.id === selectedSeasonId);

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
