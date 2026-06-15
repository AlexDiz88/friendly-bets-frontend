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
	Typography,
	useTheme,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { type Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import 'dayjs/locale/ru';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import CustomButton from '../../components/custom/btn/CustomButton';
import CustomDatePicker from '../../components/custom/dialog/CustomDatePicker';
import { showErrorSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import {
	oddsDemoHintSx,
	oddsDemoPageRootSx,
	oddsDemoPanelSx,
	oddsDemoTitleSx,
	oddsDemoToolbarRowSx,
} from '../odds-demo/oddsDemoPageStyles';
import { translateMatchStatus } from '../match-results/matchStatusI18n';
import {
	fetchFourScorePreview,
	fetchTwentyFourScorePreview,
	type ApiPreviewMatch,
} from './fourscoreApi';

const FOURSCORE_BASE = 'https://4score.ru';
const TWENTYFOURSCORE_BASE = 'https://24score.pro';
const PAGE_ROOT_SX = { ...oddsDemoPageRootSx, maxWidth: 1440 };

type SectionFilter = 'ALL' | 'WORLD_CUP' | 'FRIENDLIES';

type ProviderConfig = {
	id: 'fourscore' | 'twentyfourscore';
	titleKey: 'fourScorePreviewProviderFourScore' | 'fourScorePreviewProviderTwentyFourScore';
	linkLabel: string;
	baseUrl: string;
	detailsWarningKey:
		| 'fourScorePreviewDetailsWarning'
		| 'fourScorePreviewDetailsWarningTwentyFour';
};

const PROVIDERS: ProviderConfig[] = [
	{
		id: 'fourscore',
		titleKey: 'fourScorePreviewProviderFourScore',
		linkLabel: '4score',
		baseUrl: FOURSCORE_BASE,
		detailsWarningKey: 'fourScorePreviewDetailsWarning',
	},
	{
		id: 'twentyfourscore',
		titleKey: 'fourScorePreviewProviderTwentyFourScore',
		linkLabel: '24score',
		baseUrl: TWENTYFOURSCORE_BASE,
		detailsWarningKey: 'fourScorePreviewDetailsWarningTwentyFour',
	},
];

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

function filterMatches(matches: ApiPreviewMatch[], sectionFilter: SectionFilter): ApiPreviewMatch[] {
	if (sectionFilter === 'ALL') {
		return matches;
	}
	return matches.filter((m) => m.section === sectionFilter);
}

function countTerminalWithoutDetails(
	matches: ApiPreviewMatch[],
	providerId: ProviderConfig['id']
): number {
	return matches.filter((m) => {
		if (m.mappedStatus !== 'FINISHED' || m.detailsLoaded) {
			return false;
		}
		if (providerId === 'twentyfourscore') {
			return m.firstHalfScore == null;
		}
		return m.firstHalfScore == null || m.secondHalfScore == null;
	}).length;
}

function sectionCounts(matches: ApiPreviewMatch[]): { all: number; wc: number; fr: number } {
	const wc = matches.filter((m) => m.section === 'WORLD_CUP').length;
	const fr = matches.filter((m) => m.section === 'FRIENDLIES').length;
	return { all: matches.length, wc, fr };
}

type PreviewProviderSectionProps = {
	provider: ProviderConfig;
	matches: ApiPreviewMatch[];
	loading: boolean;
	loaded: boolean;
	sectionFilter: SectionFilter;
	onSectionFilterChange: (filter: SectionFilter) => void;
	onLoad: () => void;
};

function PreviewProviderSection({
	provider,
	matches,
	loading,
	loaded,
	sectionFilter,
	onSectionFilterChange,
	onLoad,
}: PreviewProviderSectionProps): JSX.Element {
	const { t } = useTranslation();
	const theme = useTheme();
	const filtered = useMemo(() => filterMatches(matches, sectionFilter), [matches, sectionFilter]);
	const terminalWithoutDetails = useMemo(
		() => countTerminalWithoutDetails(matches, provider.id),
		[matches, provider.id]
	);
	const counts = useMemo(() => sectionCounts(matches), [matches]);

	return (
		<Box sx={{ mb: 3 }}>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 1,
					flexWrap: 'wrap',
					mb: 1.5,
				}}
			>
				<Typography component="h2" variant="h6" sx={{ fontWeight: 700 }}>
					{t(provider.titleKey)}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<CustomButton
						onClick={onLoad}
						disabled={loading}
						buttonText={loading ? '…' : t('fourScorePreviewLoad')}
					/>
					{loading ? <CircularProgress size={22} /> : null}
				</Box>
			</Box>

			<Box sx={{ ...oddsDemoPanelSx(theme), mb: 2 }}>
				{matches.length > 0 ? (
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
						<Chip
							label={t('fourScorePreviewFilterAll', { count: counts.all })}
							color={sectionFilter === 'ALL' ? 'primary' : 'default'}
							onClick={() => onSectionFilterChange('ALL')}
							variant={sectionFilter === 'ALL' ? 'filled' : 'outlined'}
						/>
						<Chip
							label={t('fourScorePreviewFilterWc', { count: counts.wc })}
							color={sectionFilter === 'WORLD_CUP' ? 'primary' : 'default'}
							onClick={() => onSectionFilterChange('WORLD_CUP')}
							variant={sectionFilter === 'WORLD_CUP' ? 'filled' : 'outlined'}
						/>
						<Chip
							label={t('fourScorePreviewFilterFriendlies', { count: counts.fr })}
							color={sectionFilter === 'FRIENDLIES' ? 'primary' : 'default'}
							onClick={() => onSectionFilterChange('FRIENDLIES')}
							variant={sectionFilter === 'FRIENDLIES' ? 'filled' : 'outlined'}
						/>
					</Box>
				) : null}

				{!loading && loaded && matches.length === 0 ? (
					<Typography variant="body2" color="text.secondary">
						{t('fourScorePreviewEmptyProvider')}
					</Typography>
				) : null}

				{terminalWithoutDetails > 0 ? (
					<Alert severity="warning" sx={{ mt: 1.5 }}>
						{t(provider.detailsWarningKey, { count: terminalWithoutDetails })}
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
									{t('fourScorePreviewColMinute')}
								</TableCell>
								<TableCell sx={{ minWidth: 88 }}>{t('fourScorePreviewMappedStatus')}</TableCell>
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
									: `${provider.baseUrl}${m.eventPath.startsWith('/') ? '' : '/'}${m.eventPath}`;
								return (
									<TableRow key={`${provider.id}-${m.eventSlug}`} hover>
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
										<TableCell>{dash(m.statusText)}</TableCell>
										<TableCell align="center" sx={{ fontFamily: 'monospace' }}>
											{dash(m.liveMinuteLabel)}
										</TableCell>
										<TableCell>
											{m.mappedStatus ? translateMatchStatus(m.mappedStatus, t) : '—'}
										</TableCell>
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
												{provider.linkLabel}
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

export default function FourScorePreviewPage(): JSX.Element {
	const { t, i18n } = useTranslation();
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const [date, setDate] = useState<Dayjs>(() => dayjs());
	const datePickerLocale = i18n.language === 'ru' ? 'ru' : i18n.language === 'de' ? 'de' : 'en';
	const [loadingByProvider, setLoadingByProvider] = useState<
		Record<ProviderConfig['id'], boolean>
	>({ fourscore: false, twentyfourscore: false });
	const [loadedByProvider, setLoadedByProvider] = useState<
		Record<ProviderConfig['id'], boolean>
	>({ fourscore: false, twentyfourscore: false });
	const [fourScoreMatches, setFourScoreMatches] = useState<ApiPreviewMatch[]>([]);
	const [twentyFourScoreMatches, setTwentyFourScoreMatches] = useState<ApiPreviewMatch[]>([]);
	const [sectionFilter, setSectionFilter] = useState<SectionFilter>('ALL');

	const anyLoading = loadingByProvider.fourscore || loadingByProvider.twentyfourscore;

	const loadProvider = useCallback(
		async (providerId: ProviderConfig['id']): Promise<void> => {
			setLoadingByProvider((prev) => ({ ...prev, [providerId]: true }));
			const dateParam = date.format('YYYY-MM-DD');
			try {
				if (providerId === 'fourscore') {
					setFourScoreMatches(await fetchFourScorePreview(dateParam));
				} else {
					setTwentyFourScoreMatches(await fetchTwentyFourScorePreview(dateParam));
				}
				setLoadedByProvider((prev) => ({ ...prev, [providerId]: true }));
			} catch (error) {
				if (providerId === 'fourscore') {
					setFourScoreMatches([]);
				} else {
					setTwentyFourScoreMatches([]);
				}
				dispatch(
					showErrorSnackbar({
						message:
							error instanceof Error
								? error.message
								: t(
										providerId === 'fourscore'
											? 'fourScorePreviewLoadError'
											: 'fourScorePreviewTwentyFourLoadError'
									),
					})
				);
			} finally {
				setLoadingByProvider((prev) => ({ ...prev, [providerId]: false }));
			}
		},
		[date, dispatch, t]
	);

	const loadAll = useCallback(async (): Promise<void> => {
		await Promise.all([loadProvider('fourscore'), loadProvider('twentyfourscore')]);
	}, [loadProvider]);

	const matchesByProvider: Record<ProviderConfig['id'], ApiPreviewMatch[]> = {
		fourscore: fourScoreMatches,
		twentyfourscore: twentyFourScoreMatches,
	};

	const anyLoaded = loadedByProvider.fourscore || loadedByProvider.twentyfourscore;

	return (
		<Box sx={PAGE_ROOT_SX}>
			<Typography component="h1" sx={oddsDemoTitleSx}>
				{t('fourScorePreviewTitle')}
			</Typography>
			<Box sx={oddsDemoHintSx}>{t('fourScorePreviewHint')}</Box>

			<Box sx={{ ...oddsDemoPanelSx(theme), mb: 2 }}>
				<Box sx={{ ...oddsDemoToolbarRowSx, alignItems: 'center' }}>
					<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={datePickerLocale}>
						<CustomDatePicker
							compact
							label={t('fourScorePreviewDate')}
							value={date}
							onChange={(next) => {
								if (next) {
									setDate(next);
								}
							}}
						/>
					</LocalizationProvider>
					<CustomButton
						onClick={() => void loadAll()}
						disabled={anyLoading}
						buttonText={anyLoading ? '…' : t('fourScorePreviewLoadAll')}
					/>
					{anyLoading ? <CircularProgress size={22} /> : null}
				</Box>

				{!anyLoaded ? (
					<Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
						{t('fourScorePreviewEmpty')}
					</Typography>
				) : null}
			</Box>

			{PROVIDERS.map((provider) => (
				<PreviewProviderSection
					key={provider.id}
					provider={provider}
					matches={matchesByProvider[provider.id]}
					loading={loadingByProvider[provider.id]}
					loaded={loadedByProvider[provider.id]}
					sectionFilter={sectionFilter}
					onSectionFilterChange={setSectionFilter}
					onLoad={() => void loadProvider(provider.id)}
				/>
			))}
		</Box>
	);
}
