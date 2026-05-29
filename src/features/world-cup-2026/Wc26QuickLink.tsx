import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
	wc26QuickLinkCardSx,
	wc26QuickLinkChevronSx,
	wc26QuickLinkHintSx,
	wc26QuickLinkIconSx,
	wc26QuickLinkTitleSx,
} from './wc26PageStyles';

/** Компактный баннер-ссылка на расписание ЧМ-2026 (главная и др.). */
export default function Wc26QuickLink(): JSX.Element {
	const { t } = useTranslation();

	return (
		<Box component={Link} to="/world-cup-2026" sx={wc26QuickLinkCardSx}>
			<Box sx={wc26QuickLinkIconSx}>
				<EmojiEventsIcon fontSize="small" />
			</Box>
			<Box sx={{ flex: 1, minWidth: 0, position: 'relative', zIndex: 1 }}>
				<Typography component="p" sx={wc26QuickLinkTitleSx}>
					{t('wc26.quickLinkTitle')}
				</Typography>
				<Typography component="p" sx={wc26QuickLinkHintSx}>
					{t('wc26.quickLinkHint')}
				</Typography>
			</Box>
			<ChevronRightIcon sx={wc26QuickLinkChevronSx} />
		</Box>
	);
}
