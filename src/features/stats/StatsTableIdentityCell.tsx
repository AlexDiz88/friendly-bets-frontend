import {
	Avatar,
	Box,
	TableCell,
	TableCellProps,
	useMediaQuery,
	type SxProps,
	type Theme,
} from '@mui/material';
import { keyframes } from '@mui/system';
import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

const AVATAR_EASE = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const LAYOUT_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';
const ENTER_PERSPECTIVE = 520;

const FLIP_ENTER_MS = 560;
/** Single-phase collapse: slot shrinks, then avatar + name appear */
export const STATS_COLLAPSE_MS = 150;
const COLLAPSE_MS = 50;
const COLLAPSE_EASE = 'cubic-bezier(0.4, 0, 0.2, 1)';

type FxPhase = 'idle' | 'enter' | 'collapse';

/** 3D flip-in when row opens */
const flipEnter = keyframes`
	0% {
		transform: perspective(${ENTER_PERSPECTIVE}px) rotateY(-88deg) scale(0.55);
		opacity: 0.15;
		filter: blur(4px) brightness(0.7);
	}
	55% {
		transform: perspective(${ENTER_PERSPECTIVE}px) rotateY(12deg) scale(1.06);
		opacity: 1;
		filter: blur(0) brightness(1.08);
	}
	78% {
		transform: perspective(${ENTER_PERSPECTIVE}px) rotateY(-4deg) scale(0.98);
	}
	100% {
		transform: perspective(${ENTER_PERSPECTIVE}px) rotateY(0deg) scale(1);
		opacity: 1;
		filter: blur(0) brightness(1);
	}
`;

/** Quick vertical pinch — no visible avatar during animation */
const collapsePinch = keyframes`
	from {
		transform: scaleY(1) scaleX(1);
		opacity: 1;
	}
	to {
		transform: scaleY(0.12) scaleX(0.55);
		opacity: 0;
	}
`;

const spotlightBurst = keyframes`
	0% {
		opacity: 0;
		transform: scale(0.65);
	}
	35% {
		opacity: 0.95;
		transform: scale(1.08);
	}
	100% {
		opacity: 0;
		transform: scale(1.25);
	}
`;

const rippleOut = keyframes`
	0% {
		transform: scale(0.8);
		opacity: 0.8;
	}
	100% {
		transform: scale(1.55);
		opacity: 0;
	}
`;

const ringFlash = keyframes`
	0% {
		opacity: 0;
		transform: scale(0.85);
	}
	40% {
		opacity: 1;
	}
	100% {
		opacity: 0;
		transform: scale(1.08);
	}
`;

const shineSweep = keyframes`
	0% {
		transform: translateX(-130%) skewX(-18deg);
		opacity: 0;
	}
	15% {
		opacity: 1;
	}
	100% {
		transform: translateX(240%) skewX(-18deg);
		opacity: 0;
	}
`;

function playerFxColors(theme: Theme) {
	const dark = theme.palette.mode === 'dark';
	return {
		gold: dark ? '#fbbf24' : '#d97706',
		goldBright: dark ? '#fde68a' : '#f59e0b',
		goldDim: dark ? 'rgba(251, 191, 36, 0.45)' : 'rgba(217, 119, 6, 0.45)',
		spotlight: dark
			? 'radial-gradient(circle, rgba(251, 191, 36, 0.7) 0%, rgba(251, 191, 36, 0.15) 50%, transparent 70%)'
			: 'radial-gradient(circle, rgba(245, 158, 11, 0.55) 0%, rgba(251, 191, 36, 0.12) 50%, transparent 70%)',
	};
}

