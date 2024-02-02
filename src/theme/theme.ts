import { createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		background: {
			// default: '#d3d3d3', // цвет фона для всех страниц
		},
	},
	typography: {
		fontFamily: 'Exo 2', // общий шрифт
		button: {
			fontFamily: 'Exo 2', // шрифт для кнопок
		},
	},
	components: {
		MuiAccordion: {
			styleOverrides: {
				root: {
					// стили для всех аккордеонов
					backgroundColor: '#446bc4',
					color: 'white',
					border: '1px solid white',
					'&.Mui-expanded': {
						margin: 0, // Убираем внешние отступы при раскрытии аккордеона
						backgroundColor: '#dd701e',
					},
				},
			},
		},
		MuiAccordionDetails: {
			styleOverrides: {
				root: {
					// стили для контента аккордеона
					backgroundColor: '#e0dfe4',
					color: 'black',
					padding: 0,
					'& .MuiAccordion-root': {
						// стили для вложенных аккордеонов
						backgroundColor: '#38868b',
						color: 'white',
					},
					'&.Mui-expanded': {
						margin: 0, // Убираем внешние отступы при раскрытии аккордеона
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
					// стили для контента аккордеона
					backgroundColor: '#cad1ee',
					color: 'black',
					padding: 0,
					margin: 2,
					height: 35,
					width: 35,
					fontSize: '1.1rem',
				},
				page: {
					// стили для контента аккордеона
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
	},
});
export default theme;
