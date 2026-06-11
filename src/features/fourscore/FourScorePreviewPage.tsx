import {
	Alert,
	Box,
	Chip,
	CircularProgress,
	Link,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
	useTheme,
} from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import {
	oddsDemoHintSx,
	oddsDemoPageRootSx,
	oddsDemoPanelSx,
	oddsDemoTitleSx,
	oddsDemoToolbarRowSx,
} from '../odds-demo/oddsDemoPageStyles';
import { fetchFourScorePreview, type FourScorePreviewMatch } from './fourscoreApi';

const FOURSCORE_BASE = 'https://4score.ru';
const PAGE_ROOT_SX = { ...oddsDemoPageRootSx, maxWidth: 1440 };

type SectionFilter = 'ALL' | 'WORLD_CUP' | 'FRIENDLIES';

function todayIso(): string {
	return new Date().toISOString().slice(0, 10);
}

function dash(value: string | null | undefined): string {
	return value && value.trim() !== '' ? value : '—';
}

function mappingCell(mapped: boolean, externalName: string, teamTitle: string | null): JSX.Element {
	if (mapped && teamTitle) {
		return (
			<Typography component="span" variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
				{teamTitle}
			</Typography>
		);
	}
	return (
		<Typography component="span" variant="body2" color="text.secondary">
			{externalName}
			<Typography component="span" variant="caption" color="error.main" sx={{ display: 'block' }}>
				—
			</Typography>
		</Typography>
	);
}

