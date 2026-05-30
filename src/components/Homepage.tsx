import { Alert, Box } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/selectors';
import {
	API_SYNC_ISSUES_CHANGED_EVENT,
	getExternalSyncIssuesStatus,
} from '../features/admin/external-sync-issues/api';
import { selectActiveSeasonId } from '../features/admin/seasons/selectors';
import { selectCompletedBets } from '../features/bets/selectors';
import PlayersStats from '../features/stats/PlayersStats';
import { selectPlayersStats } from '../features/stats/selectors';
import { getAllPlayersStatsBySeason } from '../features/stats/statsSlice';
import Wc26QuickLink from '../features/world-cup-2026/Wc26QuickLink';
import CustomLoading from './custom/loading/CustomLoading';
import CustomLoadingError from './custom/loading/CustomLoadingError';
import useFetchActiveSeason from './hooks/useFetchActiveSeason';
import { homepageContentLayoutSx } from './layoutMainStyles';

function isStaffRole(role: string | undefined): boolean {
	return role === 'ADMIN' || role === 'MODERATOR';
}

export default function Homepage(): JSX.Element {
	const user = useAppSelector(selectUser);
	const activeSeasonId = useAppSelector(selectActiveSeasonId);
	const playersStats = useAppSelector(selectPlayersStats);
	const completedBets = useAppSelector(selectCompletedBets);
	const dispatch = useAppDispatch();
	const [loading, setLoading] = useState(true);
	const [loadingError, setLoadingError] = useState(false);
	const [scoreChangeIssues, setScoreChangeIssues] = useState(false);

	const loadSyncIssuesStatus = useCallback(async (): Promise<void> => {
		try {
			const status = await getExternalSyncIssuesStatus();
			setScoreChangeIssues(Boolean(status.hasScoreChangeIssues));
		} catch {
			setScoreChangeIssues(false);
		}
	}, []);

	useEffect(() => {
		if (!isStaffRole(user?.role)) {
			setScoreChangeIssues(false);
			return;
		}
		void loadSyncIssuesStatus();
	}, [user?.role, loadSyncIssuesStatus]);

	useEffect(() => {
		if (!isStaffRole(user?.role)) {
			return;
		}
		const onChanged = (): void => {
			void loadSyncIssuesStatus();
		};
		window.addEventListener(API_SYNC_ISSUES_CHANGED_EVENT, onChanged);
		return () => window.removeEventListener(API_SYNC_ISSUES_CHANGED_EVENT, onChanged);
	}, [user?.role, loadSyncIssuesStatus]);

	const [externalData, setExternalData] = useState<any>(null);
	const [externalDataError, setExternalDataError] = useState(false);

	const sortedPlayersStats = [...playersStats].sort((a, b) => b.actualBalance - a.actualBalance);

	useFetchActiveSeason(activeSeasonId || '');

	// Fetch данных с API
	// useEffect(() => {
	// 	const fetchExternalData = async (): Promise<any> => {
	// 		try {
	// 			const response = await fetch(
	// 				'https://apiv2.allsportsapi.com/football/?met=Fixtures&leagueId=152&APIkey=e3cd4b7c6cee52133ed9a2ecbcd04cb3b114b53aa74b6eb8f5b2bf45be8af491&from=2024-09-28&to=2024-10-04'
	// 			);
	// 			if (!response.ok) {
	// 				throw new Error('Ошибка при загрузке данных с API');
	// 			}
	// 			const data = await response.json();
	// 			console.log(data.result[0].event_home_team);

	// 			setExternalData(data);
	// 		} catch (error) {
	// 			setExternalDataError(true);
	// 		}
	// 	};

	// 	fetchExternalData();
	// }, []);

	useEffect(() => {
		if (activeSeasonId) {
			dispatch(getAllPlayersStatsBySeason(activeSeasonId))
				.then(() => {
					setLoading(false);
					// делаем предзагрузку на главной странице
					// if (activeSeasonId && completedBets.length < 28) {
					// 	dispatch(
					// 		getCompletedBets({
					// 			seasonId: activeSeasonId,
					// 			playerId: undefined,
					// 			leagueId: undefined,
					// 			pageSize: '28',
					// 			pageNumber: 0,
					// 		})
					// 	);
					// }
				})
				.catch(() => {
					setLoadingError(true);
					setLoading(false);
				});
		}
	}, [activeSeasonId]);

	return (
		<Box>
			{loading ? (
				<CustomLoading />
			) : (
				<Box>
					{loadingError ? (
						<CustomLoadingError />
					) : (
						<Box sx={homepageContentLayoutSx}>
							{isStaffRole(user?.role) && scoreChangeIssues ? (
								<Alert severity="warning" sx={{ mb: 2, textAlign: 'left' }}>
									{t('externalSyncIssuesHomeAlert')}{' '}
									<Link to="/external-sync-issues">{t('externalSyncIssuesTitle')}</Link>
								</Alert>
							) : null}
							<Wc26QuickLink />
							<PlayersStats playersStats={sortedPlayersStats} />
							{/* <Box sx={{ py: 3, px: 1 }}>
								Fetch Results:
								{externalDataError ? (
									<Box>Error loading external data</Box>
								) : (
									<>
										<Box>
											{externalData
												? JSON.stringify(externalData.result[0].event_home_team)
												: 'Loading...'}
										</Box>
										<Box>
											{externalData
												? JSON.stringify(externalData.result[0].event_away_team)
												: 'Loading...'}
										</Box>
									</>
								)}
							</Box> */}
						</Box>
					)}
				</Box>
			)}
		</Box>
	);
}
