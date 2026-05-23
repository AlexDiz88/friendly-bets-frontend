import { Avatar, Box, TableCell, TableCellProps } from '@mui/material';
import { ReactNode } from 'react';

type StatsTableIdentityCellProps = {
	avatarSrc: string;
	avatarAlt?: string;
	avatarSize: number;
	label: ReactNode;
	/** Expand/collapse indicator — rendered flush left before the avatar */
	leading?: ReactNode;
	labelSx?: object;
	cellSx?: TableCellProps['sx'];
};

/**
 * Avatar + name inside a stats table row. Flex layout must stay on the inner Box —
 * never on TableCell (breaks table layout and shows a stray border under the name).
 */
export default function StatsTableIdentityCell({
	avatarSrc,
	avatarAlt = '',
	avatarSize,
	label,
	leading,
	labelSx,
	cellSx,
}: StatsTableIdentityCellProps): JSX.Element {
	return (
		<TableCell
			component="th"
			scope="row"
			sx={{
				p: 0.5,
				fontWeight: 600,
				verticalAlign: 'middle',
				...cellSx,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 0.25,
					minHeight: avatarSize,
				}}
			>
				{leading != null ? (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							flexShrink: 0,
							width: 22,
							color: 'text.secondary',
						}}
					>
						{leading}
					</Box>
				) : null}
				<Avatar
					sx={{ width: avatarSize, height: avatarSize, border: 0, flexShrink: 0 }}
					alt={avatarAlt}
					src={avatarSrc}
				/>
				<Box
					sx={{
						textAlign: 'left',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						...labelSx,
					}}
				>
					{label}
				</Box>
			</Box>
		</TableCell>
	);
}
