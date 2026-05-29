import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton, Tooltip, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { headerIconButtonSx } from '../components/header/headerPageStyles';
import { useThemeMode } from './ThemeModeContext';

export default function ThemeModeToggle(): JSX.Element {
	const { mode, toggleTheme } = useThemeMode();
	const isDark = mode === 'dark';

	return (
		<Tooltip title={isDark ? t('switchToLightTheme') : t('switchToDarkTheme')}>
			<span>
				<IconButton
					onClick={toggleTheme}
					aria-label={isDark ? t('switchToLightTheme') : t('switchToDarkTheme')}
					sx={[headerIconButtonSx, { ml: 1 }] as SxProps<Theme>}
				>
					{isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
				</IconButton>
			</span>
		</Tooltip>
	);
}
