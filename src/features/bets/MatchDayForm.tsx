import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo } from 'react';
import MatchdayNavigator from '../../components/matchday/MatchdayNavigator';
import {
	matchDayStringToSlotValue,
	resolveMatchdaySlotsForBetInput,
	slotValueToMatchDayString,
} from '../../components/matchday/slotMappers';
import { resolveDefaultMatchDay } from '../../components/utils/matchdaySlots';
import type { ExpandedMatchdaySlot } from '../admin/tournament-formats/types/TournamentFormat';

type MatchDayFormProps = {
	matchDay: string;
	leagueCode?: string;
	matchdaySlots?: ExpandedMatchdaySlot[];
	onMatchDay: (matchDay: string) => void;
};

/**
 * Tour selection for bets: grid navigator (as on match results page) when slots are known.
 */
export default function MatchDayForm({
	matchDay,
	leagueCode,
	matchdaySlots,
	onMatchDay,
}: MatchDayFormProps): JSX.Element {
	const gridSlots = useMemo(
		() => resolveMatchdaySlotsForBetInput(matchdaySlots, leagueCode),
		[matchdaySlots, leagueCode]
	);

	const hasGrid = gridSlots.length > 0;

	useEffect(() => {
		if (!matchdaySlots?.length) {
			return;
		}
		const resolved = resolveDefaultMatchDay(matchDay, matchdaySlots);
		if (resolved !== matchDay) {
			onMatchDay(resolved);
		}
	}, [matchdaySlots, matchDay, onMatchDay]);

	const slotValue = useMemo(
		() => (hasGrid ? matchDayStringToSlotValue(matchDay, gridSlots) : 1),
		[hasGrid, matchDay, gridSlots]
	);

	const handleSlotChange = (value: number): void => {
		onMatchDay(slotValueToMatchDayString(value, gridSlots));
	};

	if (hasGrid) {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0.75,
					mt: 1,
					mx: 1,
					flexWrap: 'nowrap',
				}}
			>
				<Typography sx={{ fontWeight: 600, flexShrink: 0 }}>{t('matchday')}</Typography>
				<MatchdayNavigator value={slotValue} slots={gridSlots} onChange={handleSlotChange} />
			</Box>
		);
	}

	return (
		<Box>
			<Typography sx={{ mx: 1, fontWeight: 600 }}>{t('matchday')}</Typography>
			<Box component="form" autoComplete="off" sx={{ minWidth: '5rem', pt: 0, mt: 1 }}>
				<TextField
					size="small"
					value={matchDay}
					onChange={(e) => onMatchDay(e.target.value)}
					inputProps={{ min: 1, 'aria-label': t('matchday') }}
				/>
			</Box>
		</Box>
	);
}
