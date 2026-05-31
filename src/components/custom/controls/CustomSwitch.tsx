import Switch, { type SwitchProps } from '@mui/material/Switch';
import { forwardRef } from 'react';
import { customSwitchSx } from './customToggleStyles';

const CustomSwitch = forwardRef<HTMLButtonElement, SwitchProps>(function CustomSwitch(
	{ sx, ...props },
	ref
) {
	return <Switch ref={ref} sx={[customSwitchSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]} {...props} />;
});

export default CustomSwitch;
