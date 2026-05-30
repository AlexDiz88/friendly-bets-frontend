import { Alert, Box, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Bet from '../bets/types/Bet';
import { Wc26BettingContext } from '../../components/odds/oddsTypes';
import Wc26MatchCard from './Wc26MatchCard';
import Wc26OddsPickDialog from './Wc26OddsPickDialog';
import { WC26_BET_SLOTS, formatSlotBerlinRange, getMatchesForSlot, type Wc26GroupRound } from './wc26BetSlots';
import type { Wc26Match } from './wc26Schedule';
import { wc26DateLocale } from './wc26Time';
import { getSelfOpenedBets } from './wc26OddsApi';
import {
	wc26DividerSx,
	wc26SectionHeaderSx,
	wc26SlotRangeSx,
	wc26SlotRuleSx,
	wc26SlotTitleSx,
} from './wc26PageStyles';

const ROUNDS: Wc26GroupRound[] = [1, 2, 3];

type Props = {
	context: Wc26BettingContext;
};

export default function Wc26BetSlotsView({ context }: Props): JSX.Element {
	const { t, i18n } = useTranslation();
	const dateLocale = wc26DateLocale(i18n.language);
	const [userBets, setUserBets] = useState<Bet[]>([]);
	const [pickMatch, setPickMatch] = useState<{ match: Wc26Match; slotId: string } | null>(null);

	const canInteract = context.bettingEnabled && context.seasonParticipant;

	const loadBets = useCallback(async () => {
		if (!context.seasonId || !context.leagueId || !context.seasonParticipant) {
			setUserBets([]);
			return;
		}
		try {
			const bets = await getSelfOpenedBets(context.seasonId, context.leagueId);
			setUserBets(bets);
		} catch {
			setUserBets([]);
		}
	}, [context.seasonId, context.leagueId, context.seasonParticipant]);

	useEffect(() => {
		void loadBets();
	}, [loadBets]);

	const betsByScheduleId = useMemo(() => {
		const map = new Map<number, Bet>();
		for (const bet of userBets) {
			if (bet.wc26ScheduleId != null) {
				map.set(bet.wc26ScheduleId, bet);
			}
		}
		return map;
	}, [userBets]);

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
			{!context.bettingEnabled && (
				<Alert severity="info" sx={{ fontSize: '0.85rem' }}>
					{t('wc26.betSlots.bettingUnavailable')}
				</Alert>
			)}
			{context.bettingEnabled && !context.seasonParticipant && (
				<Alert severity="info" sx={{ fontSize: '0.85rem' }}>
					{t('wc26.betSlots.loginRequired')}
				</Alert>
			)}

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
										{matches.map((match) => {
											const hasBet = Boolean(betsByScheduleId.get(match.id));
											const clickable = canInteract && !hasBet;

											return (
												<Wc26MatchCard
													key={match.id}
													match={match}
													userBet={betsByScheduleId.get(match.id)}
													clickable={clickable}
													onClick={
														clickable
															? () => setPickMatch({ match, slotId: slot.id })
															: undefined
													}
												/>
											);
										})}
									</Stack>
								</Box>
							);
						})}
					</Stack>
				</Box>
			))}

			{pickMatch && (
				<Wc26OddsPickDialog
					open
					onClose={() => setPickMatch(null)}
					match={pickMatch.match}
					slotId={pickMatch.slotId}
					context={context}
					onBetPlaced={() => void loadBets()}
				/>
			)}
		</Stack>
	);
}
