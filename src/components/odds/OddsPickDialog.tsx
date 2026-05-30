import {
	Avatar,
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
} from './OddsMarketGroupAccordion';
import { OddsEventMarkets } from './oddsTypes';
import CustomCalendarDialog from '../custom/dialog/CustomCalendarDialog';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../custom/snackbar/snackbarSlice';
import { getOddsEventMarkets } from '../../features/football-data/matchOddsApi';
import { addOpenedBet } from '../../features/bets/betsSlice';
import { ExternalMatch } from '../../features/football-data/types/ExternalMatch';
import { matchSideToDisplayTeam } from '../../features/football-data/externalMatchDisplay';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../utils/teamDisplay';

type Props = {
	open: boolean;
	onClose: () => void;
	gameResultId: string;
	match: ExternalMatch;
	seasonId: string;
	leagueId: string;
	matchDay: string;
	calendarNodeId: string;
	betSize: number;
	userId: string;
	onBetPlaced: () => void;
};

export default function OddsPickDialog({
	open,
	onClose,
	gameResultId,
	match,
	seasonId,
	leagueId,
	matchDay,
	calendarNodeId,
	betSize,
	userId,
	onBetPlaced,
}: Props): JSX.Element {
	const { t, i18n } = useTranslation();
	const dispatch = useAppDispatch();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	const [loading, setLoading] = useState(false);
	const [markets, setMarkets] = useState<OddsEventMarkets | null>(null);
	const [selection, setSelection] = useState<OddsRowSelection | null>(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const homeTeam = matchSideToDisplayTeam(match, 'home');
	const awayTeam = matchSideToDisplayTeam(match, 'away');

	const loadMarkets = useCallback(async () => {
		if (!open || !gameResultId) {
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
	}, [open, gameResultId, dispatch]);

	useEffect(() => {
		void loadMarkets();
	}, [loadMarkets]);

	const handleSelect = (row: OddsRowSelection) => {
		setSelection(row);
		setConfirmOpen(true);
	};

	const handleConfirm = async () => {
		if (!selection?.betTitle) {
			return;
		}
		setSubmitting(true);
		try {
			const result = await dispatch(
				addOpenedBet({
					newOpenedBet: {
						seasonId,
						leagueId,
						userId,
						matchDay,
						homeTeamId: markets?.homeTeamId ?? match.homeTeamId ?? '',
						awayTeamId: markets?.awayTeamId ?? match.awayTeamId ?? '',
						betTitle: selection.betTitle,
						betOdds: selection.clientOdds,
						betSize,
						calendarNodeId,
					},
				})
			);
			if (addOpenedBet.rejected.match(result)) {
				throw new Error(result.error.message ?? 'unknownError');
			}
			dispatch(showSuccessSnackbar({ message: 'wc26.oddsPick.success' }));
			setConfirmOpen(false);
			onBetPlaced();
			onClose();
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			dispatch(showErrorSnackbar({ message }));
			if (message === 'betAlreadyAdded') {
				onBetPlaced();
			}
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
			<Dialog open={open} onClose={onClose} fullScreen={fullScreen} maxWidth="sm" fullWidth>
				<DialogTitle sx={{ pb: 0.5 }}>{t('wc26.oddsPick.title')}</DialogTitle>
				<DialogContent>
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							gap: 1,
							mb: 1.5,
							py: 0.5,
						}}
					>
						<Typography variant="body2" sx={{ flex: 1, textAlign: 'right', fontWeight: 600 }}>
							{resolveTeamDisplayName(homeTeam, t, i18n.language)}
						</Typography>
						<Avatar
							variant="square"
							src={resolveTeamLogoUrl(homeTeam)}
							sx={{ width: 28, height: 28 }}
						/>
						<Typography variant="body2" sx={{ px: 0.5, fontWeight: 700 }}>
							—
						</Typography>
						<Avatar
							variant="square"
							src={resolveTeamLogoUrl(awayTeam)}
							sx={{ width: 28, height: 28 }}
						/>
						<Typography variant="body2" sx={{ flex: 1, fontWeight: 600 }}>
							{resolveTeamDisplayName(awayTeam, t, i18n.language)}
						</Typography>
					</Box>
					{loading ? (
						<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
							<CircularProgress size={28} />
						</Box>
					) : markets && markets.marketGroups.length > 0 ? (
						markets.marketGroups.map((group) => (
							<OddsMarketGroupAccordion
								key={group.groupKey}
								group={group}
								bookmakers={markets.bookmakers}
								displayMode="best"
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
				onClose={() => !submitting && setConfirmOpen(false)}
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
