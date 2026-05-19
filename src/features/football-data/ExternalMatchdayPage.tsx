import RefreshIcon from '@mui/icons-material/Refresh';
import {
	Box,
	Button,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useMemo, useState } from 'react';
import TeamsAvatars from '../../components/custom/avatar/TeamsAvatars';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../components/custom/snackbar/snackbarSlice';
import { getGameScoreView } from '../../components/utils/gameScoreValidation';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import Team from '../admin/teams/types/Team';
import { selectUser } from '../auth/selectors';
import GameScore from '../bets/types/GameScore';
import { teamNameMap } from './gameResults/teamMap';
import {
	DEFAULT_FOOTBALL_DATA_SEASON,
	FOOTBALL_DATA_COMPETITIONS,
} from './competitionOptions';
import { getMatchdayFromCache, syncMatchdayFromApi } from './footballDataApi';
import { ExternalMatch, ExternalMatchdayPage as MatchdayPageData } from './types/ExternalMatch';

function toDisplayTeam(name: string): Team {
	const title = teamNameMap[name] ?? name;
	return { id: `ext-${title}`, title };
}

function statusColor(status: string): 'success' | 'warning' | 'default' {
	if (status === 'FINISHED' || status === 'AWARDED') return 'success';
	if (status === 'IN_PLAY' || status === 'PAUSE' || status === 'HALFTIME') return 'warning';
	return 'default';
}

