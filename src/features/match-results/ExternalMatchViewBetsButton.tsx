import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import { Badge, IconButton, Tooltip } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface ExternalMatchViewBetsButtonProps {
	count: number;
	tooltip: string;
	ariaLabel: string;
	onClick: () => void;
	iconSx?: SxProps<Theme>;
	badgeSx?: SxProps<Theme>;
}

export default function ExternalMatchViewBetsButton({
	count,
	tooltip,
	ariaLabel,
	onClick,
	iconSx,
	badgeSx,
}: ExternalMatchViewBetsButtonProps): JSX.Element {
	return (
		<Tooltip title={tooltip}>
			<span>
				<IconButton
					size="small"
					onClick={(e) => {
						e.stopPropagation();
						onClick();
					}}
					sx={{ p: 0.35, minWidth: 32, minHeight: 32 }}
					aria-label={ariaLabel}
				>
					<Badge
						badgeContent={count}
						color="primary"
						showZero
						max={99}
						sx={[
							{
								'& .MuiBadge-badge': {
									fontSize: '0.7rem',
									mt: 0.25,
									mr: 0.15,
									height: 20,
									minWidth: 20,
									padding: 0,
									fontWeight: 700,
									lineHeight: 9,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxSizing: 'border-box',
									fontVariantNumeric: 'tabular-nums',
								},
							},
							...(badgeSx ? (Array.isArray(badgeSx) ? badgeSx : [badgeSx]) : []),
						]}
					>
						<GroupsOutlinedIcon
							sx={[{ fontSize: 22 }, ...(iconSx ? (Array.isArray(iconSx) ? iconSx : [iconSx]) : [])]}
						/>
					</Badge>
				</IconButton>
			</span>
		</Tooltip>
	);
}
