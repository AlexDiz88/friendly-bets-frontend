import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { liveMatchBadgeSx } from './liveMatchBadgeStyles';

/** Glass shimmer LIVE pill — same look as former WC26 match cards. */
export default function LiveMatchBadge(): JSX.Element {
	const { t } = useTranslation();
	return (
		<Box component="span" sx={liveMatchBadgeSx} aria-label={t('matchCenter.live')}>
			<Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
				{t('matchCenter.live')}
			</Box>
		</Box>
	);
}