export default function ExternalMatchdayPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const canSync = user?.role === 'ADMIN' || user?.role === 'MODERATOR';

	const [competitionCode, setCompetitionCode] = useState(FOOTBALL_DATA_COMPETITIONS[0].competitionCode);
	const [matchday, setMatchday] = useState(1);
	const [season, setSeason] = useState(DEFAULT_FOOTBALL_DATA_SEASON);
	const [data, setData] = useState<MatchdayPageData | null>(null);
	const [loading, setLoading] = useState(false);
	const [syncing, setSyncing] = useState(false);

	const loadCache = useCallback(async () => {
		setLoading(true);
		try {
			const page = await getMatchdayFromCache(competitionCode, matchday, season);
			setData(page);
		} catch (error) {
			setData(null);
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalMatchLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [competitionCode, matchday, season, dispatch]);

	useEffect(() => {
		loadCache();
	}, [loadCache]);

	const handleSyncFromApi = async (): Promise<void> => {
		setSyncing(true);
		try {
			const page = await syncMatchdayFromApi(competitionCode, matchday, season);
			setData(page);
			dispatch(showSuccessSnackbar({ message: t('externalMatchSyncSuccess') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalMatchSyncError'),
				})
			);
		} finally {
			setSyncing(false);
		}
	};

	const sortedMatches = useMemo(() => {
		if (!data?.matches) return [];
		return [...data.matches].sort((a, b) => {
			const da = a.utcDate ? new Date(a.utcDate).getTime() : 0;
			const db = b.utcDate ? new Date(b.utcDate).getTime() : 0;
			return da - db;
		});
	}, [data?.matches]);

	return (
		<Box
			sx={{
				width: '100%',
				maxWidth: 430,
				mx: 'auto',
				px: 1.5,
				pb: 4,
				minHeight: 'calc(100vh - 80px)',
			}}
		>
			<Typography
				variant="h6"
				sx={{ fontWeight: 700, textAlign: 'center', mb: 2, fontSize: '1.25rem' }}
			>
				{t('externalMatchResults')}
			</Typography>

			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					gap: 1.5,
					mb: 2,
					p: 1.5,
					borderRadius: 2,
					bgcolor: 'background.paper',
					boxShadow: 1,
				}}
			>
				<FormControl fullWidth size="small">
					<InputLabel id="fd-league-label">{t('league')}</InputLabel>
					<Select
						labelId="fd-league-label"
						value={competitionCode}
						label={t('league')}
						onChange={(e) => setCompetitionCode(e.target.value)}
					>
						{FOOTBALL_DATA_COMPETITIONS.map((c) => (
							<MenuItem key={c.competitionCode} value={c.competitionCode}>
								{t(`leagueShortName.${c.leagueCode}`)}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<Box sx={{ display: 'flex', gap: 1 }}>
					<FormControl fullWidth size="small">
						<InputLabel id="fd-matchday-label">{t('matchday')}</InputLabel>
						<Select
							labelId="fd-matchday-label"
							value={matchday}
							label={t('matchday')}
							onChange={(e) => setMatchday(Number(e.target.value))}
						>
							{Array.from({ length: 38 }, (_, i) => i + 1).map((md) => (
								<MenuItem key={md} value={md}>
									{md}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl sx={{ minWidth: 100 }} size="small">
						<InputLabel id="fd-season-label">{t('season')}</InputLabel>
						<Select
							labelId="fd-season-label"
							value={season}
							label={t('season')}
							onChange={(e) => setSeason(e.target.value)}
						>
							{['2024', '2025', '2026'].map((y) => (
								<MenuItem key={y} value={y}>
									{y}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Box>

				{data?.sync && (
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
						<Chip
							size="small"
							label={
								data.sync.syncStatus === 'COMPLETED'
									? t('externalMatchSyncCompleted')
									: t('externalMatchSyncPolling')
							}
							color={data.sync.syncStatus === 'COMPLETED' ? 'success' : 'warning'}
						/>
						<Typography variant="caption" color="text.secondary">
							{t('externalMatchSyncProgress', {
								finished: data.sync.finishedMatchCount,
								total: data.sync.expectedMatchCount,
							})}
						</Typography>
					</Box>
				)}

				{canSync && (
					<Button
						fullWidth
						variant="contained"
						color="secondary"
						size="large"
						disabled={syncing || loading}
						startIcon={syncing ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
						onClick={handleSyncFromApi}
						sx={{ py: 1.25, fontWeight: 600, fontSize: '0.95rem' }}
					>
						{t('externalMatchSyncFromApi')}
					</Button>
				)}
			</Box>

			{loading && (
				<Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
					<CircularProgress />
				</Box>
			)}

			{!loading && sortedMatches.length === 0 && (
				<Typography textAlign="center" color="text.secondary" sx={{ py: 3, px: 1 }}>
					{canSync ? t('externalMatchNoDataHintModerator') : t('externalMatchNoDataHint')}
				</Typography>
			)}

			{!loading && sortedMatches.length > 0 && (
				<Box
					sx={{
						borderRadius: 2,
						overflow: 'hidden',
						boxShadow: 2,
						bgcolor: 'background.paper',
					}}
				>
					{sortedMatches.map((match: ExternalMatch, index: number) => {
						const homeTeam = toDisplayTeam(match.homeTeamName);
						const awayTeam = toDisplayTeam(match.awayTeamName);
						const gameScore: GameScore | null = match.gameScore ?? null;
						const scoreView = gameScore ? getGameScoreView(gameScore) : '—';
						const matchDate = match.utcDate
							? new Date(match.utcDate).toLocaleString(undefined, {
									day: '2-digit',
									month: '2-digit',
									hour: '2-digit',
									minute: '2-digit',
								})
							: '';

						return (
							<Box
								key={match.externalMatchId}
								sx={{
									px: 1.5,
									py: 1.25,
									borderBottom: index < sortedMatches.length - 1 ? 1 : 0,
									borderColor: 'divider',
								}}
							>
								<Box
									sx={{
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
										mb: 0.5,
									}}
								>
									<Typography variant="caption" color="text.secondary">
										{matchDate}
									</Typography>
									<Chip
										size="small"
										label={match.status}
										color={statusColor(match.status)}
										sx={{ height: 22, fontSize: '0.7rem' }}
									/>
								</Box>
								<TeamsAvatars homeTeam={homeTeam} awayTeam={awayTeam} height={28} />
								<Typography
									sx={{
										textAlign: 'center',
										fontWeight: 700,
										fontSize: '1.15rem',
										mt: 0.5,
										letterSpacing: 0.5,
									}}
								>
									{scoreView}
								</Typography>
							</Box>
						);
					})}
				</Box>
			)}
		</Box>
	);
}
