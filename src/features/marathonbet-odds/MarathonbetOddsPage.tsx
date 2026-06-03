import {
	Alert,
	Box,
	CircularProgress,
	Link,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import { selectUser } from '../auth/selectors';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import {
	oddsDemoHintSx,
	oddsDemoPageRootSx,
	oddsDemoPanelSx,
	oddsDemoTitleSx,
	oddsDemoToolbarRowSx,
} from '../odds-demo/oddsDemoPageStyles';
import { scrapeMarathonbetEvent, type MarathonbetMarket, type MarathonbetScrapeResult } from './marathonbetOddsApi';

const DEFAULT_TREE_ID = '25819358';

function formatUtc(iso: string | null): string {
	if (!iso) return '—';
	try {
		return new Date(iso).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
	} catch {
		return iso;
	}
}

function MarketsTable({ markets }: { markets: MarathonbetMarket[] }): JSX.Element {
	const { t } = useTranslation();
	if (markets.length === 0) {
		return (
			<Typography variant="body2" color="text.secondary">
				—
			</Typography>
		);
	}
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
			{markets.map((market, idx) => (
				<Box key={`${market.model}-${idx}`}>
					<Typography variant="subtitle2" sx={{ mb: 0.75 }}>
						{market.name || market.model}
					</Typography>
					<Table size="small">
						<TableHead>
							<TableRow>
								<TableCell>{t('marathonbetOdds.selection')}</TableCell>
								<TableCell align="right">{t('marathonbetOdds.odds')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{market.selections.map((sel) => (
								<TableRow key={`${sel.name}-${sel.odds}`}>
									<TableCell>{sel.name}</TableCell>
									<TableCell align="right">{sel.odds ?? '—'}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Box>
			))}
		</Box>
	);
}

export default function MarathonbetOddsPage(): JSX.Element | null {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const isStaff = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const [treeIdInput, setTreeIdInput] = useState(DEFAULT_TREE_ID);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<MarathonbetScrapeResult | null>(null);

	const handleFetch = useCallback(async () => {
		const treeId = Number.parseInt(treeIdInput.trim(), 10);
		if (!Number.isFinite(treeId) || treeId <= 0) {
			dispatch(showErrorSnackbar({ message: 'marathonbetInvalidTreeId' }));
			return;
		}
		setLoading(true);
		try {
			const result = await scrapeMarathonbetEvent(treeId);
			setData(result);
		} catch (e) {
			const message = e instanceof Error ? e.message : 'unknownError';
			dispatch(showErrorSnackbar({ message }));
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [dispatch, treeIdInput]);

	if (!isStaff) {
		return null;
	}

	return (
		<Box sx={oddsDemoPageRootSx}>
			<Typography component="h1" sx={oddsDemoTitleSx}>
				{t('marathonbetOdds.title')}
			</Typography>
			<Box sx={oddsDemoHintSx}>{t('marathonbetOdds.hint')}</Box>

			<Box sx={oddsDemoPanelSx(theme)}>
				<Box sx={oddsDemoToolbarRowSx}>
					<TextField
						size="small"
						label={t('marathonbetOdds.treeId')}
						placeholder={t('marathonbetOdds.treeIdPlaceholder')}
						value={treeIdInput}
						onChange={(e) => setTreeIdInput(e.target.value)}
						sx={{ flex: 1, minWidth: 160 }}
					/>
					<CustomButton
						buttonText={t('marathonbetOdds.fetch')}
						onClick={() => void handleFetch()}
						disabled={loading}
					/>
				</Box>
				<Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
					{t('marathonbetOdds.defaultUrl')}{' '}
					<Link
						href="https://new.marathonbet.ru/su/sport/event/25819358"
						target="_blank"
						rel="noopener noreferrer"
					>
						new.marathonbet.ru
					</Link>
				</Typography>
			</Box>

			{loading && !data && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{!loading && !data && (
				<Typography color="text.secondary">{t('marathonbetOdds.noData')}</Typography>
			)}

			{data && (
				<>
					<Box sx={{ mb: 2 }}>
						<Box sx={oddsDemoPanelSx(theme)}>
						<Typography variant="subtitle1" sx={{ mb: 1 }}>
							{t('marathonbetOdds.eventInfo')}
						</Typography>
						<Typography variant="body1" fontWeight={600}>
							{data.homeTeam && data.awayTeam
								? `${data.homeTeam} — ${data.awayTeam}`
								: data.eventName ?? '—'}
						</Typography>
						<Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
							{t('marathonbetOdds.competition')}: {data.competitionHeader ?? '—'}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('marathonbetOdds.startTime')}: {formatUtc(data.startTime)}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							treeId: {data.treeId}
							{data.eventId != null ? ` · eventId: ${data.eventId}` : ''}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('marathonbetOdds.source')}:{' '}
							{data.sourceUrl ? (
								<Link href={data.sourceUrl} target="_blank" rel="noopener noreferrer">
									{data.sourceUrl}
								</Link>
							) : (
								'—'
							)}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							{t('marathonbetOdds.fetchedAt')}: {formatUtc(data.fetchedAt)}
						</Typography>
						</Box>
					</Box>

					{data.warnings.length > 0 && (
						<Alert severity="warning" sx={{ mb: 2 }}>
							<Typography variant="subtitle2">{t('marathonbetOdds.warnings')}</Typography>
							<ul style={{ margin: '4px 0 0', paddingLeft: 20 }}>
								{data.warnings.map((w) => (
									<li key={w}>
										{t(`marathonbetOdds.warning.${w}`, { defaultValue: w })}
									</li>
								))}
							</ul>
						</Alert>
					)}

					<Box sx={{ mb: 2 }}>
						<Box sx={oddsDemoPanelSx(theme)}>
						<Typography variant="subtitle1" sx={{ mb: 1.5 }}>
							{t('marathonbetOdds.matchResult')}
						</Typography>
						<MarketsTable markets={data.matchResultMarkets} />
						</Box>
					</Box>

					<Box sx={oddsDemoPanelSx(theme)}>
						<Typography variant="subtitle1" sx={{ mb: 1.5 }}>
							{t('marathonbetOdds.handicaps')} ({data.handicapMarkets.length})
						</Typography>
						<MarketsTable markets={data.handicapMarkets} />
					</Box>
				</>
			)}
		</Box>
	);
}