export default function FourScorePreviewPage(): JSX.Element {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const [date, setDate] = useState(todayIso);
	const [loading, setLoading] = useState(false);
	const [matches, setMatches] = useState<FourScorePreviewMatch[]>([]);
	const [sectionFilter, setSectionFilter] = useState<SectionFilter>('ALL');

	const load = useCallback(async (): Promise<void> => {
		setLoading(true);
		try {
			setMatches(await fetchFourScorePreview(date));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('fourScorePreviewLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [date, dispatch, t]);

	const filtered = useMemo(() => {
		if (sectionFilter === 'ALL') {
			return matches;
		}
		return matches.filter((m) => m.section === sectionFilter);
	}, [matches, sectionFilter]);

	const terminalWithoutDetails = useMemo(
		() =>
			matches.filter(
				(m) =>
					m.statusText.toLowerCase().includes('завершено') &&
					!m.detailsLoaded &&
					(m.firstHalfScore == null || m.secondHalfScore == null)
			).length,
		[matches]
	);

	const sectionCounts = useMemo(() => {
		const wc = matches.filter((m) => m.section === 'WORLD_CUP').length;
		const fr = matches.filter((m) => m.section === 'FRIENDLIES').length;
		return { all: matches.length, wc, fr };
	}, [matches]);

	return (
		<Box sx={PAGE_ROOT_SX}>
			<Typography component="h1" sx={oddsDemoTitleSx}>
				{t('fourScorePreviewTitle')}
			</Typography>
			<Box sx={oddsDemoHintSx}>{t('fourScorePreviewHint')}</Box>

			<Box sx={{ ...oddsDemoPanelSx(theme), mb: 2 }}>
				<Box sx={oddsDemoToolbarRowSx}>
					<TextField
						type="date"
						size="small"
						label={t('fourScorePreviewDate')}
						value={date}
						onChange={(e) => setDate(e.target.value)}
						InputLabelProps={{ shrink: true }}
						sx={{ minWidth: 160 }}
					/>
					<CustomButton
						onClick={() => void load()}
						disabled={loading}
						buttonText={loading ? '…' : t('fourScorePreviewLoad')}
					/>
					{loading ? <CircularProgress size={22} /> : null}
				</Box>

				{matches.length > 0 ? (
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
						<Chip
							label={t('fourScorePreviewFilterAll', { count: sectionCounts.all })}
							color={sectionFilter === 'ALL' ? 'primary' : 'default'}
							onClick={() => setSectionFilter('ALL')}
							variant={sectionFilter === 'ALL' ? 'filled' : 'outlined'}
						/>
						<Chip
							label={t('fourScorePreviewFilterWc', { count: sectionCounts.wc })}
							color={sectionFilter === 'WORLD_CUP' ? 'primary' : 'default'}
							onClick={() => setSectionFilter('WORLD_CUP')}
							variant={sectionFilter === 'WORLD_CUP' ? 'filled' : 'outlined'}
						/>
						<Chip
							label={t('fourScorePreviewFilterFriendlies', { count: sectionCounts.fr })}
							color={sectionFilter === 'FRIENDLIES' ? 'primary' : 'default'}
							onClick={() => setSectionFilter('FRIENDLIES')}
							variant={sectionFilter === 'FRIENDLIES' ? 'filled' : 'outlined'}
						/>
					</Box>
				) : null}

				{!loading && matches.length === 0 ? (
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
						{t('fourScorePreviewEmpty')}
					</Typography>
				) : null}

				{terminalWithoutDetails > 0 ? (
					<Alert severity="warning" sx={{ mt: 1.5 }}>
						{t('fourScorePreviewDetailsWarning', { count: terminalWithoutDetails })}
					</Alert>
				) : null}
			</Box>

			{filtered.length > 0 ? (
				<TableContainer sx={{ ...oddsDemoPanelSx(theme), overflowX: 'auto' }}>
					<Table size="small" stickyHeader sx={{ minWidth: 1100 }}>
						<TableHead>
							<TableRow>
								<TableCell sx={{ minWidth: 100 }}>{t('fourScorePreviewSection')}</TableCell>
								<TableCell sx={{ minWidth: 220 }}>{t('fourScorePreviewMatch')}</TableCell>
								<TableCell sx={{ minWidth: 100 }}>{t('fourScorePreviewStatus')}</TableCell>
								<TableCell align="center" sx={{ minWidth: 56 }}>
									{t('fourScorePreviewColFt')}
								</TableCell>
								<TableCell align="center" sx={{ minWidth: 56 }}>
									{t('fourScorePreviewCol1h')}
								</TableCell>
								<TableCell align="center" sx={{ minWidth: 56 }}>
									{t('fourScorePreviewCol2h')}
								</TableCell>
								<TableCell align="center" sx={{ minWidth: 56 }}>
									{t('fourScorePreviewColEt')}
								</TableCell>
								<TableCell align="center" sx={{ minWidth: 56 }}>
									{t('fourScorePreviewColPen')}
								</TableCell>
								<TableCell sx={{ minWidth: 140 }}>{t('fourScorePreviewColHomeMapping')}</TableCell>
								<TableCell sx={{ minWidth: 140 }}>{t('fourScorePreviewColAwayMapping')}</TableCell>
								<TableCell sx={{ minWidth: 72 }}>{t('fourScorePreviewColLink')}</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{filtered.map((m) => {
								const eventUrl = m.eventPath.startsWith('http')
									? m.eventPath
									: `${FOURSCORE_BASE}${m.eventPath.startsWith('/') ? '' : '/'}${m.eventPath}`;
								return (
									<TableRow key={m.eventSlug} hover>
										<TableCell>
											<Typography variant="body2" sx={{ fontWeight: 600 }}>
												{m.section === 'WORLD_CUP'
													? t('fourScorePreviewSectionWc')
													: t('fourScorePreviewSectionFriendlies')}
											</Typography>
										</TableCell>
										<TableCell>
											<Typography variant="body2" sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
												{m.homeTeamName}
												<Typography component="span" color="text.secondary" sx={{ mx: 0.75 }}>
													—
												</Typography>
												{m.awayTeamName}
											</Typography>
										</TableCell>
										<TableCell>{m.statusText}</TableCell>
										<TableCell align="center" sx={{ fontFamily: 'monospace' }}>
											{dash(m.fullTimeScore)}
										</TableCell>
										<TableCell align="center" sx={{ fontFamily: 'monospace' }}>
											{dash(m.firstHalfScore)}
										</TableCell>
										<TableCell align="center" sx={{ fontFamily: 'monospace' }}>
											{dash(m.secondHalfScore)}
										</TableCell>
										<TableCell align="center" sx={{ fontFamily: 'monospace' }}>
											{dash(m.extraTimeScore)}
										</TableCell>
										<TableCell align="center" sx={{ fontFamily: 'monospace' }}>
											{dash(m.penaltyScore)}
										</TableCell>
										<TableCell>{mappingCell(m.homeMapped, m.homeTeamName, m.homeTeamTitle)}</TableCell>
										<TableCell>{mappingCell(m.awayMapped, m.awayTeamName, m.awayTeamTitle)}</TableCell>
										<TableCell>
											<Link href={eventUrl} target="_blank" rel="noopener noreferrer" variant="body2">
												4score
											</Link>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</TableContainer>
			) : null}
		</Box>
	);
}
