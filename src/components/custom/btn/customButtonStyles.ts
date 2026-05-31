import type { SxProps, Theme } from '@mui/material';

/** Палитра кнопок согласована с headerPageStyles (navy + синий акцент) */
const btn = {
	dark: {
		primary: {
			glow: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(37, 99, 235, 0.38) 0%, transparent 72%)',
			bar: 'linear-gradient(180deg, rgba(30, 52, 88, 0.94) 0%, rgba(13, 31, 60, 0.96) 52%, rgba(10, 22, 40, 0.98) 100%)',
			border: 'rgba(59, 130, 246, 0.38)',
			borderHover: 'rgba(96, 165, 250, 0.55)',
			text: '#f0f7ff',
		},
		secondary: {
			glow: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(99, 102, 241, 0.42) 0%, transparent 72%)',
			bar: 'linear-gradient(135deg, #1e3a5f 0%, #4338ca 48%, #2563eb 100%)',
			border: 'rgba(129, 140, 248, 0.45)',
			borderHover: 'rgba(165, 180, 252, 0.62)',
			text: '#eef2ff',
		},
		success: {
			bar: 'linear-gradient(180deg, #0d5c52 0%, #047857 55%, #065f46 100%)',
			border: 'rgba(45, 212, 191, 0.35)',
			borderHover: 'rgba(94, 234, 212, 0.5)',
			text: '#ecfdf5',
		},
		warning: {
			bar: 'linear-gradient(180deg, #9a3412 0%, #c2410c 52%, #7c2d12 100%)',
			border: 'rgba(251, 146, 60, 0.4)',
			borderHover: 'rgba(253, 186, 116, 0.55)',
			text: '#fff7ed',
		},
		error: {
			glow: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(239, 68, 68, 0.38) 0%, transparent 72%)',
			bar: 'linear-gradient(180deg, #7f1d1d 0%, #dc2626 48%, #991b1b 100%)',
			border: 'rgba(248, 113, 113, 0.48)',
			borderHover: 'rgba(252, 165, 165, 0.68)',
			text: '#fff5f5',
		},
		outlinedBg: 'rgba(13, 31, 60, 0.42)',
		outlinedBgHover: 'rgba(30, 52, 88, 0.55)',
		mutedText: '#b4b8c4',
	},
	light: {
		primary: {
			glow: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(37, 99, 235, 0.28) 0%, transparent 72%)',
			bar: 'linear-gradient(180deg, #1a2d4a 0%, #0d1f3c 52%, #0a1628 100%)',
			border: 'rgba(37, 99, 235, 0.42)',
			borderHover: 'rgba(59, 130, 246, 0.58)',
			text: '#f0f7ff',
		},
		secondary: {
			glow: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(79, 70, 229, 0.32) 0%, transparent 72%)',
			bar: 'linear-gradient(135deg, #1e3a5f 0%, #4f46e5 48%, #2563eb 100%)',
			border: 'rgba(99, 102, 241, 0.5)',
			borderHover: 'rgba(129, 140, 248, 0.68)',
			text: '#eef2ff',
		},
		success: {
			bar: 'linear-gradient(180deg, #0f766e 0%, #059669 55%, #047857 100%)',
			border: 'rgba(16, 185, 129, 0.45)',
			borderHover: 'rgba(52, 211, 153, 0.6)',
			text: '#ecfdf5',
		},
		warning: {
			bar: 'linear-gradient(180deg, #b45309 0%, #d97706 52%, #92400e 100%)',
			border: 'rgba(245, 158, 11, 0.5)',
			borderHover: 'rgba(251, 191, 36, 0.65)',
			text: '#fffbeb',
		},
		error: {
			glow: 'radial-gradient(ellipse 100% 80% at 50% 0%, rgba(220, 38, 38, 0.32) 0%, transparent 72%)',
			bar: 'linear-gradient(180deg, #991b1b 0%, #ef4444 48%, #b91c1c 100%)',
			border: 'rgba(220, 38, 38, 0.55)',
			borderHover: 'rgba(248, 113, 113, 0.75)',
			text: '#fff5f5',
		},
		outlinedBg: 'rgba(255, 255, 255, 0.72)',
		outlinedBgHover: 'rgba(232, 240, 255, 0.95)',
		mutedText: '#475569',
	},
} as const;

export const CUSTOM_BUTTON_FONT = "'Exo 2', system-ui, sans-serif";

export type CustomButtonColor =
	| 'inherit'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'error'
	| 'info'
	| 'warning';

export type CustomButtonVariant = 'text' | 'contained' | 'outlined';

export const customButtonLabelSx = (textSize: string): SxProps<Theme> => ({
	fontWeight: 600,
	fontSize: textSize,
	fontFamily: CUSTOM_BUTTON_FONT,
	textTransform: 'none',
	letterSpacing: '0.02em',
	lineHeight: 1.25,
});

