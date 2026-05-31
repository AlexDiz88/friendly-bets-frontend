import type { Components, Theme } from '@mui/material/styles';
import type { SxProps } from '@mui/material';

const switchTransition = 'background 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease, transform 0.22s cubic-bezier(0.4, 0, 0.2, 1)';

function switchPalette(theme: Theme) {
	const isDark = theme.palette.mode === 'dark';
	return {
		trackOff: isDark ? 'rgba(55, 65, 81, 0.85)' : 'rgba(203, 213, 225, 0.95)',
		trackOffBorder: isDark ? 'rgba(148, 163, 184, 0.28)' : 'rgba(148, 163, 184, 0.55)',
		trackOn: isDark
			? 'linear-gradient(135deg, #1e3a5f 0%, #4338ca 52%, #2563eb 100%)'
			: 'linear-gradient(135deg, #1e3a5f 0%, #4f46e5 48%, #2563eb 100%)',
		trackOnBorder: isDark ? 'rgba(129, 140, 248, 0.55)' : 'rgba(99, 102, 241, 0.62)',
		trackOnShadow: isDark
			? '0 2px 8px rgba(37, 99, 235, 0.45), inset 0 1px 0 rgba(191, 219, 254, 0.18)'
			: '0 2px 10px rgba(37, 99, 235, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
		thumb: '#ffffff',
		thumbShadow: isDark
			? '0 2px 6px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.08)'
			: '0 2px 6px rgba(15, 23, 42, 0.22), 0 0 0 1px rgba(255, 255, 255, 0.65)',
	};
}

export function getMuiSwitchStyleOverrides(): NonNullable<Components<Theme>['MuiSwitch']> {
	return {
		defaultProps: {
			disableRipple: true,
		},
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => {
				const p = switchPalette(theme);
				return {
					width: 42,
					height: 22,
					padding: 0,
					overflow: 'visible',
					'& .MuiSwitch-switchBase': {
						padding: 1,
						transition: switchTransition,
						'&.Mui-checked': {
							transform: 'translateX(20px)',
							color: p.thumb,
							'& + .MuiSwitch-track': {
								opacity: 1,
								background: p.trackOn,
								borderColor: p.trackOnBorder,
								boxShadow: p.trackOnShadow,
							},
							'&:hover': {
								backgroundColor: 'transparent',
							},
						},
						'&.Mui-disabled': {
							opacity: 0.42,
							'& + .MuiSwitch-track': {
								opacity: 0.55,
							},
						},
						'&:hover': {
							backgroundColor: 'transparent',
						},
					},
					'& .MuiSwitch-thumb': {
						width: 20,
						height: 20,
						boxShadow: p.thumbShadow,
						backgroundColor: p.thumb,
					},
					'& .MuiSwitch-track': {
						opacity: 1,
						borderRadius: 11,
						border: '1px solid',
						borderColor: p.trackOffBorder,
						backgroundColor: p.trackOff,
						transition: switchTransition,
					},
				};
			},
			sizeSmall: ({ theme }: { theme: Theme }) => {
				const p = switchPalette(theme);
				return {
					width: 34,
					height: 20,
					'& .MuiSwitch-switchBase': {
						padding: 1,
						'&.Mui-checked': {
							transform: 'translateX(15px)',
						},
					},
					'& .MuiSwitch-thumb': {
						width: 17,
						height: 17,
						boxShadow: p.thumbShadow,
					},
					'& .MuiSwitch-track': {
						borderRadius: 10,
					},
				};
			},
		},
	};
}

export function getMuiCheckboxStyleOverrides(): NonNullable<Components<Theme>['MuiCheckbox']> {
	return {
		defaultProps: {
			disableRipple: true,
		},
		styleOverrides: {
			root: ({ theme }: { theme: Theme }) => {
				return {
					padding: 6,
					borderRadius: '6px',
					transition: 'background-color 0.18s ease, transform 0.12s ease',
					'&:hover': {
						backgroundColor:
							theme.palette.mode === 'dark' ? 'rgba(37, 99, 235, 0.12)' : 'rgba(219, 234, 254, 0.65)',
					},
					'&.Mui-disabled': {
						opacity: 0.42,
					},
					'&:active:not(.Mui-disabled) span': {
						transform: 'scale(0.94)',
					},
				};
			},
			sizeSmall: {
				padding: 4,
				'& .MuiSvgIcon-root': {
					fontSize: '1.15rem',
				},
			},
		},
	};
}

/** Дополнительные sx для экземпляров с локальными переопределениями */
export const customSwitchSx: SxProps<Theme> = {
	'& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
		opacity: 1,
	},
};

export const customCheckboxSx: SxProps<Theme> = {};

/** FormControlLabel рядом с Switch — центр по вертикали и зазор */
export const toggleFormControlLabelSx: SxProps<Theme> = {
	alignItems: 'center',
	gap: 1,
	ml: 0,
	mr: 0,
	'& .MuiFormControlLabel-label': {
		margin: 0,
		lineHeight: 1.4,
	},
};

/** Чекбокс/переключатель и текст в одной строке */
export const toggleInlineRowSx: SxProps<Theme> = {
	display: 'inline-flex',
	alignItems: 'center',
	gap: 1,
};
