import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import {
	ADMIN_PANEL_SX,
	ADMIN_SECTION_DANGER_SX,
	ADMIN_SECTION_HINT_SX,
	ADMIN_SECTION_TITLE_SX,
} from './adminPanelStyles';

type AdminSectionProps = {
	title: string;
	hint?: string;
	variant?: 'default' | 'danger';
	children: React.ReactNode;
	sx?: SxProps<Theme>;
};

export default function AdminSection({
	title,
	hint,
	variant = 'default',
	children,
	sx,
}: AdminSectionProps): JSX.Element {
	return (
		<Box
			sx={[
				ADMIN_PANEL_SX,
				variant === 'danger' ? ADMIN_SECTION_DANGER_SX : null,
				...(Array.isArray(sx) ? sx : sx ? [sx] : []),
			]}
		>
			<Typography sx={{ ...ADMIN_SECTION_TITLE_SX, mb: hint ? 0.5 : 1.25 }}>{title}</Typography>
			{hint ? (
				<Typography variant="body2" sx={ADMIN_SECTION_HINT_SX}>
					{hint}
				</Typography>
			) : null}
			{children}
		</Box>
	);
}
