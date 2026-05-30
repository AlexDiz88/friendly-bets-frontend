import {
	Box,
	Chip,
	CircularProgress,
	Dialog,
	DialogContent,
	DialogTitle,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import OddsMarketGroupAccordion, {
	type OddsRowSelection,
} from '../../components/odds/OddsMarketGroupAccordion';
import { OddsEventMarkets } from '../../components/odds/oddsTypes';
import CustomCalendarDialog from '../../components/custom/dialog/CustomCalendarDialog';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import type { Wc26Match } from './wc26Schedule';
import type { Wc26BettingContext } from '../../components/odds/oddsTypes';
import {
	getOddsEventMarkets,
	lookupWc26GameResult,
	placeBetFromOdds,
} from './wc26OddsApi';
import Wc26MatchCard from './Wc26MatchCard';
import { wc26DialogPaperSx } from './wc26PageStyles';

type Props = {
	open: boolean;
	onClose: () => void;
	match: Wc26Match;
	slotId: string;
	context: Wc26BettingContext;
	onBetPlaced: () => void;
};

export default function Wc26OddsPickDialog({
	open,
	onClose,
	match,
	slotId,
	context,
	onBetPlaced,
}: Props): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [loading, setLoading] = useState(false);
	const [markets, setMarkets] = useState<OddsEventMarkets | null>(null);
	const [selection, setSelection] = useState<OddsRowSelection | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [gameResultId, setGameResultId] = useState<string | null>(null);

	const canBet = Boolean(
		context.bettingEnabled && context.seasonParticipant && context.seasonId && context.leagueId
	);

	const loadMarkets = useCallback(async () => {
		if (!open || !canBet || !context.seasonId || !match.id) {
			return;
		}
		setLoading(true);
		setMarkets(null);
		setSelection(null);
		try {
			const lookup = await lookupWc26GameResult(context.seasonId, match.id, slotId);
			setGameResultId(lookup.gameResultId);
			const data = await getOddsEventMarkets(lookup.gameResultId);
			setMarkets(data);
		} catch (e) {
			dispatch(
				showErrorSnackbar({
					message: e instanceof Error ? e.message : 'unknownError',
				})
			);
		} finally {
			setLoading(false);
		}
	}, [open, canBet, context.seasonId, match.id, slotId, dispatch]);

	useEffect(() => {
		void loadMarkets();
	}, [loadMarkets]);

	const handleSelect = (row: OddsRowSelection) => {
		setSelection(row);
		setConfirmOpen(true);
	};

	const handleConfirm = async () => {
		if (!selection || !context.seasonId || !gameResultId) {
			return;
		}
		setSubmitting(true);
		try {
			await placeBetFromOdds(
				{
					wc26ScheduleId: match.id,
					matchDay: slotId,
					selectionKey: selection.selectionKey,
					bookmaker: selection.bookmaker,
					clientOdds: selection.clientOdds,
				},
				`${match.id}-${slotId}-${selection.selectionKey}-${selection.bookmaker}`
			);
			dispatch(showSuccessSnackbar({ message: 'wc26.oddsPick.success' }));
			setConfirmOpen(false);
			onBetPlaced();
			onClose();
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			if (message === 'oddsChangedRetry') {
				void loadMarkets();
			}
			dispatch(showErrorSnackbar({ message }));
			setConfirmOpen(false);
		} finally {
			setSubmitting(false);
		}
	};

	const summary = useMemo(() => {
		if (!selection) {
			return null;
		}
		return (
			<Box sx={{ fontSize: '0.9rem' }}>
				<Typography variant="body2" sx={{ mb: 0.5 }}>
					{t(`oddsDemo.groups.${selection.groupKey}`, selection.groupKey)}
				</Typography>
				<Typography variant="body2">
					{selection.displayLabel}
					{selection.line ? ` (${selection.line})` : ''}
				</Typography>
				<Typography variant="body2" sx={{ mt: 0.5 }}>
					{t('wc26.oddsPick.oddsLine', {
						odds: selection.clientOdds,
						bookmaker: selection.bookmaker,
					})}
				</Typography>
			</Box>
		);
	}, [selection, t]);

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				fullScreen={fullScreen}
				maxWidth="sm"
				fullWidth
				PaperProps={{ sx: wc26DialogPaperSx }}
			>
				<DialogTitle sx={{ pb: 0.5 }}>{t('wc26.oddsPick.title')}</DialogTitle>
				<DialogContent>
					<Box sx={{ mb: 1.5 }}>
						<Wc26MatchCard match={match} />
					</Box>
					{!canBet && (
						<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
							{t('wc26.betSlots.loginRequired')}
						</Typography>
					)}
					{loading && (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
							<CircularProgress size={28} />
						</Box>
					)}
					{!loading && markets && (
						<Box>
							{markets.marketGroups.map((group) => (
								<OddsMarketGroupAccordion
									key={group.groupKey + group.category}
									group={group}
									bookmakers={markets.bookmakers}
									displayMode="best"
									selectable={canBet}
									selectedKey={selection?.selectionKey}
									selectedBookmaker={selection?.bookmaker}
									onSelect={handleSelect}
									disabled={submitting}
								/>
							))}
						</Box>
					)}
				</DialogContent>
			</Dialog>

			<CustomCalendarDialog
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onSave={() => void handleConfirm()}
				title={t('wc26.oddsPick.confirmTitle')}
				helperText={t('wc26.oddsPick.confirmHelper')}
				summaryComponent={summary ?? undefined}
				buttonAcceptText={t('btnText.accept')}
			/>
		</>
	);
}
