import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { getActiveSeason } from '../admin/seasons/seasonsSlice';
import { selectActiveSeason } from '../admin/seasons/selectors';
import { getMatchdayCountForLeague } from '../football-data/competitionOptions';
import { getExternalMatchScoreView } from '../football-data/externalMatchScoreView';
import { getMatchdayFromCache } from '../football-data/footballDataApi';
import { resolveExternalSeasonForLeague } from '../football-data/seasonExternalYear';
import type { ExternalMatch } from '../football-data/types/ExternalMatch';
import { findExternalMatchForWc26Schedule } from './wc26BetSlots';
import { WC26_SCHEDULE } from './wc26Schedule';

/** Счёт завершённых матчей ЧМ из кэша football-data (MongoDB), ключ — id расписания. */
export function useWc26ScheduleScores(): Map<number, string> {
	const dispatch = useAppDispatch();
	const activeSeason = useAppSelector(selectActiveSeason);
	const [externalMatches, setExternalMatches] = useState<ExternalMatch[]>([]);

	const wcLeague = useMemo(
		() => activeSeason?.leagues.find((league) => league.leagueCode === 'WC'),
		[activeSeason?.leagues]
	);

	const externalSeason = useMemo(
		() => resolveExternalSeasonForLeague(activeSeason, 'WC'),
		[activeSeason]
	);

	useEffect(() => {
		if (!activeSeason) {
			dispatch(getActiveSeason());
		}
	}, [activeSeason, dispatch]);

	useEffect(() => {
		if (!wcLeague) {
			setExternalMatches([]);
			return;
		}

		let cancelled = false;
		const matchdayCount = getMatchdayCountForLeague('WC');

		const load = async (): Promise<void> => {
			try {
				const pages = await Promise.all(
					Array.from({ length: matchdayCount }, (_, index) =>
						getMatchdayFromCache('WC', index + 1, externalSeason, wcLeague.id)
					)
				);
				if (!cancelled) {
					setExternalMatches(pages.flatMap((page) => page.matches ?? []));
				}
			} catch {
				if (!cancelled) {
					setExternalMatches([]);
				}
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [wcLeague, externalSeason]);

	return useMemo(() => {
		const scores = new Map<number, string>();
		for (const scheduled of WC26_SCHEDULE) {
			const external = findExternalMatchForWc26Schedule(scheduled, externalMatches);
			if (!external) {
				continue;
			}
			const scoreView = getExternalMatchScoreView(
				external.gameScore,
				external.status,
				Boolean(external.finalized)
			);
			if (scoreView !== '—') {
				scores.set(scheduled.id, scoreView);
			}
		}
		return scores;
	}, [externalMatches]);
}
