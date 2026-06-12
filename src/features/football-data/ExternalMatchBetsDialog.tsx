import {
	Avatar,
	Box,
	CircularProgress,
	Dialog,
	Typography,
} from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import CustomCancelButton from '../../components/custom/btn/CustomCancelButton';
import { avatarBase64Converter } from '../../components/utils/imgBase64Converter';
import { getFullBetTitle } from '../../components/utils/stringTransform';
import { formatPickOdds } from '../../components/odds/formatPickOdds';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import {
	BET_STATUS_LOST,
	BET_STATUS_RETURNED,
	BET_STATUS_WON,
	COMPLETED_BET_STATUSES,
} from '../../constants';
import BetStatusIcon from '../bets/BetStatusIcon';
import { getMatchBets } from '../bets/api';
import Bet from '../bets/types/Bet';
import Wc26TeamFlag from '../world-cup-2026/Wc26TeamFlag';
import { findWc26ScheduleMatchForExternal } from '../world-cup-2026/wc26BetSlots';
import { matchSideToDisplayTeam } from './externalMatchDisplay';
import { getExternalMatchScoreView, trustExternalLiveScore } from './externalMatchScoreView';
import type { ExternalMatch } from './types/ExternalMatch';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import {
	externalMatchBetsDialogBodySx,
	externalMatchBetsDialogCountSx,
	externalMatchBetsDialogEmptySx,
	externalMatchBetsDialogFooterSx,
	externalMatchBetsDialogHeaderSx,
	externalMatchBetsDialogListSx,
	externalMatchBetsDialogLoadingSx,
	externalMatchBetsDialogOddsSx,
	externalMatchBetsDialogOverlineSx,
	externalMatchBetsDialogOverlineTextSx,
	externalMatchBetsDialogPaperSx,
	externalMatchBetsDialogPickCellSx,
	externalMatchBetsDialogPickSx,
	externalMatchBetsDialogPlayerSx,
	externalMatchBetsDialogRowSx,
	externalMatchBetsDialogScoreSx,
	externalMatchBetsDialogStatusCellSx,
	externalMatchBetsDialogTeamLogoSx,
	externalMatchBetsDialogTeamNameSx,
	externalMatchBetsDialogTeamSideAwaySx,
	externalMatchBetsDialogTeamSideHomeSx,
	externalMatchBetsDialogTeamsRowSx,
} from './externalMatchBetsDialogStyles';

type Props = {
	open: boolean;
	onClose: () => void;
	match: ExternalMatch;
	seasonId: string;
	leagueId: string;
	matchDay: string;
	currentUserId?: string;
};

function resolveBetStatusTint(
	matchFinalized: boolean,
	betStatus: string
): 'won' | 'lost' | 'returned' | null {
	if (!matchFinalized || !COMPLETED_BET_STATUSES.includes(betStatus)) {
		return null;
	}
	if (betStatus === BET_STATUS_WON) {
		return 'won';
	}
	if (betStatus === BET_STATUS_RETURNED) {
		return 'returned';
	}
	if (betStatus === BET_STATUS_LOST) {
		return 'lost';
	}
	return null;
}

