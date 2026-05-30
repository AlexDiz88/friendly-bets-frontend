import { Alert, Box, CircularProgress, Stack, Typography, type SxProps, type Theme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Bet from '../bets/types/Bet';
import { ExternalMatch } from '../football-data/types/ExternalMatch';
import { Wc26BettingContext } from '../../components/odds/oddsTypes';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import { useAppDispatch } from '../../app/hooks';
import Wc26BetMatchCard from './Wc26BetMatchCard';
import Wc26OddsPickDialog from './Wc26OddsPickDialog';
import { formatSlotUtcRange, Wc26BettingSlot } from './wc26BetBoard';
import { wc26DateLocale } from './wc26Time';
import { getSelfOpenedBets, getWc26GroupStageBoard } from './wc26OddsApi';
import {
	wc26DividerSx,
	wc26SectionHeaderSx,
	wc26SlotRangeSx,
	wc26SlotRuleSx,
	wc26SlotTitleSx,
} from './wc26PageStyles';

const ROUNDS = [1, 2, 3] as const;

type Props = {
	context: Wc26BettingContext;
};

function betMatchesGame(bet: Bet, match: ExternalMatch): boolean {
	if (bet.gameResultId && match.id) {
		return bet.gameResultId === match.id;
	}
	return (
		bet.homeTeam?.id != null &&
		bet.awayTeam?.id != null &&
		bet.homeTeam.id === match.homeTeamId &&
		bet.awayTeam.id === match.awayTeamId
	);
}

export default function Wc26BetSlotsView({ context }: Props): JSX.Element {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const dateLocale = wc26DateLocale(i18n.language);
	const [userBets, setUserBets] = useState<Bet[]>([]);
	const [slots, setSlots] = useState<Wc26BettingSlot[]>([]);
	const [loading, setLoading] = useState(false);
	const [pick, setPick] = useState<{ match: ExternalMatch; slotId: string } | null>(null);

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

	const loadBoard = useCallback(async () => {
		if (!context.seasonId) {
			setSlots([]);
			return;
		}
		setLoading(true);
		try {
			const board = await getWc26GroupStageBoard(context.seasonId);
			setSlots(board.slots);
		} catch (e) {
			setSlots([]);
			dispatch(
				showErrorSnackbar({
					message: e instanceof Error ? e.message : 'unknownError',
				})
			);
		} finally {
			setLoading(false);
		}
	}, [context.seasonId, dispatch]);

	useEffect(() => {
		void loadBoard();
	}, [loadBoard]);

	useEffect(() => {
		void loadBets();
	}, [loadBets]);

	const slotsByRound = useMemo(() => {
		const map = new Map<number, Wc26BettingSlot[]>();
		for (const round of ROUNDS) {
			map.set(
				round,
				slots.filter((s) => s.round === round)
			);
		}
		return map;
	}, [slots]);

	const findBetForMatch = useCallback(
		(match: ExternalMatch, slotId: string): Bet | undefined =>
			userBets.find((b) => b.matchDay === slotId && betMatchesGame(b, match)),
		[userBets]
	);

	if (loading && slots.length === 0) {
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
				<CircularProgress size={32} />
			</Box>
		);
	}

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
							const range = formatSlotUtcRange(slot, dateLocale);

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
									{slot.matches.length === 0 ? (
										<Typography variant="caption" color="text.secondary" sx={{ px: 0.5, pb: 1 }}>
											{t('wc26.betSlots.noMatchesInSlot')}
										</Typography>
									) : (
										<Stack spacing={0} divider={<Box sx={wc26DividerSx} />}>
											{slot.matches.map((match) => {
												const userBet = findBetForMatch(match, slot.id);
												const hasBet = Boolean(userBet);
												const clickable =
													canInteract && !hasBet && Boolean(match.id);

												return (
													<Wc26BetMatchCard
														key={match.id ?? `${match.homeTeamId}-${match.awayTeamId}`}
														match={match}
														userBet={userBet}
														clickable={clickable}
														onClick={
															clickable
																? () => setPick({ match, slotId: slot.id })
																: undefined
														}
													/>
												);
											})}
										</Stack>
									)}
								</Box>
							);
						})}
					</Stack>
				</Box>
			))}

			{pick && pick.match.id && (
				<Wc26OddsPickDialog
					open
					onClose={() => setPick(null)}
					gameResultId={pick.match.id}
					match={pick.match}
					slotId={pick.slotId}
					context={context}
					onBetPlaced={() => {
						void loadBets();
						void loadBoard();
					}}
				/>
			)}
		</Stack>
	);
}