const convexShadow = {
	rest: '0 4px 14px rgba(10, 22, 40, 0.42), 0 1px 0 rgba(147, 197, 253, 0.2) inset, 0 -1px 0 rgba(10, 22, 40, 0.35) inset',
	hover: '0 6px 18px rgba(10, 22, 40, 0.48), 0 1px 0 rgba(191, 219, 254, 0.28) inset, 0 -1px 0 rgba(10, 22, 40, 0.38) inset',
	active: '0 2px 6px rgba(10, 22, 40, 0.38), 0 2px 6px rgba(10, 22, 40, 0.35) inset',
};

const dangerConvexShadow = {
	rest: '0 4px 16px rgba(127, 29, 29, 0.5), 0 1px 0 rgba(252, 165, 165, 0.24) inset, 0 -1px 0 rgba(69, 10, 10, 0.42) inset',
	hover: '0 6px 20px rgba(185, 28, 28, 0.55), 0 1px 0 rgba(254, 202, 202, 0.32) inset, 0 -1px 0 rgba(69, 10, 10, 0.48) inset',
	active: '0 2px 8px rgba(127, 29, 29, 0.45), 0 2px 6px rgba(69, 10, 10, 0.4) inset',
};

/** Подпись предупреждения в диалогах деструктивных действий */
export const destructiveActionHintSx: SxProps<Theme> = (theme) => ({
	color: theme.palette.mode === 'dark' ? '#fca5a5' : '#b91c1c',
	fontWeight: 600,
});

const baseRootSx: SxProps<Theme> = {
	height: '2.25rem',
	minWidth: '4.5rem',
	px: 1.75,
	borderRadius: '7px',
	textTransform: 'none',
	fontFamily: CUSTOM_BUTTON_FONT,
	backdropFilter: 'blur(10px)',
	WebkitBackdropFilter: 'blur(10px)',
	transition:
		'background 0.18s ease, border-color 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease',
	'&.Mui-disabled': {
		opacity: 0.45,
		color: 'inherit',
		transform: 'none',
	},
};

type ContainedRole = {
	bar: string;
	border: string;
	borderHover: string;
	text: string;
	glow?: string;
};

function containedGlass(role: ContainedRole, withGlow: boolean, danger = false): SxProps<Theme> {
	const backgroundImage = withGlow && role.glow ? `${role.glow}, ${role.bar}` : role.bar;
	const shadow = danger ? dangerConvexShadow : convexShadow;
	return {
		border: '1px solid',
		borderColor: role.border,
		backgroundImage,
		color: role.text,
		boxShadow: shadow.rest,
		'&:hover': {
			backgroundImage,
			borderColor: role.borderHover,
			boxShadow: shadow.hover,
			transform: 'translateY(-1px)',
		},
		'&:active': {
			backgroundImage,
			boxShadow: shadow.active,
			transform: 'translateY(0)',
		},
	};
}

function outlinedRole(
	border: string,
	hoverBorder: string,
	text: string,
	bg: string,
	hoverBg: string
): SxProps<Theme> {
	return {
		border: '1px solid',
		borderColor: border,
		background: bg,
		backdropFilter: 'blur(8px)',
		WebkitBackdropFilter: 'blur(8px)',
		color: text,
		boxShadow: '0 1px 0 rgba(255, 255, 255, 0.06) inset',
		'&:hover': {
			borderColor: hoverBorder,
			background: hoverBg,
			boxShadow: '0 2px 10px rgba(10, 22, 40, 0.12), 0 1px 0 rgba(147, 197, 253, 0.12) inset',
		},
		'&:active': {
			boxShadow: '0 2px 4px rgba(10, 22, 40, 0.2) inset',
		},
	};
}

function textRole(color: string, hoverBg: string): SxProps<Theme> {
	return {
		background: 'transparent',
		backdropFilter: 'none',
		boxShadow: 'none',
		color,
		minWidth: 0,
		px: 1,
		'&:hover': {
			background: hoverBg,
			boxShadow: 'none',
			transform: 'none',
		},
	};
}

