import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectUser } from '../features/auth/selectors';
import { saveUserThemeSettingsAsync } from '../features/theme/themeSlice';
import {
	normalizeThemePreference,
	resolveThemeMode,
	type ThemePreference,
} from '../features/theme/themePreferences';
import { darkTheme, lightTheme, type AppThemeMode } from './createAppTheme';

const STORAGE_KEY = 'friendly-bets-theme-mode';

type ThemeModeContextValue = {
	preference: ThemePreference;
	mode: AppThemeMode;
	toggleTheme: () => void;
	setPreference: (preference: ThemePreference) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredPreference(): ThemePreference {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return normalizeThemePreference(stored);
	} catch {
		return 'light';
	}
}

function persistPreference(preference: ThemePreference): void {
	try {
		localStorage.setItem(STORAGE_KEY, preference);
	} catch {
		/* ignore */
	}
}

function readSystemPrefersDark(): boolean {
	if (typeof window === 'undefined' || !window.matchMedia) {
		return false;
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function ThemeModeProvider({ children }: { children: ReactNode }): JSX.Element {
	const dispatch = useAppDispatch();
	const user = useAppSelector(selectUser);
	const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
	const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(readSystemPrefersDark);

	useEffect(() => {
		if (typeof window === 'undefined' || !window.matchMedia) {
			return;
		}
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = (event: MediaQueryListEvent): void => {
			setSystemPrefersDark(event.matches);
		};
		setSystemPrefersDark(mediaQuery.matches);
		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, []);

	useEffect(() => {
		if (user?.themePreference) {
			const next = normalizeThemePreference(user.themePreference);
			setPreferenceState(next);
			persistPreference(next);
		}
	}, [user?.themePreference]);

	const setPreference = useCallback((next: ThemePreference) => {
		setPreferenceState(next);
		persistPreference(next);
	}, []);

	const mode = useMemo(
		() => resolveThemeMode(preference, systemPrefersDark),
		[preference, systemPrefersDark]
	);

	const toggleTheme = useCallback(() => {
		const nextPreference: ThemePreference = mode === 'light' ? 'dark' : 'light';
		setPreference(nextPreference);
		if (user) {
			void dispatch(
				saveUserThemeSettingsAsync({
					themePreference: nextPreference,
					showThemeToggle: user.showThemeToggle ?? true,
				})
			);
		}
	}, [dispatch, mode, setPreference, user]);

	const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', mode);
	}, [mode]);

	const value = useMemo(
		() => ({ preference, mode, toggleTheme, setPreference }),
		[preference, mode, toggleTheme, setPreference]
	);

	return (
		<ThemeModeContext.Provider value={value}>
			<ThemeProvider theme={theme}>
				<CssBaseline enableColorScheme />
				{children}
			</ThemeProvider>
		</ThemeModeContext.Provider>
	);
}

export function useThemeMode(): ThemeModeContextValue {
	const ctx = useContext(ThemeModeContext);
	if (!ctx) {
		throw new Error('useThemeMode must be used within ThemeModeProvider');
	}
	return ctx;
}

export type { AppThemeMode, ThemePreference };
