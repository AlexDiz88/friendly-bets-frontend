import {
	Avatar,
	Box,
	Button,
	CircularProgress,
	Dialog,
	Typography,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import OddsMarketGroupAccordion, {
	type OddsRowSelection,
} from './OddsMarketGroupAccordion';
import OddsNestedMarketGroupAccordion from './OddsNestedMarketGroupAccordion';
import { formatPickOdds } from './formatPickOdds';
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
import ThemeModeToggle from '../../theme/ThemeModeToggle';
import {
	oddsPickDialogBodySx,
	oddsPickDialogCloseBtnSx,
	oddsPickDialogHeaderActionsSx,
	oddsPickDialogHeaderSx,
	oddsPickDialogThemeToggleSx,
	oddsPickDialogPaperSx,
	oddsPickDialogRootSx,
	oddsPickDialogTeamAvatarSx,
	oddsPickDialogHomeTeamNameSx,
	oddsPickDialogAwayTeamNameSx,
	oddsPickDialogTeamsRowSx,
	oddsPickDialogTitleRowSx,
	oddsPickDialogTitleSx,
	oddsPickDialogVsSx,
	oddsPickConfirmBetLabelSx,
	oddsPickConfirmBetRowSx,
	oddsPickConfirmBetTitleSx,
	oddsPickConfirmOddsSx,
	oddsPickConfirmProcessingOverlaySx,
	oddsPickConfirmProcessingSpinnerRingSx,
	oddsPickConfirmProcessingSpinnerSx,
	oddsPickConfirmProcessingTextSx,
	oddsPickConfirmProcessingWrapSx,
	oddsPickConfirmSummaryDimmedSx,
	oddsPickConfirmSummarySx,
	oddsPickConfirmTeamAvatarSx,
	oddsPickConfirmTeamNameSx,
	oddsPickConfirmTeamSideSx,
	oddsPickConfirmTeamsRowSx,
	oddsPickConfirmVsSx,
	oddsPickEmptySx,
} from './oddsPickDialogStyles';

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
			dispatch(showSuccessSnackbar({ message: t('wc26.oddsPick.success') }));
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

	const confirmOddsText = useMemo(() => {
		if (!selection) {
			return '';
		}
		return formatPickOdds(selection.clientOdds);
	}, [selection]);

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				fullScreen={fullScreen}
				maxWidth="sm"
				fullWidth
				PaperProps={{ sx: oddsPickDialogPaperSx(fullScreen) }}
			>
				<Box sx={oddsPickDialogRootSx}>
					<Box sx={oddsPickDialogHeaderSx}>
						<Box sx={oddsPickDialogTitleRowSx}>
							<Typography component="h2" sx={oddsPickDialogTitleSx}>
								{t('wc26.oddsPick.title')}
							</Typography>
							<Box sx={oddsPickDialogHeaderActionsSx}>
								<ThemeModeToggle iconButtonSx={oddsPickDialogThemeToggleSx} />
								<Button onClick={onClose} sx={oddsPickDialogCloseBtnSx}>
									{t('close')}
								</Button>
							</Box>
						</Box>
						<Box sx={oddsPickDialogTeamsRowSx}>
							<Typography sx={oddsPickDialogHomeTeamNameSx}>
								{resolveTeamDisplayName(homeTeam, t, i18n.language)}
							</Typography>
							<Avatar
								variant="square"
								src={resolveTeamLogoUrl(homeTeam)}
								sx={oddsPickDialogTeamAvatarSx}
							/>
							<Typography sx={oddsPickDialogVsSx}>—</Typography>
							<Avatar
								variant="square"
								src={resolveTeamLogoUrl(awayTeam)}
								sx={oddsPickDialogTeamAvatarSx}
							/>
							<Typography sx={oddsPickDialogAwayTeamNameSx}>
								{resolveTeamDisplayName(awayTeam, t, i18n.language)}
							</Typography>
						</Box>
					</Box>

					<Box sx={oddsPickDialogBodySx}>
						{loading ? (
							<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
								<CircularProgress
									size={32}
									sx={(t) => ({
										color: t.palette.mode === 'dark' ? '#9de8c4' : '#046a3d',
									})}
								/>
							</Box>
						) : markets && markets.marketGroups.length > 0 ? (
							markets.marketGroups.map((group) =>
								group.subgroups && group.subgroups.length > 0 ? (
									<OddsNestedMarketGroupAccordion
										key={group.groupKey}
										group={group}
										bookmakers={markets.bookmakers}
										displayMode="best"
										pickMode
										selectable
										onSelect={handleSelect}
									/>
								) : (
									<OddsMarketGroupAccordion
										key={group.groupKey}
										group={group}
										bookmakers={markets.bookmakers}
										displayMode="best"
										pickMode
										selectable
										onSelect={handleSelect}
									/>
								)
							)
						) : (
							<Typography sx={oddsPickEmptySx}>{t('wc26.oddsPick.noMarkets')}</Typography>
						)}
					</Box>
				</Box>
			</Dialog>

			<CustomCalendarDialog
				open={confirmOpen}
				onClose={() => !submitting && setConfirmOpen(false)}
				onSave={() => void handleConfirm()}
				title={submitting ? t('wc26.oddsPick.submittingTitle') : undefined}
				helperText={submitting ? t('wc26.oddsPick.submittingHelper') : t('wc26.oddsPick.confirmHelper')}
				contentWidth="min(18rem, calc(100vw - 2.5rem))"
				disableTextSelection
				submitting={submitting}
				submittingButtonText={t('wc26.oddsPick.submittingButton')}
				summaryComponent={
					selection ? (
						<Box sx={oddsPickConfirmProcessingWrapSx}>
							<Box
								sx={
									(submitting
										? [oddsPickConfirmSummarySx, oddsPickConfirmSummaryDimmedSx]
										: oddsPickConfirmSummarySx) as SxProps<Theme>
								}
							>
								<Box sx={oddsPickConfirmTeamsRowSx}>
									<Box sx={oddsPickConfirmTeamSideSx}>
										<Avatar
											variant="square"
											src={resolveTeamLogoUrl(homeTeam)}
											sx={oddsPickConfirmTeamAvatarSx}
										/>
										<Typography sx={oddsPickConfirmTeamNameSx}>
											{resolveTeamDisplayName(homeTeam, t, i18n.language)}
										</Typography>
									</Box>
									<Typography sx={oddsPickConfirmVsSx}>—</Typography>
									<Box sx={oddsPickConfirmTeamSideSx}>
										<Avatar
											variant="square"
											src={resolveTeamLogoUrl(awayTeam)}
											sx={oddsPickConfirmTeamAvatarSx}
										/>
										<Typography sx={oddsPickConfirmTeamNameSx}>
											{resolveTeamDisplayName(awayTeam, t, i18n.language)}
										</Typography>
									</Box>
								</Box>
								<Box sx={oddsPickConfirmBetRowSx}>
									<Typography component="span" sx={oddsPickConfirmBetLabelSx}>
										{t('wc26.oddsPick.betLabel')}
									</Typography>
									<Typography component="span" sx={oddsPickConfirmBetTitleSx}>
										{selection.displayLabel}
									</Typography>
								</Box>
								<Typography component="p" sx={oddsPickConfirmOddsSx}>
									{confirmOddsText}
								</Typography>
							</Box>
							{submitting ? (
								<Box sx={oddsPickConfirmProcessingOverlaySx}>
									<Box sx={oddsPickConfirmProcessingSpinnerRingSx}>
										<CircularProgress size={36} thickness={4} sx={oddsPickConfirmProcessingSpinnerSx} />
									</Box>
									<Typography sx={oddsPickConfirmProcessingTextSx}>
										{t('wc26.oddsPick.submitting')}
									</Typography>
								</Box>
							) : null}
						</Box>
					) : undefined
				}
			/>
		</>
	);
}
