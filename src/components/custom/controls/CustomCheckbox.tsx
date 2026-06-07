import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import Checkbox, { type CheckboxProps } from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { customCheckboxSx } from './customToggleStyles';

function UncheckedIcon(): JSX.Element {
	return (
		<Box
			component="span"
			sx={(theme) => ({
				width: 20,
				height: 20,
				borderRadius: '5px',
				border: '2px solid',
				borderColor:
					theme.palette.mode === 'dark' ? 'rgba(148, 163, 184, 0.48)' : 'rgba(148, 163, 184, 0.78)',
				backgroundColor:
					theme.palette.mode === 'dark' ? 'rgba(30, 34, 48, 0.72)' : 'rgba(255, 255, 255, 0.95)',
				display: 'block',
				transition: 'border-color 0.18s ease, box-shadow 0.18s ease',
			})}
		/>
	);
}

function CheckedIcon(): JSX.Element {
	return (
		<Box
			component="span"
			sx={(theme) => ({
				width: 20,
				height: 20,
				borderRadius: '5px',
				border: '1px solid',
				borderColor:
					theme.palette.mode === 'dark' ? 'rgba(129, 140, 248, 0.62)' : 'rgba(99, 102, 241, 0.72)',
				background:
					theme.palette.mode === 'dark'
						? 'linear-gradient(135deg, #1e3a5f 0%, #4338ca 52%, #2563eb 100%)'
						: 'linear-gradient(135deg, #1e3a5f 0%, #4f46e5 48%, #2563eb 100%)',
				boxShadow:
					theme.palette.mode === 'dark'
						? '0 2px 8px rgba(37, 99, 235, 0.42)'
						: '0 2px 8px rgba(37, 99, 235, 0.28)',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				color: '#f8fafc',
			})}
		>
			<CheckRoundedIcon sx={{ fontSize: '0.95rem' }} />
		</Box>
	);
}

const CustomCheckbox = forwardRef<HTMLButtonElement, CheckboxProps>(function CustomCheckbox(
	{ sx, icon, checkedIcon, ...props },
	ref
) {
	return (
		<Checkbox
			ref={ref}
			icon={icon ?? <UncheckedIcon />}
			checkedIcon={checkedIcon ?? <CheckedIcon />}
			sx={[customCheckboxSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
			{...props}
		/>
	);
});

export default CustomCheckbox;
