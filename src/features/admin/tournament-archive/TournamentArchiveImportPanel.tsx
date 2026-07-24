import { Box, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { importTournamentArchiveFromFile } from './tournamentArchiveApi';

export default function TournamentArchiveImportPanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const [importing, setImporting] = useState(false);

	const handleImport = async (): Promise<void> => {
		setImporting(true);
		try {
			const archive = await importTournamentArchiveFromFile('WC_2026');
			const matchCount = archive.matches?.length ?? 0;
			const unresolved = archive.unresolvedTeams?.length ?? 0;
			dispatch(
				showSuccessSnackbar({
					message:
						unresolved > 0
							? t('tournamentArchiveImportPartial', {
									matches: matchCount,
									unresolved,
								})
							: t('tournamentArchiveImportSuccess', { matches: matchCount }),
				})
			);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'tournamentArchiveImportParseError',
				})
			);
		} finally {
			setImporting(false);
		}
	};

	return (
		<AdminSection title={t('tournamentArchiveImportTitle')} hint={t('tournamentArchiveImportHint')}>
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
				<Typography variant="body2" color="text.secondary">
					{t('tournamentArchiveImportFileLabel')}:{' '}
					<code>backend/data/tournament-archive-wc-2026.json</code>
				</Typography>
				<span>
					<CustomSuccessButton
						buttonText={
							importing ? t('tournamentArchiveImportInProgress') : t('tournamentArchiveImportButton')
						}
						onClick={() => void handleImport()}
						disabled={importing}
					/>
				</span>
			</Box>
		</AdminSection>
	);
}
