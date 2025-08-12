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

const betTitleTableThemes = [
	{
		cardBg: 'linear-gradient(135deg, #1c2e07, #3b5410)',
		cardText: '#e6e9d1',
		headerBg: '#42610eff',
		headerText: '#d9f0b4',
		win: '#4ade80',
		loss: '#F94B4BFF',
		neutral: '#ffffff',
		shadow: '0 0 12px #3b7d00cc',
	},
	{
		cardBg: 'linear-gradient(135deg, #1f1f1f, #3a3a3a)',
		cardText: '#f0f0f0',
		headerBg: '#2d2d2d',
		headerText: '#bbbbbb',
		win: '#00ff9d',
		loss: '#ff4d4d',
		neutral: '#ffffff',
		shadow: '0 0 12px #444',
	},
	{
		cardBg: 'linear-gradient(135deg, #001f3f, #003366)',
		cardText: '#cce7ff',
		headerBg: '#004080',
		headerText: '#99ccff',
		win: '#33ccff',
		loss: '#ff3366',
		neutral: '#ffffff',
		shadow: '0 0 12px #005599cc',
	},
] as const;
