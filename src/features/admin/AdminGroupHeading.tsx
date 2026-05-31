import { Typography } from '@mui/material';
import { ADMIN_GROUP_HEADING_SX } from './adminPanelStyles';

export default function AdminGroupHeading({ label }: { label: string }): JSX.Element {
	return <Typography component="span" sx={ADMIN_GROUP_HEADING_SX}>{label}</Typography>;
}
