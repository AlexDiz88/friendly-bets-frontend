import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import { showErrorSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { getTournamentFormats } from '../tournament-formats/api';
import TournamentFormat from '../tournament-formats/types/TournamentFormat';
import { getLeaguesWithoutFormat, LeagueWithoutFormat } from './api';
import LeagueFormatAssignInline from './LeagueFormatAssignInline';

export default function LeagueFormatAssignment(): JSX.Element {
	const dispatch = useAppDispatch();
	const [leagues, setLeagues] = useState<LeagueWithoutFormat[]>([]);
	const [formats, setFormats] = useState<TournamentFormat[]>([]);
	const [showList, setShowList] = useState(false);
	const [loading, setLoading] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const [leaguesPage, formatsPage] = await Promise.all([
				getLeaguesWithoutFormat(),
				getTournamentFormats(),
			]);
			setLeagues(leaguesPage.leagues);
			setFormats(formatsPage.formats);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('leagueFormatLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		load();
	}, [load]);

	const missingCount = leagues.length;

	return (
		<AdminSection title={t('leagueFormatAssignment')} hint={t('leagueFormatAssignmentHint')}>
			<CustomButton
				sx={{ width: '100%', mb: showList ? 1.5 : 0 }}
				onClick={() => setShowList(!showList)}
				buttonColor={missingCount > 0 ? 'warning' : 'info'}
				buttonVariant="outlined"
				buttonText={
					showList
						? t('hideLeaguesWithoutFormat')
						: t('showLeaguesWithoutFormat', { count: missingCount })
				}
			/>

			{showList && (
				<Box>
					{loading && (
						<Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1 }}>
							{t('loading')}
						</Typography>
					)}
					{!loading && missingCount === 0 && (
						<Typography variant="body2" color="success.main" sx={{ textAlign: 'center', py: 1 }}>
							{t('allLeaguesHaveFormat')}
						</Typography>
					)}
					{leagues.map((l) => (
						<Box key={l.leagueId} sx={{ mb: 1 }}>
							<LeagueFormatAssignInline
								leagueId={l.leagueId}
								leagueCode={l.leagueCode}
								leagueName={l.leagueName}
								seasonTitle={l.seasonTitle}
								formats={formats}
								onAssigned={load}
							/>
						</Box>
					))}
				</Box>
			)}
		</AdminSection>
	);
}
