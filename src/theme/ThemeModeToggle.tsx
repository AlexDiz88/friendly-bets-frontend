import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { IconButton, Tooltip, type SxProps, type Theme } from '@mui/material';
import { t } from 'i18next';
import { useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/selectors';
import { headerIconButtonSx } from '../components/header/headerPageStyles';
import { useThemeMode } from './ThemeModeContext';

type Props = {
	iconButtonSx?: SxProps<Theme>;
};

export default function ThemeModeToggle({ iconButtonSx }: Props): JSX.Element | null {
	const user = useAppSelector(selectUser);
	const { mode, toggleTheme } = useThemeMode();
	const isDark = mode === 'dark';

	const showToggle = user === undefined ? true : (user.showThemeToggle ?? true);
	if (!showToggle) {
		return null;
	}

	return (
		<Tooltip title={isDark ? t('switchToLightTheme') : t('switchToDarkTheme')}>
			<span>
				<IconButton
					onClick={toggleTheme}
					aria-label={isDark ? t('switchToLightTheme') : t('switchToDarkTheme')}
					sx={
						[
							headerIconButtonSx,
							iconButtonSx ?? { ml: 1 },
						] as SxProps<Theme>
					}
				>
					{isDark ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
				</IconButton>
			</span>
		</Tooltip>
	);
}
