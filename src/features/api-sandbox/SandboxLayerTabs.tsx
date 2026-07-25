import { Box, Chip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import type { ExternalDataLayer } from '../admin/external-data/externalDataAdminApi';
import { LAYER_ACCENT, sandboxLayerChipSx, sandboxTabsBarSx } from './apiSandboxPageStyles';

const LAYER_ORDER: ExternalDataLayer[] = ['SCHEDULE', 'ODDS', 'LIVE', 'FULL_MATCH'];

type SandboxLayerTabsProps = {
	value: ExternalDataLayer;
	onChange: (layer: ExternalDataLayer) => void;
};

export default function SandboxLayerTabs({ value, onChange }: SandboxLayerTabsProps): JSX.Element {
	const { t } = useTranslation();

	return (
		<Box sx={sandboxTabsBarSx} role="tablist" aria-label={t('apiSandbox.tabsAria')}>
			{LAYER_ORDER.map((layer) => (
				<Chip
					key={layer}
					label={t(`apiSandbox.layer.${layer}`)}
					onClick={() => onChange(layer)}
					sx={sandboxLayerChipSx(value === layer, LAYER_ACCENT[layer])}
				/>
			))}
		</Box>
	);
}
