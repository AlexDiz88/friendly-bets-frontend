import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { t } from 'i18next';
import { useCallback, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import LeagueAvatar from '../../../components/custom/avatar/LeagueAvatar';
import CustomCalendarDialog from '../../../components/custom/dialog/CustomCalendarDialog';
import {
	showErrorSnackbar,
	showSuccessSnackbar,
} from '../../../components/custom/snackbar/snackbarSlice';
import {
	getActiveSeason,
	getSeasons,
	removeLeagueFromSeason,
} from '../seasons/seasonsSlice';
import League from './types/League';

export default function LeagueRemoveFromSeasonButton({
	seasonId,
	league,
	onRemoved,
}: {
	seasonId: string;
	league: League;
	onRemoved: () => void;
}): JSX.Element | null {
	const dispatch = useAppDispatch();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const handleConfirm = useCallback(async () => {
		setConfirmOpen(false);
		const dispatchResult = await dispatch(
			removeLeagueFromSeason({ seasonId, leagueId: league.id })
		);
		if (removeLeagueFromSeason.fulfilled.match(dispatchResult)) {
			dispatch(showSuccessSnackbar({ message: t('leagueWasSuccessfullyRemovedFromSeason') }));
			onRemoved();
			dispatch(getSeasons());
			dispatch(getActiveSeason());
			return;
		}
		if (removeLeagueFromSeason.rejected.match(dispatchResult)) {
			dispatch(showErrorSnackbar({ message: dispatchResult.error.message }));
		}
	}, [dispatch, league.id, onRemoved, seasonId]);

	if (!league.removable) {
		return null;
	}

	return (
		<>
			<Tooltip title={t('removeLeagueFromSeason')} arrow>
				<span>
					<IconButton
						size="small"
						color="error"
						onClick={() => setConfirmOpen(true)}
						aria-label={t('removeLeagueFromSeason')}
						sx={{ flexShrink: 0 }}
					>
						<DeleteOutlineIcon fontSize="small" />
					</IconButton>
				</span>
			</Tooltip>
			<CustomCalendarDialog
				open={confirmOpen}
				onClose={() => setConfirmOpen(false)}
				onSave={() => {
					void handleConfirm();
				}}
				title={t('removeLeagueFromSeasonTitle')}
				summaryComponent={
					<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
						<Typography component="span" variant="body2">
							{t('removeLeagueFromSeasonConfirmBefore')}
						</Typography>
						<LeagueAvatar leagueCode={league.leagueCode} height={24} />
						<Typography component="span" variant="body2" fontWeight={600}>
							{league.name}
						</Typography>
						<Typography component="span" variant="body2">
							{t('removeLeagueFromSeasonConfirmAfter')}
						</Typography>
					</Box>
				}
				buttonAcceptText={t('btnText.delete')}
			/>
		</>
	);
}