type StatsTableIdentityCellProps = {
	avatarSrc: string;
	avatarAlt?: string;
	avatarSize: number;
	label: ReactNode;
	expanded?: boolean;
	avatarVariant?: 'circular' | 'square';
	leading?: ReactNode;
	leadingSx?: SxProps<Theme>;
	labelSx?: SxProps<Theme>;
	cellSx?: TableCellProps['sx'];
	expandedRingSx?: SxProps<Theme>;
};

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
	const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
	const playerFxEnabled = !isSquare && !reduceMotion;

	const [fxPhase, setFxPhase] = useState<FxPhase>('idle');
	const [slotLarge, setSlotLarge] = useState(false);
	const wasLargeRef = useRef(false);

	useLayoutEffect(() => {
		if (!playerFxEnabled) {
			setSlotLarge(expanded);
			setFxPhase('idle');
			wasLargeRef.current = expanded;
			return;
		}

		if (expanded) {
			wasLargeRef.current = true;
			setSlotLarge(true);
			setFxPhase('enter');
			const t = window.setTimeout(() => setFxPhase('idle'), FLIP_ENTER_MS);
			return () => window.clearTimeout(t);
		}

		if (!wasLargeRef.current) {
			return;
		}

		setFxPhase('collapse');
		setSlotLarge(false);
		const t = window.setTimeout(() => {
			wasLargeRef.current = false;
			setFxPhase('idle');
		}, COLLAPSE_MS);
		return () => window.clearTimeout(t);
	}, [expanded, playerFxEnabled]);

	const isEnter = fxPhase === 'enter';
	/** Sync with ref — no flash before useLayoutEffect runs */
	const isCollapsing = playerFxEnabled && !expanded && wasLargeRef.current;
	const showIdentity =
		!playerFxEnabled || expanded || (!expanded && !wasLargeRef.current);

	const slotExpanded = playerFxEnabled ? slotLarge : expanded;
	const slotWidth = slotExpanded ? expandedSize : avatarSize;
	const slotHeight = slotExpanded ? expandedSize : avatarSize;

	const flipAnimation =
		fxPhase === 'enter' ? `${flipEnter} ${FLIP_ENTER_MS}ms ${AVATAR_EASE} both` : 'none';

	/** Large avatar: center in cell */
	const layoutExpanded = slotExpanded && showIdentity;
	/** Stable row height & column width while collapse FX runs */
	const rowMinHeight = slotExpanded || isCollapsing ? expandedSize + 8 : avatarSize;
	const showLeading = !expanded && !isCollapsing;
	const identityMinWidth = Math.max(expandedSize + 8, 22 + 4 + avatarSize);

	return (
		<TableCell
			component="th"
			scope="row"
			sx={{
				p: 0.5,
				fontWeight: 600,
				verticalAlign: 'middle',
				minWidth: identityMinWidth,
				boxSizing: 'border-box',
				transition: (theme) =>
					theme.transitions.create(['background-color'], {
						duration: theme.transitions.duration.standard,
						easing: LAYOUT_EASE,
					}),
				bgcolor: 'transparent',
				...cellSx,
			}}
		>
			<Box
				sx={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: layoutExpanded || isCollapsing ? 'center' : 'flex-start',
					width: '100%',
					gap: layoutExpanded || isCollapsing ? 0 : 0.25,
					minHeight: rowMinHeight,
					transition: (theme) =>
						theme.transitions.create('min-height', {
							duration: isCollapsing ? 0 : theme.transitions.duration.standard,
							easing: LAYOUT_EASE,
						}),
				}}
			>
				{leading != null && showLeading ? (
					<Box
						sx={[
							{
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								flexShrink: 0,
								width: 22,
								color: 'text.secondary',
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
						(theme) => ({
							position: 'relative',
							flexShrink: 0,
							width: slotWidth,
							height: slotHeight,
							transition: theme.transitions.create(['width', 'height'], {
								duration: playerFxEnabled && isCollapsing ? COLLAPSE_MS : theme.transitions.duration.standard,
								easing: isCollapsing ? COLLAPSE_EASE : AVATAR_EASE,
							}),
							perspective:
								playerFxEnabled && (isEnter || (expanded && !isCollapsing))
									? `${ENTER_PERSPECTIVE}px`
									: undefined,
						}),
						...(expanded && expandedRingSx && !playerFxEnabled
							? Array.isArray(expandedRingSx)
								? expandedRingSx
								: [expandedRingSx]
							: []),
					]}
				>
					{isCollapsing && playerFxEnabled ? (
						<Box
							sx={(theme) => ({
								position: 'absolute',
								inset: 0,
								borderRadius: ringRadius,
								bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
								transformOrigin: 'center center',
								animation: `${collapsePinch} ${COLLAPSE_MS}ms ${COLLAPSE_EASE} forwards`,
								pointerEvents: 'none',
								zIndex: 2,
							})}
						/>
					) : null}

					{isEnter ? (
						<>
							<Box
								sx={(theme) => ({
									position: 'absolute',
									inset: -16,
									borderRadius: '50%',
									background: playerFxColors(theme).spotlight,
									animation: `${spotlightBurst} ${FLIP_ENTER_MS}ms ease-out forwards`,
									pointerEvents: 'none',
									zIndex: 0,
								})}
							/>
							<Box
								sx={(theme) => ({
									position: 'absolute',
									inset: -4,
									borderRadius: '50%',
									border: `2px solid ${playerFxColors(theme).goldDim}`,
									animation: `${rippleOut} 0.75s ease-out forwards`,
									pointerEvents: 'none',
									zIndex: 0,
								})}
							/>
							<Box
								sx={(theme) => ({
									position: 'absolute',
									inset: -4,
									borderRadius: '50%',
									border: `2px solid ${playerFxColors(theme).gold}`,
									animation: `${rippleOut} 0.75s ease-out 0.18s forwards`,
									pointerEvents: 'none',
									zIndex: 0,
								})}
							/>
						</>
					) : null}

					{showIdentity ? (
						<Box
							sx={{
								position: 'relative',
								width: '100%',
								height: '100%',
								transformStyle: 'preserve-3d',
								zIndex: 1,
							}}
						>
							<Box
								sx={(theme) => {
									const c = playerFxColors(theme);
									return {
										position: 'relative',
										width: '100%',
										height: '100%',
										borderRadius: ringRadius,
										transformStyle: 'preserve-3d',
										animation: playerFxEnabled ? flipAnimation : 'none',
										boxShadow: slotExpanded
											? `0 10px 28px rgba(0, 0, 0, 0.28)${isEnter ? `, 0 0 20px ${c.goldDim}` : ''}`
											: '0 2px 6px rgba(0, 0, 0, 0.1)',
										...(isEnter
											? {
													'&::after': {
														content: '""',
														position: 'absolute',
														inset: -2,
														borderRadius: ringRadius,
														border: `2px solid ${c.goldBright}`,
														pointerEvents: 'none',
														animation: `${ringFlash} 0.7s ease-out forwards`,
														boxShadow: `0 0 16px ${c.goldDim}`,
													},
												}
											: {}),
									};
								}}
							>
								<Avatar
									variant={avatarVariant}
									alt={avatarAlt}
									src={avatarSrc}
									imgProps={{ style: { objectFit: 'contain' } }}
									sx={(theme) => ({
										width: '100%',
										height: '100%',
										border: 0,
										bgcolor: isSquare
											? 'background.paper'
											: theme.palette.mode === 'dark'
												? '#141414'
												: '#fff',
										backfaceVisibility: 'hidden',
										filter: slotExpanded ? 'saturate(1.1) contrast(1.04)' : 'none',
									})}
								/>

								{isEnter ? (
									<Box
										sx={{
											position: 'absolute',
											inset: 0,
											borderRadius: ringRadius,
											overflow: 'hidden',
											pointerEvents: 'none',
											'&::after': {
												content: '""',
												position: 'absolute',
												top: '-10%',
												left: 0,
												width: '45%',
												height: '120%',
												background:
													'linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.1) 35%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0.1) 65%, transparent 100%)',
												animation: `${shineSweep} 0.75s ease-out 0.2s 1 forwards`,
											},
										}}
									/>
								) : null}
							</Box>
						</Box>
					) : null}
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
							maxWidth: showIdentity ? 'none' : 0,
							opacity: showIdentity ? 1 : 0,
							visibility: showIdentity ? 'visible' : 'hidden',
							transition: showIdentity
								? 'opacity 120ms ease-out, flex 0ms'
								: 'opacity 0ms, flex 0ms',
							...labelSx,
						}}
						aria-hidden={!showIdentity}
					>
						{label}
					</Box>
				) : null}
			</Box>
		</TableCell>
	);
}
