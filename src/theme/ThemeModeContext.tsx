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
import { darkTheme, lightTheme, type AppThemeMode } from './createAppTheme';

const STORAGE_KEY = 'friendly-bets-theme-mode';

type ThemeModeContextValue = {
	mode: AppThemeMode;
	toggleTheme: () => void;
	setMode: (mode: AppThemeMode) => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue | null>(null);

function readStoredMode(): AppThemeMode {
	try {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored === 'dark' ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

export function ThemeModeProvider({ children }: { children: ReactNode }): JSX.Element {
	const [mode, setModeState] = useState<AppThemeMode>(readStoredMode);

	const setMode = useCallback((next: AppThemeMode) => {
		setModeState(next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			/* ignore */
		}
	}, []);

	const toggleTheme = useCallback(() => {
		setModeState((prev) => {
			const next: AppThemeMode = prev === 'light' ? 'dark' : 'light';
			try {
				localStorage.setItem(STORAGE_KEY, next);
			} catch {
				/* ignore */
			}
			return next;
		});
	}, []);

	const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', mode);
	}, [mode]);

	const value = useMemo(
		() => ({ mode, toggleTheme, setMode }),
		[mode, toggleTheme, setMode]
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

export type { AppThemeMode };
