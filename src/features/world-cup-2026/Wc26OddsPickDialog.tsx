import {
	Box,
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
import { ExternalMatch } from '../football-data/types/ExternalMatch';
import type { Wc26BettingContext } from '../../components/odds/oddsTypes';
import { getOddsEventMarkets, placeBetFromOdds } from './wc26OddsApi';
import Wc26BetMatchCard from './Wc26BetMatchCard';
import { wc26DialogPaperSx } from './wc26PageStyles';

type Props = {
	open: boolean;
	onClose: () => void;
	gameResultId: string;
	match: ExternalMatch;
	slotId: string;
	context: Wc26BettingContext;
	onBetPlaced: () => void;
};

export default function Wc26OddsPickDialog({
	open,
	onClose,
	gameResultId,
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

	const canBet = Boolean(
		context.bettingEnabled && context.seasonParticipant && context.seasonId && context.leagueId
	);

	const loadMarkets = useCallback(async () => {
		if (!open || !canBet || !gameResultId) {
			return;
		}
		setLoading(true);
		setMarkets(null);
		setSelection(null);
		try {
			const data = await getOddsEventMarkets(gameResultId);
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
	}, [open, canBet, gameResultId, dispatch]);

	useEffect(() => {
		void loadMarkets();
	}, [loadMarkets]);

	const handleSelect = (row: OddsRowSelection) => {
		setSelection(row);
		setConfirmOpen(true);
	};

	const handleConfirm = async () => {
		if (!selection || !context.seasonId) {
			return;
		}
		setSubmitting(true);
		try {
			await placeBetFromOdds(
				{
					gameResultId,
					matchDay: slotId,
					selectionKey: selection.selectionKey,
					bookmaker: selection.bookmaker,
					clientOdds: selection.clientOdds,
				},
				`${gameResultId}-${slotId}-${selection.selectionKey}-${selection.bookmaker}`
			);
			dispatch(showSuccessSnackbar({ message: 'wc26.oddsPick.success' }));
			setConfirmOpen(false);
			onBetPlaced();
			onClose();
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			dispatch(showErrorSnackbar({ message }));
		} finally {
			setSubmitting(false);
		}
	};

	const confirmHelper = useMemo(() => {
		if (!selection) {
			return '';
		}
		return t('wc26.oddsPick.oddsLine', {
			label: selection.displayLabel,
			odds: selection.clientOdds,
			bookmaker: selection.bookmaker,
		});
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
						<Wc26BetMatchCard match={match} />
					</Box>
					{!canBet ? (
						<Typography variant="body2" color="text.secondary">
							{t('wc26.betSlots.loginRequired')}
						</Typography>
					) : loading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
							<CircularProgress size={28} />
						</Box>
					) : markets && markets.marketGroups.length > 0 ? (
						markets.marketGroups.map((group) => (
							<OddsMarketGroupAccordion
								key={group.groupKey}
								group={group}
								bookmakers={markets.bookmakers}
								selectable
								onSelect={handleSelect}
							/>
						))
					) : (
						<Typography variant="body2" color="text.secondary">
							{t('wc26.oddsPick.noMarkets')}
						</Typography>
					)}
				</DialogContent>
			</Dialog>

			<CustomCalendarDialog
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onSave={() => void handleConfirm()}
				title={t('wc26.oddsPick.confirmTitle')}
				helperText={t('wc26.oddsPick.confirmHelper')}
				summaryComponent={
					confirmHelper ? (
						<Typography variant="body2" sx={{ mt: 1 }}>
							{confirmHelper}
						</Typography>
					) : undefined
				}
			/>
		</>
	);
}
