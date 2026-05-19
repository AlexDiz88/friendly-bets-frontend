import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton, Tooltip } from '@mui/material';
import { t } from 'i18next';
import { useThemeMode } from './ThemeModeContext';

export default function ThemeModeToggle(): JSX.Element {
	const { mode, toggleTheme } = useThemeMode();
	const isDark = mode === 'dark';

	return (
		<Tooltip title={isDark ? t('switchToLightTheme') : t('switchToDarkTheme')}>
			<IconButton
				onClick={toggleTheme}
				color="inherit"
				aria-label={isDark ? t('switchToLightTheme') : t('switchToDarkTheme')}
				sx={{ ml: 1 }}
			>
				{isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
			</IconButton>
		</Tooltip>
	);
}
