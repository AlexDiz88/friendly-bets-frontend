import type MatchTeamStats from './types/MatchTeamStats';

export type MatchStatRowKey =
	| 'xg'
	| 'shots'
	| 'shotsOnTarget'
	| 'saves'
	| 'possession'
	| 'corners'
	| 'offsides'
	| 'yellowCards'
	| 'redCards';

export type MatchStatValueFormat = 'decimal' | 'integer' | 'percent';

export interface MatchStatRow {
	key: MatchStatRowKey;
	home: number;
	away: number;
	format: MatchStatValueFormat;
}

type StatFieldDef = {
	key: MatchStatRowKey;
	home: keyof MatchTeamStats;
	away: keyof MatchTeamStats;
	format: MatchStatValueFormat;
};

const STAT_FIELD_ORDER: StatFieldDef[] = [
	{ key: 'xg', home: 'xgHome', away: 'xgAway', format: 'decimal' },
	{ key: 'shots', home: 'shotsHome', away: 'shotsAway', format: 'integer' },
	{ key: 'shotsOnTarget', home: 'shotsOnTargetHome', away: 'shotsOnTargetAway', format: 'integer' },
	{ key: 'saves', home: 'savesHome', away: 'savesAway', format: 'integer' },
	{ key: 'possession', home: 'possessionHome', away: 'possessionAway', format: 'percent' },
	{ key: 'corners', home: 'cornersHome', away: 'cornersAway', format: 'integer' },
	{ key: 'offsides', home: 'offsidesHome', away: 'offsidesAway', format: 'integer' },
	{ key: 'yellowCards', home: 'yellowCardsHome', away: 'yellowCardsAway', format: 'integer' },
	{ key: 'redCards', home: 'redCardsHome', away: 'redCardsAway', format: 'integer' },
];

function isPresent(value: number | null | undefined): value is number {
	return value != null && !Number.isNaN(value);
}

function hasAnyStatValue(stats: MatchTeamStats): boolean {
	return STAT_FIELD_ORDER.some(
		({ home, away }) => isPresent(stats[home] as number | null) || isPresent(stats[away] as number | null)
	);
}

export function hasMatchTeamStats(stats?: MatchTeamStats | null): boolean {
	if (!stats) {
		return false;
	}
	return hasAnyStatValue(stats);
}

export function buildMatchStatRows(stats: MatchTeamStats): MatchStatRow[] {
	return STAT_FIELD_ORDER.flatMap(({ key, home, away, format }) => {
		const homeVal = stats[home] as number | null | undefined;
		const awayVal = stats[away] as number | null | undefined;
		if (!isPresent(homeVal) && !isPresent(awayVal)) {
			return [];
		}
		return [
			{
				key,
				home: homeVal ?? 0,
				away: awayVal ?? 0,
				format,
			},
		];
	});
}

export function formatMatchStatValue(value: number, format: MatchStatValueFormat): string {
	if (format === 'decimal') {
		return value.toFixed(1);
	}
	if (format === 'percent') {
		return `${Math.round(value)}%`;
	}
	return String(Math.round(value));
}

export function matchStatShare(home: number, away: number): { homePct: number; awayPct: number } {
	const total = home + away;
	if (total <= 0) {
		return { homePct: 50, awayPct: 50 };
	}
	return {
		homePct: (home / total) * 100,
		awayPct: (away / total) * 100,
	};
}