export default function ExternalMatchBetsDialog({
	open,
	onClose,
	match,
	seasonId,
	leagueId,
	matchDay,
	currentUserId,
}: Props): JSX.Element {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(false);
	const [bets, setBets] = useState<Bet[]>([]);

	const scheduled = useMemo(
		() => findWc26ScheduleMatchForExternal(match, matchDay),
		[match, matchDay]
	);
	const homeTeam = matchSideToDisplayTeam(match, 'home');
	const awayTeam = matchSideToDisplayTeam(match, 'away');
	const matchFinalized = Boolean(match.finalized);
	const scoreView = getExternalMatchScoreView(
		match.gameScore ?? null,
		match.status,
		matchFinalized,
		trustExternalLiveScore(match.gameScore ?? null, match.status, match.liveMinuteLabel)
	);

	const sortedBets = useMemo(() => {
		if (!currentUserId) {
			return bets;
		}
		const yours = bets.filter((bet) => bet.player?.id === currentUserId);
		const others = bets.filter((bet) => bet.player?.id !== currentUserId);
		return [...yours, ...others];
	}, [bets, currentUserId]);

	const loadBets = useCallback(async (): Promise<void> => {
		if (!open || !match.homeTeamId || !match.awayTeamId) {
			return;
		}
		setLoading(true);
		setBets([]);
		try {
			const { bets: matchBets } = await getMatchBets(
				seasonId,
				leagueId,
				matchDay,
				match.homeTeamId,
				match.awayTeamId
			);
			setBets(matchBets);
		} catch (e) {
			dispatch(
				showErrorSnackbar({
					message: e instanceof Error ? e.message : 'unknownError',
				})
			);
			onClose();
		} finally {
			setLoading(false);
		}
	}, [
		open,
		match.homeTeamId,
		match.awayTeamId,
		seasonId,
		leagueId,
		matchDay,
		dispatch,
		onClose,
	]);

	useEffect(() => {
		void loadBets();
	}, [loadBets]);

	const renderTeamSide = (side: 'home' | 'away'): JSX.Element => {
		if (scheduled?.home && scheduled?.away) {
			return (
				<Box
					sx={
						side === 'home'
							? { ...externalMatchBetsDialogTeamSideHomeSx, pr: 0.25 }
							: { ...externalMatchBetsDialogTeamSideAwaySx, pl: 0.25 }
					}
				>
					<Wc26TeamFlag
						teamId={side === 'home' ? scheduled.home : scheduled.away}
						side={side}
						compact
					/>
				</Box>
			);
		}

		const team = side === 'home' ? homeTeam : awayTeam;
		const name = resolveTeamDisplayName(team, t, i18n.language);
		const sideSx =
			side === 'home' ? externalMatchBetsDialogTeamSideHomeSx : externalMatchBetsDialogTeamSideAwaySx;

		return (
			<Box
				sx={
					[
						sideSx,
						{ gap: 0.45 },
						side === 'home' ? { pr: 0.25 } : { pl: 0.25 },
					] as SxProps<Theme>
				}
			>
				{side === 'home' ? (
					<>
						<Typography
							sx={
								[externalMatchBetsDialogTeamNameSx, { textAlign: 'right' }] as SxProps<Theme>
							}
						>
							{name}
						</Typography>
						<Avatar
							variant="square"
							src={resolveTeamLogoUrl(team)}
							alt=""
							sx={externalMatchBetsDialogTeamLogoSx}
						/>
					</>
				) : (
					<>
						<Avatar
							variant="square"
							src={resolveTeamLogoUrl(team)}
							alt=""
							sx={externalMatchBetsDialogTeamLogoSx}
						/>
						<Typography
							sx={
								[externalMatchBetsDialogTeamNameSx, { textAlign: 'left' }] as SxProps<Theme>
							}
						>
							{name}
						</Typography>
					</>
				)}
			</Box>
		);
	};

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth={false}
			PaperProps={{ sx: externalMatchBetsDialogPaperSx }}
			aria-labelledby="external-match-bets-dialog-title"
		>
			<Box sx={externalMatchBetsDialogHeaderSx}>
				<Box sx={externalMatchBetsDialogOverlineSx}>
					<Typography
						id="external-match-bets-dialog-title"
						component="span"
						sx={externalMatchBetsDialogOverlineTextSx}
					>
						{t('wc26.externalResults.matchBets.overline')}
					</Typography>
				</Box>
				<Box sx={externalMatchBetsDialogTeamsRowSx}>
					{renderTeamSide('home')}
					<Typography sx={externalMatchBetsDialogScoreSx}>{scoreView}</Typography>
					{renderTeamSide('away')}
				</Box>
				{!loading && bets.length > 0 ? (
					<Typography sx={externalMatchBetsDialogCountSx}>
						{t('wc26.externalResults.matchBets.count', { count: bets.length })}
					</Typography>
				) : null}
			</Box>

			<Box sx={externalMatchBetsDialogBodySx}>
				{loading ? (
					<Box sx={externalMatchBetsDialogLoadingSx}>
						<CircularProgress size={26} sx={{ color: '#00824b' }} />
					</Box>
				) : sortedBets.length === 0 ? (
					<Typography sx={externalMatchBetsDialogEmptySx}>
						{t('wc26.externalResults.matchBets.empty')}
					</Typography>
				) : (
					<Box sx={externalMatchBetsDialogListSx}>
						{sortedBets.map((bet) => {
							const isYou = Boolean(currentUserId && bet.player?.id === currentUserId);
							const pickLabel =
								bet.betTitle != null && bet.betOdds != null
									? getFullBetTitle(bet.betTitle)
									: null;
							const showStatus = COMPLETED_BET_STATUSES.includes(bet.betStatus);
							const statusTint = resolveBetStatusTint(matchFinalized, bet.betStatus);
							const playerName = bet.player?.username ?? '—';
							return (
								<Box key={bet.id} sx={externalMatchBetsDialogRowSx(isYou, statusTint)}>
									<Avatar
										src={avatarBase64Converter(bet.player?.avatar)}
										alt=""
										sx={{
											width: 22,
											height: 22,
											fontSize: '0.6rem',
											border: '1px solid',
											borderColor: isYou
												? 'rgba(255, 214, 0, 0.55)'
												: 'rgba(0, 130, 75, 0.25)',
										}}
									/>
									<Typography sx={externalMatchBetsDialogPlayerSx}>{playerName}</Typography>
									{pickLabel != null && bet.betOdds != null ? (
										<Box sx={externalMatchBetsDialogPickCellSx}>
											<Typography sx={externalMatchBetsDialogPickSx} title={pickLabel}>
												{pickLabel}
											</Typography>
											<Box component="span" sx={externalMatchBetsDialogOddsSx}>
												{formatPickOdds(bet.betOdds)}
											</Box>
										</Box>
									) : (
										<Box />
									)}
									<Box sx={externalMatchBetsDialogStatusCellSx}>
										{showStatus ? (
											<BetStatusIcon betStatus={bet.betStatus} size="compact" withTooltip />
										) : null}
									</Box>
								</Box>
							);
						})}
					</Box>
				)}
			</Box>

			<Box sx={externalMatchBetsDialogFooterSx}>
				<CustomCancelButton onClick={onClose} buttonText={t('close')} sx={{ minWidth: 120 }} />
			</Box>
		</Dialog>
	);
};
