import DeleteIcon from '@mui/icons-material/Delete';
import {
	Box,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Tooltip,
	Typography,
} from '@mui/material';
import { t } from 'i18next';
import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomButton from '../../../components/custom/btn/CustomButton';
import { showErrorSnackbar, showSuccessSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import { ADMIN_PANEL_SX } from '../adminPanelStyles';
import { clearExternalSyncIssues, getExternalSyncIssues, notifyExternalSyncIssuesChanged } from './api';
import { ExternalSyncIssue } from './types/ExternalSyncIssue';

function issueTypeLabel(issueType: string | undefined): string {
	if (issueType === 'API_SCORE_CHANGED') {
		return t('externalSyncIssuesIssueTypeApiScoreChanged');
	}
	if (issueType === 'TEAM_MAPPING_MISSING') {
		return t('externalSyncIssuesIssueTypeTeamMappingMissing');
	}
	if (issueType === 'EVENT_MAPPING_MISSING') {
		return t('externalSyncIssuesIssueTypeEventMappingMissing');
	}
	return issueType ?? '';
}

export default function ExternalSyncIssuesPage(): JSX.Element {
	const dispatch = useAppDispatch();
	const [issues, setIssues] = useState<ExternalSyncIssue[]>([]);
	const [loading, setLoading] = useState(false);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const data = await getExternalSyncIssues();
			setIssues(data);
			notifyExternalSyncIssuesChanged();
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalSyncIssuesLoadError'),
				})
			);
		} finally {
			setLoading(false);
		}
	}, [dispatch]);

	useEffect(() => {
		load();
	}, [load]);

	const handleClear = async (): Promise<void> => {
		try {
			await clearExternalSyncIssues();
			setIssues([]);
			notifyExternalSyncIssuesChanged();
			dispatch(showSuccessSnackbar({ message: t('externalSyncIssuesCleared') }));
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : t('externalSyncIssuesClearError'),
				})
			);
		}
	};

	return (
		<Box sx={ADMIN_PANEL_SX}>
			<Typography sx={{ fontSize: 22, fontWeight: 600, mb: 1.5 }}>
				{t('externalSyncIssuesTitle')}
			</Typography>

			<Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 1.5 }}>
				<CustomButton
					buttonText={t('btnText.refresh')}
					onClick={load}
					disabled={loading}
					sx={{ px: 2 }}
				/>
				<Tooltip title={t('btnText.clear')} arrow>
					<span>
						<IconButton aria-label={t('btnText.clear')} onClick={handleClear} disabled={loading || issues.length === 0}>
							<DeleteIcon />
						</IconButton>
					</span>
				</Tooltip>
			</Box>

			{issues.length === 0 ? (
				<Typography sx={{ opacity: 0.8 }}>{t('externalSyncIssuesEmpty')}</Typography>
			) : (
				<List dense sx={{ textAlign: 'left' }}>
					{issues.map((i) => (
						<ListItem
							key={i.id}
							sx={{
								border: '1px solid rgba(255,255,255,0.12)',
								borderRadius: 1.5,
								mb: 1,
							}}
						>
							<ListItemText
								primary={`${i.provider ?? ''} · ${issueTypeLabel(i.issueType)}`.trim()}
								secondary={
									<>
										<div>
											{`${i.leagueCode ?? ''} ${i.season ?? ''} MD ${i.matchday ?? ''} #${i.externalMatchId ?? ''}`.trim()}
										</div>
										<div>{`${i.homeTeamName ?? ''} vs ${i.awayTeamName ?? ''}`.trim()}</div>
										{i.message ? <div>{i.message}</div> : null}
									</>
								}
							/>
						</ListItem>
					))}
				</List>
			)}
		</Box>
	);
}

