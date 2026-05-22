import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import {
	showErrorSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import { ADMIN_PANEL_SX } from '../adminPanelStyles';
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
		<Box sx={ADMIN_PANEL_SX}>
			<Typography sx={{ fontSize: 22, fontWeight: 600, mb: 1 }}>{t('leagueFormatAssignment')}</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, px: 0.5 }}>
				{t('leagueFormatAssignmentHint')}
			</Typography>

			<CustomButton
				sx={{ px: 2, mb: showList ? 1 : 0 }}
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
				<Box sx={{ textAlign: 'left' }}>
					{loading && (
						<Typography variant="body2" sx={{ textAlign: 'center' }}>
							{t('loading')}
						</Typography>
					)}
					{!loading && missingCount === 0 && (
						<Typography variant="body2" color="success.main" sx={{ textAlign: 'center' }}>
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
		</Box>
	);
}
