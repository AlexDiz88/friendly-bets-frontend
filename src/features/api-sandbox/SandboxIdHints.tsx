import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Box, Chip, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAppDispatch } from '../../app/hooks';
import { showSuccessSnackbar } from '../../components/custom/snackbar/snackbarSlice';
import type { ExternalDataLayer } from '../../shared/externalDataLayerColors';
import { copyText } from './CopyableValue';
import { sandboxFieldLabelSx } from './apiSandboxPageStyles';
import { sandboxIdHintsFor, type SandboxIdHint } from './sandboxProviderHints';

type SandboxIdHintsProps = {
	layer: ExternalDataLayer;
	provider: string;
	/** When set, chip click also applies the value into the related form field. */
	onApply?: (value: string) => void;
	/** Override list (e.g. tournament-only). Default: lookup by layer+provider. */
	hints?: SandboxIdHint[];
};

export default function SandboxIdHints({
	layer,
	provider,
	onApply,
	hints: hintsProp,
}: SandboxIdHintsProps): JSX.Element | null {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const hints = hintsProp ?? sandboxIdHintsFor(layer, provider);
	if (hints.length === 0) {
		return null;
	}

	const handlePick = async (hint: SandboxIdHint): Promise<void> => {
		onApply?.(hint.value);
		await copyText(hint.value);
		dispatch(showSuccessSnackbar({ message: t('apiSandbox.copied'), duration: 1600 }));
	};

	return (
		<Box>
			<Typography sx={sandboxFieldLabelSx}>{t('apiSandbox.idHints')}</Typography>
			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
				{hints.map((hint) => {
					const chipLabel = `${hint.label} · ${hint.value}`;
					const truncated =
						hint.value.length > 28 ? `${hint.label} · ${hint.value.slice(0, 18)}…` : chipLabel;
					const tipKey = onApply ? 'apiSandbox.idHintApply' : 'apiSandbox.idHintCopy';
					return (
						<Tooltip
							key={`${hint.label}-${hint.value}`}
							title={t(tipKey, { label: hint.label, value: hint.value })}
						>
							<Chip
								size="small"
								variant="outlined"
								icon={<ContentCopyIcon sx={{ fontSize: '14px !important' }} />}
								label={truncated}
								onClick={() => void handlePick(hint)}
								sx={{
									maxWidth: '100%',
									height: 28,
									fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
									fontSize: '0.72rem',
									cursor: 'pointer',
									'& .MuiChip-label': {
										overflow: 'hidden',
										textOverflow: 'ellipsis',
									},
								}}
							/>
						</Tooltip>
					);
				})}
			</Box>
		</Box>
	);
}
