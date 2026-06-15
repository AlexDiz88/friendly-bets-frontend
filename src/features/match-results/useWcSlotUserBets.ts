import { useEffect, useMemo, useState } from 'react';
import { getUserSlotBets } from '../bets/api';
import type Bet from '../bets/types/Bet';
import type { ExternalMatch } from './types/ExternalMatch';

export function betMatchesExternalMatch(bet: Bet, match: ExternalMatch): boolean {
	if (!bet.homeTeam?.id || !bet.awayTeam?.id || !match.homeTeamId || !match.awayTeamId) {
		return false;
	}
	return bet.homeTeam.id === match.homeTeamId && bet.awayTeam.id === match.awayTeamId;
}

export function useWcSlotUserBets({
	enabled,
	contextReady,
	seasonId,
	leagueId,
	matchDay,
	refreshKey,
}: {
	enabled: boolean;
	contextReady: boolean;
	seasonId: string | undefined;
	leagueId: string | undefined;
	matchDay: string;
	refreshKey?: unknown;
}): { bets: Bet[]; betsByMatch: Map<string, Bet>; loading: boolean } {
	const [bets, setBets] = useState<Bet[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!enabled || !contextReady || !seasonId || !leagueId) {
			setBets([]);
			setLoading(false);
			return;
		}

		let cancelled = false;
		setLoading(true);

		const load = async (): Promise<void> => {
			try {
				const { bets: slotBets } = await getUserSlotBets(seasonId, leagueId, matchDay);
				if (cancelled) {
					return;
				}
				setBets(slotBets);
			} catch {
				if (!cancelled) {
					setBets([]);
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [enabled, contextReady, seasonId, leagueId, matchDay, refreshKey]);

	const betsByMatch = useMemo(() => {
		const map = new Map<string, Bet>();
		for (const bet of bets) {
			if (!bet.homeTeam?.id || !bet.awayTeam?.id) {
				continue;
			}
			map.set(`${bet.homeTeam.id}_${bet.awayTeam.id}`, bet);
		}
		return map;
	}, [bets]);

	return { bets, betsByMatch, loading: loading && enabled };
}
