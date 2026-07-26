import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import { showSuccessSnackbar } from '../../components/custom/snackbar/snackbarSlice';

type CopyableValueProps = {
	value: string | number | null | undefined;
	label?: string;
	mono?: boolean;
};

export async function copyText(text: string): Promise<void> {
	await navigator.clipboard.writeText(text);
}

export default function CopyableValue({ value, label, mono = true }: CopyableValueProps): JSX.Element {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const text = value == null || value === '' ? '' : String(value);
	const empty = !text;

	const handleCopy = async (): Promise<void> => {
		if (empty) return;
		await copyText(text);
		dispatch(showSuccessSnackbar({ message: t('apiSandbox.copied'), duration: 1600 }));
	};

	return (
		<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25, maxWidth: '100%' }}>
			{label ? (
				<Typography component="span" sx={{ fontSize: '0.7rem', color: 'text.secondary', mr: 0.5 }}>
					{label}
				</Typography>
			) : null}
			<Typography
				component="span"
				sx={{
					fontFamily: mono ? 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' : 'inherit',
					fontSize: '0.8rem',
					overflow: 'hidden',
					textOverflow: 'ellipsis',
					whiteSpace: 'nowrap',
					color: empty ? 'text.disabled' : 'text.primary',
				}}
				title={text || undefined}
			>
				{empty ? '—' : text}
			</Typography>
			{!empty ? (
				<Tooltip title={t('apiSandbox.copy')}>
					<span>
						<IconButton size="small" onClick={() => void handleCopy()} sx={{ p: 0.35 }}>
							<ContentCopyIcon sx={{ fontSize: 14 }} />
						</IconButton>
					</span>
				</Tooltip>
			) : null}
		</Box>
	);
}
