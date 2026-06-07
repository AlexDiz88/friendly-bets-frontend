import { Link } from '@mui/material';
import type { AppThemeMode } from '../../theme/createAppTheme';

const NEWS_ACCENT_COLOR: Record<AppThemeMode, string> = {
	light: 'brown',
	dark: '#e89a4a',
};

/** Shared rich-text tags for siteNews Trans blocks. */
export function getNewsTransComponents(mode: AppThemeMode) {
	return {
		strong: <strong />,
		em: <em />,
		br: <br />,
		accent: <strong style={{ color: NEWS_ACCENT_COLOR[mode] }} />,
		closing: <strong style={{ color: 'green' }} />,
		mongoLink: (
			<Link href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" />
		),
	};
}
