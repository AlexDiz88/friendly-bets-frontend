import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { externalMatchWcLiveBadgeSx } from '../football-data/externalMatchWcPageStyles';

export default function Wc26LiveBadge(): JSX.Element {
	const { t } = useTranslation();
	return (
		<Box component="span" sx={externalMatchWcLiveBadgeSx} aria-label={t('matchCenter.live')}>
			<Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
				{t('matchCenter.live')}
			</Box>
		</Box>
	);
}
