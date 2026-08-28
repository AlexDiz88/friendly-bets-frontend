import { Box, Chip, TextField, Typography } from '@mui/material';
import { t } from 'i18next';
import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import CustomSuccessButton from '../../../components/custom/btn/CustomSuccessButton';
import { showErrorSnackbar } from '../../../components/custom/snackbar/snackbarSlice';
import AdminSection from '../AdminSection';
import { probeSiteAccess, SiteAccessProbeResult } from './externalDataAdminApi';

function verdictColor(
	verdict: string
): 'success' | 'error' | 'warning' | 'default' {
	switch (verdict) {
		case 'PASS':
			return 'success';
		case 'CLOUDFLARE_JS_CHALLENGE':
		case 'AUTH_INTERSTITIAL':
			return 'error';
		case 'HTTP_BLOCKED':
		case 'NETWORK_ERROR':
			return 'warning';
		default:
			return 'default';
	}
}

export default function SiteAccessProbePanel(): JSX.Element {
	const dispatch = useAppDispatch();
	const [url, setUrl] = useState('');
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<SiteAccessProbeResult | null>(null);

	const run = async (): Promise<void> => {
		const trimmed = url.trim();
		if (!trimmed) {
			dispatch(showErrorSnackbar({ message: 'siteAccessProbeUrlRequired' }));
			return;
		}
		setLoading(true);
		setResult(null);
		try {
			const next = await probeSiteAccess(trimmed);
			setResult(next);
		} catch (error) {
			dispatch(
				showErrorSnackbar({
					message: error instanceof Error ? error.message : 'siteAccessProbeFailed',
				})
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<AdminSection title={t('siteAccessProbeTitle')} hint={t('siteAccessProbeHint')}>
			<TextField
				fullWidth
				size="small"
				value={url}
				onChange={(e) => setUrl(e.target.value)}
				placeholder="https://example.com"
				label={t('siteAccessProbeUrl')}
				sx={{ mb: 1.5 }}
				inputProps={{ inputMode: 'url', autoComplete: 'off' }}
			/>
			<CustomSuccessButton
				onClick={() => void run()}
				disabled={loading}
				loading={loading}
				buttonText={t('siteAccessProbeRun')}
				sx={{ mr: 0 }}
			/>

			{result ? (
				<Box
					sx={{
						mt: 2,
						p: 1.5,
						borderRadius: 2,
						border: '1px solid',
						borderColor: 'divider',
						display: 'flex',
						flexDirection: 'column',
						gap: 1,
					}}
				>
					<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center' }}>
						<Chip
							size="small"
							color={verdictColor(result.verdict)}
							label={t(`siteAccessProbeVerdict.${result.verdict}`, {
								defaultValue: result.verdict,
							})}
						/>
						{result.httpStatus != null ? (
							<Chip size="small" variant="outlined" label={`HTTP ${result.httpStatus}`} />
						) : null}
						{result.durationMs != null ? (
							<Chip size="small" variant="outlined" label={`${result.durationMs} ms`} />
						) : null}
						{result.cloudflareDetected ? (
							<Chip size="small" color="warning" variant="outlined" label="Cloudflare" />
						) : null}
						{result.jsChallengeSuspected ? (
							<Chip size="small" color="error" variant="outlined" label="JS challenge" />
						) : null}
					</Box>

					<Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
						{t(`siteAccessProbeVerdictHint.${result.verdict}`, {
							defaultValue: '',
						})}
					</Typography>

					{result.finalUrl && result.finalUrl !== result.requestedUrl ? (
						<Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace', wordBreak: 'break-all' }}>
							→ {result.finalUrl}
						</Typography>
					) : null}

					{(result.serverHeader || result.cfRay || result.cfMitigated) && (
						<Typography sx={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'text.secondary' }}>
							{[
								result.serverHeader ? `server=${result.serverHeader}` : null,
								result.cfRay ? `cf-ray=${result.cfRay}` : null,
								result.cfMitigated ? `cf-mitigated=${result.cfMitigated}` : null,
							]
								.filter(Boolean)
								.join(' · ')}
						</Typography>
					)}

					{result.errorDetail ? (
						<Typography sx={{ fontSize: '0.8rem', color: 'error.main', wordBreak: 'break-word' }}>
							{result.errorDetail}
						</Typography>
					) : null}

					{result.bodySnippet ? (
						<Box
							component="pre"
							sx={{
								m: 0,
								p: 1,
								borderRadius: 1,
								bgcolor: 'action.hover',
								fontSize: '0.7rem',
								fontFamily: 'monospace',
								whiteSpace: 'pre-wrap',
								wordBreak: 'break-word',
								maxHeight: 160,
								overflow: 'auto',
							}}
						>
							{result.bodySnippet}
						</Box>
					) : null}
				</Box>
			) : null}
		</AdminSection>
	);
}
