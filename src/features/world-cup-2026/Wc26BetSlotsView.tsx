import { Box, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26MatchCard from './Wc26MatchCard';
import { WC26_BET_SLOTS, formatSlotBerlinRange, getMatchesForSlot, type Wc26GroupRound } from './wc26BetSlots';
import { wc26DateLocale } from './wc26Time';
import {
	wc26DividerSx,
	wc26SectionHeaderSx,
	wc26SlotRangeSx,
	wc26SlotRuleSx,
	wc26SlotTitleSx,
} from './wc26PageStyles';

const ROUNDS: Wc26GroupRound[] = [1, 2, 3];

export default function Wc26BetSlotsView(): JSX.Element {
	const { t, i18n } = useTranslation();
	const dateLocale = wc26DateLocale(i18n.language);

	const slotsByRound = useMemo(() => {
		const map = new Map<Wc26GroupRound, typeof WC26_BET_SLOTS>();
		for (const round of ROUNDS) {
			map.set(
				round,
				WC26_BET_SLOTS.filter((s) => s.round === round)
			);
		}
		return map;
	}, []);

	return (
		<Stack spacing={2}>
			{ROUNDS.map((round) => (
				<Box key={round}>
					<Typography
						variant="subtitle2"
						sx={[wc26SectionHeaderSx, { mb: 1 }] as SxProps<Theme>}
					>
						{t('wc26.betSlots.round', { round })}
					</Typography>

					<Stack spacing={1.5}>
						{slotsByRound.get(round)?.map((slot) => {
							const range = formatSlotBerlinRange(slot, dateLocale);
							const matches = getMatchesForSlot(slot);

							return (
								<Box key={slot.id}>
									<Box sx={{ px: 0.5, mb: 0.5 }}>
										<Typography variant="caption" sx={wc26SlotTitleSx}>
											{t('wc26.betSlots.slotTitle', {
												round: slot.round,
												index: slot.slotIndex,
											})}
										</Typography>
										<Typography variant="caption" sx={wc26SlotRangeSx}>
											{t('wc26.betSlots.range', { from: range.from, to: range.to })}
										</Typography>
										<Typography variant="caption" sx={wc26SlotRuleSx}>
											{t('wc26.betSlots.betsRule', {
												bets: slot.betsRequired,
												matches: slot.matchesPerSlot,
											})}
										</Typography>
									</Box>
									<Stack
										spacing={0}
										divider={<Box sx={wc26DividerSx} />}
									>
										{matches.map((match) => (
											<Wc26MatchCard key={match.id} match={match} />
										))}
									</Stack>
								</Box>
							);
						})}
					</Stack>
				</Box>
			))}
		</Stack>
	);
}