export function customButtonRootSx(
	buttonColor: CustomButtonColor,
	buttonVariant: CustomButtonVariant
): SxProps<Theme> {
	return (theme) => {
		const isDark = theme.palette.mode === 'dark';
		const p = isDark ? btn.dark : btn.light;

		let roleSx: SxProps<Theme> = {};

		if (buttonVariant === 'contained') {
			switch (buttonColor) {
				case 'secondary':
					roleSx = containedGlass(p.secondary, true);
					break;
				case 'success':
					roleSx = containedGlass(p.success, false);
					break;
				case 'error':
					roleSx = containedGlass(p.error, true, true);
					break;
				case 'warning':
					roleSx = containedGlass(p.warning, false);
					break;
				case 'inherit':
					roleSx = {
						border: '1px solid',
						borderColor: isDark ? 'rgba(180, 184, 196, 0.32)' : 'rgba(100, 116, 139, 0.35)',
						background: isDark
							? 'linear-gradient(180deg, rgba(52, 58, 74, 0.9) 0%, rgba(40, 44, 58, 0.95) 100%)'
							: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
						color: isDark ? '#e8eaef' : '#334155',
						boxShadow: convexShadow.rest,
						'&:hover': {
							borderColor: isDark ? 'rgba(180, 184, 196, 0.5)' : 'rgba(100, 116, 139, 0.5)',
							boxShadow: convexShadow.hover,
							transform: 'translateY(-1px)',
						},
						'&:active': {
							boxShadow: convexShadow.active,
							transform: 'translateY(0)',
						},
					};
					break;
				case 'primary':
				case 'info':
				default:
					roleSx = containedGlass(p.primary, true);
					break;
			}
		} else if (buttonVariant === 'outlined') {
			const navyBorder = isDark ? 'rgba(59, 130, 246, 0.32)' : 'rgba(37, 99, 235, 0.38)';
			const navyHoverBorder = isDark ? 'rgba(96, 165, 250, 0.5)' : 'rgba(59, 130, 246, 0.58)';
			const indigoBorder = isDark ? 'rgba(129, 140, 248, 0.35)' : 'rgba(99, 102, 241, 0.45)';
			const indigoHoverBorder = isDark ? 'rgba(165, 180, 252, 0.55)' : 'rgba(129, 140, 248, 0.62)';

			switch (buttonColor) {
				case 'secondary':
					roleSx = outlinedRole(
						indigoBorder,
						indigoHoverBorder,
						isDark ? '#a5b4fc' : '#4338ca',
						p.outlinedBg,
						p.outlinedBgHover
					);
					break;
				case 'warning':
					roleSx = outlinedRole(
						p.warning.border,
						p.warning.borderHover,
						isDark ? '#fdba74' : '#c2410c',
						isDark ? 'rgba(124, 45, 18, 0.2)' : 'rgba(255, 247, 237, 0.9)',
						isDark ? 'rgba(154, 52, 18, 0.32)' : 'rgba(254, 243, 199, 0.95)'
					);
					break;
				case 'error':
					roleSx = outlinedRole(
						p.error.border,
						p.error.borderHover,
						isDark ? '#fca5a5' : '#b91c1c',
						isDark ? 'rgba(127, 29, 29, 0.22)' : 'rgba(254, 242, 242, 0.92)',
						isDark ? 'rgba(153, 27, 27, 0.35)' : 'rgba(254, 226, 226, 0.95)'
					);
					break;
				case 'success':
					roleSx = outlinedRole(
						p.success.border,
						p.success.borderHover,
						isDark ? '#5eead4' : '#047857',
						p.outlinedBg,
						isDark ? 'rgba(6, 95, 70, 0.28)' : 'rgba(236, 253, 245, 0.95)'
					);
					break;
				case 'inherit':
					roleSx = outlinedRole(
						isDark ? 'rgba(180, 184, 196, 0.28)' : 'rgba(100, 116, 139, 0.32)',
						isDark ? 'rgba(180, 184, 196, 0.48)' : 'rgba(71, 85, 105, 0.48)',
						p.mutedText,
						p.outlinedBg,
						p.outlinedBgHover
					);
					break;
				case 'primary':
				case 'info':
				default:
					roleSx = outlinedRole(
						navyBorder,
						navyHoverBorder,
						isDark ? '#93c5fd' : '#1d4ed8',
						p.outlinedBg,
						p.outlinedBgHover
					);
					break;
			}
		} else {
			const navText = isDark ? '#93c5fd' : '#1d4ed8';
			const indigoText = isDark ? '#a5b4fc' : '#4338ca';

			switch (buttonColor) {
				case 'secondary':
					roleSx = textRole(indigoText, isDark ? 'rgba(67, 56, 202, 0.18)' : 'rgba(238, 242, 255, 0.9)');
					break;
				case 'warning':
					roleSx = textRole(
						isDark ? '#fdba74' : '#c2410c',
						isDark ? 'rgba(154, 52, 18, 0.2)' : 'rgba(255, 247, 237, 0.9)'
					);
					break;
				case 'error':
					roleSx = textRole(
						isDark ? '#fca5a5' : '#b91c1c',
						isDark ? 'rgba(127, 29, 29, 0.22)' : 'rgba(254, 242, 242, 0.92)'
					);
					break;
				case 'success':
					roleSx = textRole(
						isDark ? '#5eead4' : '#047857',
						isDark ? 'rgba(6, 95, 70, 0.2)' : 'rgba(236, 253, 245, 0.9)'
					);
					break;
				case 'inherit':
					roleSx = textRole(p.mutedText, isDark ? 'rgba(40, 44, 58, 0.45)' : 'rgba(0, 0, 0, 0.04)');
					break;
				default:
					roleSx = textRole(navText, isDark ? 'rgba(37, 99, 235, 0.14)' : 'rgba(219, 234, 254, 0.9)');
					break;
			}
		}

		return {
			...baseRootSx,
			...roleSx,
		};
	};
}
