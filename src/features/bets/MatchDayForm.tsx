import { Box, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useEffect, useMemo } from 'react';
import MatchdaySlotSelect from '../../components/selectors/MatchdaySlotSelect';
import {
	formatMatchdaySlotLabel,
	resolveDefaultMatchDay,
} from '../../components/utils/matchdaySlots';
import type { ExpandedMatchdaySlot } from '../admin/tournament-formats/types/TournamentFormat';

type MatchDayFormProps = {
	matchDay: string;
	matchdaySlots?: ExpandedMatchdaySlot[];
	onMatchDay: (matchDay: string) => void;
};

/**
 * Tour selection for bets: uses TournamentFormat slots when available, otherwise legacy numeric input.
 */
export default function MatchDayForm({
	matchDay,
	matchdaySlots,
	onMatchDay,
}: MatchDayFormProps): JSX.Element {
	const hasFormatSlots = (matchdaySlots?.length ?? 0) > 0;
	const slots = useMemo(() => matchdaySlots ?? [], [matchdaySlots]);

	useEffect(() => {
		if (!hasFormatSlots) {
			return;
		}
		const resolved = resolveDefaultMatchDay(matchDay, slots);
		if (resolved !== matchDay) {
			onMatchDay(resolved);
		}
	}, [hasFormatSlots, matchDay, slots, onMatchDay]);

	if (hasFormatSlots) {
		return (
			<Box>
				<Typography sx={{ mx: 1, fontWeight: 600 }}>{t('matchday')}</Typography>
				<Box sx={{ mt: 1 }}>
					<MatchdaySlotSelect value={matchDay} slots={slots} onChange={onMatchDay} />
				</Box>
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

export { formatMatchdaySlotLabel };
