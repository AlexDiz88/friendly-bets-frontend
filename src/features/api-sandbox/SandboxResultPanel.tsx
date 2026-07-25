import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
	Alert,
	Box,
	Chip,
	CircularProgress,
	IconButton,
	Tooltip,
	Typography,
} from '@mui/material';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import { showSuccessSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import type { SandboxResult } from './apiSandboxApi';
import { sandboxPreCompactSx, sandboxPreSx } from './apiSandboxPageStyles';
import { copyText } from './CopyableValue';

type SandboxResultPanelProps = {
	loading: boolean;
	result: SandboxResult | null;
	accent: string;
	summary?: ReactNode;
	emptyHint?: string;
};

export default function SandboxResultPanel({
	loading,
	result,
	accent,
	summary,
	emptyHint,
}: SandboxResultPanelProps): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();

	const handleCopyParsed = async (): Promise<void> => {
		if (!result?.parsed) return;
		await copyText(JSON.stringify(result.parsed, null, 2));
		dispatch(showSuccessSnackbar({ message: t('apiSandbox.copied'), duration: 1600 }));
	};

	const handleCopyRaw = async (): Promise<void> => {
		if (!result?.rawPayload) return;
		await copyText(result.rawPayload);
		dispatch(showSuccessSnackbar({ message: t('apiSandbox.copied'), duration: 1600 }));
	};

	if (loading) {
		return (
			<Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
				<CircularProgress size={36} sx={{ color: accent }} />
			</Box>
		);
	}

	if (!result) {
		return (
			<Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 280 }}>
				<Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
					{emptyHint || t('apiSandbox.emptyResult')}
				</Typography>
			</Box>
		);
	}

	const errorMessage = result.errorKey
		? t(`error.${result.errorKey}`, { defaultValue: result.errorKey })
		: null;

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, minHeight: 0, flex: 1 }}>
			<Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
				<Chip
					size="small"
					label={result.success ? t('apiSandbox.statusOk') : t('apiSandbox.statusFail')}
					sx={{
						fontWeight: 700,
						background: result.success ? 'rgba(34,197,94,0.16)' : 'rgba(244,63,94,0.16)',
						color: result.success ? '#16a34a' : '#e11d48',
					}}
				/>
				{result.durationMs != null ? (
					<Chip size="small" label={`${result.durationMs} ms`} variant="outlined" />
				) : null}
				{result.provider ? (
					<Chip size="small" label={result.provider} variant="outlined" />
				) : null}
				{result.rawTruncated ? (
					<Chip size="small" label={t('apiSandbox.rawTruncated')} color="warning" variant="outlined" />
				) : null}
				<Box sx={{ flex: 1 }} />
				<Tooltip title={t('apiSandbox.copyParsed')}>
					<span>
						<IconButton size="small" disabled={!result.parsed} onClick={() => void handleCopyParsed()}>
							<ContentCopyIcon fontSize="small" />
						</IconButton>
					</span>
				</Tooltip>
				<Tooltip title={t('apiSandbox.copyRaw')}>
					<span>
						<IconButton size="small" disabled={!result.rawPayload} onClick={() => void handleCopyRaw()}>
							<ContentCopyIcon fontSize="small" sx={{ opacity: 0.7 }} />
						</IconButton>
					</span>
				</Tooltip>
			</Box>

			{!result.success ? (
				<Alert severity="error" sx={{ py: 0.5 }}>
					<Typography sx={{ fontWeight: 600, fontSize: '0.9rem' }}>{errorMessage}</Typography>
					{result.errorDetail ? (
						<Typography
							component="pre"
							sx={{ m: 0, mt: 0.75, fontSize: '0.75rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
						>
							{result.errorDetail}
						</Typography>
					) : null}
				</Alert>
			) : null}

			{summary}

			{result.parsed != null ? (
				<Box>
					<Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', mb: 0.75, color: 'text.secondary' }}>
						{t('apiSandbox.parsedJson')}
					</Typography>
					<Box component="pre" sx={sandboxPreSx}>
						{JSON.stringify(result.parsed, null, 2)}
					</Box>
				</Box>
			) : null}

			{result.rawPayload ? (
				<Box>
					<Typography sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', mb: 0.75, color: 'text.secondary' }}>
						{t('apiSandbox.rawPayload')}
					</Typography>
					<Box component="pre" sx={sandboxPreCompactSx}>
						{result.rawPayload}
					</Box>
				</Box>
			) : null}
		</Box>
	);
}
