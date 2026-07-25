import { Box, ButtonBase, Tooltip } from '@mui/material';
import { externalMatchViewBetsChipSx } from './externalMatchWcPageStyles';

interface ExternalMatchViewBetsButtonProps {
	count: number;
	tooltip: string;
	ariaLabel: string;
	onClick: () => void;
}

export default function ExternalMatchViewBetsButton({
	count,
	tooltip,
	ariaLabel,
	onClick,
}: ExternalMatchViewBetsButtonProps): JSX.Element {
	const displayCount = count > 99 ? '99+' : String(count);

	return (
		<Tooltip title={tooltip}>
			<span style={{ display: 'inline-flex', alignItems: 'center', lineHeight: 0 }}>
				<ButtonBase
					onClick={(e) => {
						e.stopPropagation();
						onClick();
					}}
					aria-label={ariaLabel}
					sx={externalMatchViewBetsChipSx}
				>
					<Box
						component="span"
						sx={{
							fontFamily: "'Exo 2', sans-serif",
							fontSize: '0.7rem',
							fontWeight: 800,
							lineHeight: 1,
							fontVariantNumeric: 'tabular-nums',
							letterSpacing: '-0.03em',
							color: (theme) =>
								theme.palette.mode === 'dark' ? '#9de8c4' : '#046a3d',
						}}
					>
						{displayCount}
					</Box>
				</ButtonBase>
			</span>
		</Tooltip>
	);
}
