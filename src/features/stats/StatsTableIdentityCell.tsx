import { Avatar, Box, TableCell, TableCellProps, type SxProps, type Theme } from '@mui/material';
import { keyframes } from '@mui/system';
import { ReactNode, useEffect, useState } from 'react';

/** Sync with avatar width/height transition (`theme.transitions.duration.standard`) */
const LABEL_RESHOW_AFTER_COLLAPSE_MS = 300;

const avatarRingPulse = keyframes`
	0%, 100% {
		opacity: 0.35;
		transform: scale(1);
	}
	50% {
		opacity: 0.85;
		transform: scale(1.06);
	}
`;

const AVATAR_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const LAYOUT_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

type StatsTableIdentityCellProps = {
	avatarSrc: string;
	avatarAlt?: string;
	avatarSize: number;
	label: ReactNode;
	expanded?: boolean;
	/** Team crests — square; player photos — circular (default) */
	avatarVariant?: 'circular' | 'square';
	/** Expand/collapse indicator — rendered flush left before the avatar */
	leading?: ReactNode;
	leadingSx?: SxProps<Theme>;
	labelSx?: SxProps<Theme>;
	cellSx?: TableCellProps['sx'];
	expandedRingSx?: SxProps<Theme>;
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
	expanded = false,
	avatarVariant = 'circular',
	leading,
	leadingSx,
	labelSx,
	cellSx,
	expandedRingSx,
}: StatsTableIdentityCellProps): JSX.Element {
	const expandedSize = avatarSize * 2.2;
	const isSquare = avatarVariant === 'square';
	const ringRadius = isSquare ? 2 : '50%';
	const [showLabel, setShowLabel] = useState(true);

	useEffect(() => {
		if (expanded) {
			setShowLabel(false);
			return;
		}
		setShowLabel(false);
		const timer = window.setTimeout(
			() => setShowLabel(true),
			LABEL_RESHOW_AFTER_COLLAPSE_MS
		);
		return () => window.clearTimeout(timer);
	}, [expanded]);

	return (
		<TableCell
			component="th"
			scope="row"
			sx={{
				p: 0.5,
				fontWeight: 600,
				verticalAlign: 'middle',
				transition: (theme) =>
					theme.transitions.create(['background-color', 'padding'], {
						duration: theme.transitions.duration.standard,
						easing: LAYOUT_EASE,
					}),
				bgcolor: expanded ? 'action.hover' : 'transparent',
				...cellSx,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					gap: 0.25,
					minHeight: expanded ? expandedSize + 8 : avatarSize,
					transition: (theme) =>
						theme.transitions.create('min-height', {
							duration: theme.transitions.duration.standard,
							easing: LAYOUT_EASE,
						}),
				}}
			>
				{leading != null ? (
					<Box
						sx={[
							{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
								width: 22,
								color: expanded ? 'primary.main' : 'text.secondary',
								transition: (theme) =>
									theme.transitions.create('color', {
										duration: theme.transitions.duration.short,
									}),
							},
							...(leadingSx ? (Array.isArray(leadingSx) ? leadingSx : [leadingSx]) : []),
						]}
					>
						{leading}
					</Box>
				) : null}
				<Box
					sx={[
						{
							position: 'relative',
							flexShrink: 0,
							width: expanded ? expandedSize : avatarSize,
							height: expanded ? expandedSize : avatarSize,
							transition: (theme) =>
								theme.transitions.create(['width', 'height'], {
									duration: theme.transitions.duration.standard,
									easing: AVATAR_EASE,
								}),
						},
						expanded
							? {
									'&::after': {
										content: '""',
										position: 'absolute',
										inset: -3,
										borderRadius: ringRadius,
										border: '2px solid',
										borderColor: 'primary.main',
										pointerEvents: 'none',
										animation: `${avatarRingPulse} 2s ease-in-out infinite`,
									},
								}
							: {},
						...(expanded && expandedRingSx
							? Array.isArray(expandedRingSx)
								? expandedRingSx
								: [expandedRingSx]
							: []),
					]}
				>
					<Avatar
						variant={avatarVariant}
						alt={avatarAlt}
						src={avatarSrc}
						imgProps={{ style: { objectFit: 'contain' } }}
						sx={{
							width: '100%',
							height: '100%',
							border: 0,
							bgcolor: isSquare ? 'background.paper' : undefined,
							transition: (theme) =>
								theme.transitions.create(['box-shadow', 'transform', 'filter'], {
									duration: theme.transitions.duration.standard,
									easing: AVATAR_EASE,
								}),
							transform: expanded ? 'scale(1) rotate(0deg)' : 'scale(1)',
							filter: expanded ? 'saturate(1.08) contrast(1.04)' : 'none',
							boxShadow: expanded
								? '0 10px 28px rgba(25, 118, 210, 0.38), 0 4px 12px rgba(0, 0, 0, 0.18)'
								: '0 2px 6px rgba(0, 0, 0, 0.1)',
						}}
					/>
				</Box>
				{!expanded ? (
					<Box
						sx={{
							textAlign: 'left',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
							flex: '1 1 auto',
							minWidth: 0,
							...labelSx,
						}}
					>
						{label}
					</Box>
				) : null}
			</Box>
		</TableCell>
	);
}
