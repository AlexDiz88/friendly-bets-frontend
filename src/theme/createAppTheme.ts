import { createTheme, type Theme, type ThemeOptions } from '@mui/material/styles';

export type AppThemeMode = 'light' | 'dark';

const sharedTypography: ThemeOptions['typography'] = {
	fontFamily: 'Exo 2',
	button: {
		fontFamily: 'Exo 2',
	},
};

function getComponentOverrides(mode: AppThemeMode): ThemeOptions['components'] {
	if (mode === 'light') {
		return {
			MuiAccordion: {
				styleOverrides: {
					root: {
						backgroundColor: '#446bc4',
						color: 'white',
						border: '1px solid white',
						'&.Mui-expanded': {
							margin: 0,
							backgroundColor: '#dd701e',
						},
					},
				},
			},
			MuiAccordionDetails: {
				styleOverrides: {
					root: {
						backgroundColor: '#e0dfe4',
						color: 'black',
						padding: 0,
						'& .MuiAccordion-root': {
							backgroundColor: '#38868b',
							color: 'white',
						},
						'&.Mui-expanded': {
							margin: 0,
						},
					},
				},
			},
			MuiAccordionSummary: {
				styleOverrides: {
					root: {
						'&.Mui-expanded': {
							minHeight: 0,
						},
					},
					content: {
						'&.Mui-expanded': {
							margin: '12px 0',
						},
					},
				},
			},
			MuiPaginationItem: {
				styleOverrides: {
					root: {
						backgroundColor: '#cad1ee',
						color: 'black',
						padding: 0,
						margin: 2,
						height: 35,
						width: 35,
						fontSize: '1.1rem',
					},
					page: {
						backgroundColor: '#446bc4',
						color: 'whitesmoke',
						padding: 0,
						margin: 2,
						height: 35,
						width: 35,
						fontSize: '1.1rem',
					},
				},
			},
			MuiTableCell: {
				styleOverrides: {
					root: {
						padding: 0,
					},
				},
			},
		};
	}

	return {
		MuiAccordion: {
			styleOverrides: {
				root: {
					backgroundColor: '#2a4a8a',
					color: '#f5f5f5',
					border: '1px solid #4a6ab5',
					'&.Mui-expanded': {
						margin: 0,
						backgroundColor: '#b85a18',
					},
				},
			},
		},
		MuiAccordionDetails: {
			styleOverrides: {
				root: {
					backgroundColor: '#2d3142',
					color: '#e8e8e8',
					padding: 0,
					'& .MuiAccordion-root': {
						backgroundColor: '#2d6a6e',
						color: '#f0f0f0',
					},
					'&.Mui-expanded': {
						margin: 0,
					},
				},
			},
		},
		MuiAccordionSummary: {
			styleOverrides: {
				root: {
					'&.Mui-expanded': {
						minHeight: 0,
					},
				},
				content: {
					'&.Mui-expanded': {
						margin: '12px 0',
					},
				},
			},
		},
		MuiPaginationItem: {
			styleOverrides: {
				root: {
					backgroundColor: '#3d4460',
					color: '#e0e0e0',
					padding: 0,
					margin: 2,
					height: 35,
					width: 35,
					fontSize: '1.1rem',
				},
				page: {
					backgroundColor: '#5b8def',
					color: '#fff',
					padding: 0,
					margin: 2,
					height: 35,
					width: 35,
					fontSize: '1.1rem',
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: 'none',
				},
			},
		},
	};
}

function getPalette(mode: AppThemeMode): ThemeOptions['palette'] {
	if (mode === 'light') {
		return {
			mode: 'light',
			primary: {
				main: '#446bc4',
				dark: '#1e3471',
				light: '#6b8fd4',
			},
			secondary: {
				main: '#dd701e',
			},
			background: {
				default: '#f4f5f8',
				paper: '#ffffff',
			},
		};
	}

	return {
		mode: 'dark',
		primary: {
			main: '#5b8def',
			dark: '#1e3471',
			light: '#8fb3f5',
		},
		secondary: {
			main: '#dd701e',
		},
		background: {
			default: '#12141c',
			paper: '#1e2230',
		},
		text: {
			primary: '#e8eaef',
			secondary: '#b4b8c4',
		},
	};
}

export function createAppTheme(mode: AppThemeMode): Theme {
	return createTheme({
		palette: getPalette(mode),
		typography: sharedTypography,
		components: getComponentOverrides(mode),
	});
}

export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');
