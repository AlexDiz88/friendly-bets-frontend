import { useEffect, useMemo, useState } from 'react';
import { getCompletedBets, getOpenedBets } from '../bets/api';
import type Bet from '../bets/types/Bet';
import type { ExternalMatch } from './types/ExternalMatch';

function dedupeBets(bets: Bet[]): Bet[] {
	const byId = new Map<string, Bet>();
	for (const bet of bets) {
		byId.set(bet.id, bet);
	}
	return [...byId.values()];
}

export function betMatchesExternalMatch(bet: Bet, match: ExternalMatch): boolean {
	if (!bet.homeTeam?.id || !bet.awayTeam?.id || !match.homeTeamId || !match.awayTeamId) {
		return false;
	}
	return bet.homeTeam.id === match.homeTeamId && bet.awayTeam.id === match.awayTeamId;
}

export function useWcSlotUserBets({
	enabled,
	seasonId,
	leagueId,
	userId,
	matchDay,
	refreshKey,
}: {
	enabled: boolean;
	seasonId: string | undefined;
	leagueId: string | undefined;
	userId: string | undefined;
	matchDay: string;
	refreshKey?: unknown;
}): { bets: Bet[]; betsByMatch: Map<string, Bet>; loading: boolean } {
	const [bets, setBets] = useState<Bet[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!enabled || !seasonId || !leagueId || !userId) {
			setBets([]);
			return;
		}

		let cancelled = false;
		setLoading(true);

		const load = async (): Promise<void> => {
			try {
				const [opened, completed] = await Promise.all([
					getOpenedBets(seasonId),
					getCompletedBets(seasonId, userId, leagueId, '200', 0),
				]);
				if (cancelled) {
					return;
				}
				const merged = dedupeBets([...opened.bets, ...completed.bets]).filter(
					(b) =>
						b.player.id === userId &&
						b.leagueId === leagueId &&
						b.matchDay === matchDay
				);
				setBets(merged);
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
	}, [enabled, seasonId, leagueId, userId, matchDay, refreshKey]);

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
