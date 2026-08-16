import { Box, Button, CircularProgress, Typography, type SxProps, type Theme } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { t } from 'i18next';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
	formatGameweekDateRange,
	formatSignedBalance,
	type PlayerGameweekChartPoint,
} from './playerGameweekChart';
import {
	playerChartBarColSx,
	playerChartBarFillSx,
	playerChartBarRowSx,
	playerChartEmptySx,
	playerChartFrameSx,
	playerChartHintSx,
	playerChartToggleBtnSx,
	playerChartToggleRowSx,
} from './playerStatsChartStyles';
import { statsThemePalette } from './statsPageStyles';

type ChartMode = 'curve' | 'bars';

const CHART_HEIGHT = 120;
const PAD_X = 8;
const PAD_T = 10;
const PAD_B = 14;

function yOf(value: number, min: number, max: number): number {
	const plotH = CHART_HEIGHT - PAD_T - PAD_B;
	if (max === min) {
		return PAD_T + plotH / 2;
	}
	return PAD_T + ((max - value) / (max - min)) * plotH;
}

function linePath(xs: number[], ys: number[]): string {
	return xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(2)} ${ys[i].toFixed(2)}`).join(' ');
}

function areaPath(xs: number[], ys: number[], yZero: number): string {
	if (xs.length === 0) {
		return '';
	}
	const lastX = xs[xs.length - 1];
	return `${linePath(xs, ys)} L${lastX.toFixed(2)} ${yZero.toFixed(2)} L${xs[0].toFixed(2)} ${yZero.toFixed(2)} Z`;
}

function BalanceCurve({
	points,
	selectedIndex,
	onSelect,
	clipId,
}: {
	points: PlayerGameweekChartPoint[];
	selectedIndex: number;
	onSelect: (index: number) => void;
	clipId: string;
}): JSX.Element {
	const theme = useTheme();
	const p = statsThemePalette(theme);
	const wrapRef = useRef<HTMLDivElement>(null);
	const [width, setWidth] = useState(0);

	useLayoutEffect(() => {
		const el = wrapRef.current;
		if (!el) {
			return undefined;
		}
		const sync = (): void => setWidth(Math.max(el.clientWidth, 1));
		sync();
		const observer = new ResizeObserver(sync);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const values = points.map((point) => point.totalBalance);
	const rawMin = Math.min(0, ...values);
	const rawMax = Math.max(0, ...values);
	const span = rawMax - rawMin || 1;
	const min = rawMin - span * 0.08;
	const max = rawMax + span * 0.08;
	const innerW = Math.max(width - PAD_X * 2, 1);
	const xs = points.map((_, i) =>
		points.length === 1 ? PAD_X + innerW / 2 : PAD_X + (i / (points.length - 1)) * innerW
	);
	const ys = values.map((value) => yOf(value, min, max));
	const yZero = yOf(0, min, max);
	const area = areaPath(xs, ys, yZero);
	const stroke = linePath(xs, ys);
	const fillPos = theme.palette.mode === 'dark' ? 'rgba(74, 222, 128, 0.28)' : 'rgba(21, 128, 61, 0.22)';
	const fillNeg = theme.palette.mode === 'dark' ? 'rgba(248, 113, 113, 0.28)' : 'rgba(185, 28, 28, 0.2)';

	const pickFromClientX = (clientX: number): void => {
		const el = wrapRef.current;
		if (!el || points.length === 0) {
			return;
		}
		const rect = el.getBoundingClientRect();
		const x = clientX - rect.left;
		let nearest = 0;
		let best = Number.POSITIVE_INFINITY;
		xs.forEach((px, i) => {
			const dist = Math.abs(px - x);
			if (dist < best) {
				best = dist;
				nearest = i;
			}
		});
		onSelect(nearest);
	};

	return (
		<Box
			ref={wrapRef}
			sx={playerChartFrameSx}
			onPointerDown={(event) => pickFromClientX(event.clientX)}
			onPointerMove={(event) => {
				if (event.buttons === 0) {
					return;
				}
				pickFromClientX(event.clientX);
			}}
		>
			{width > 0 ? (
			<svg width={width} height={CHART_HEIGHT} aria-hidden>
				<defs>
					<clipPath id={`${clipId}-pos`}>
						<rect x={0} y={0} width={width} height={Math.max(yZero, 0)} />
					</clipPath>
					<clipPath id={`${clipId}-neg`}>
						<rect x={0} y={yZero} width={width} height={Math.max(CHART_HEIGHT - yZero, 0)} />
					</clipPath>
				</defs>
				<line
					x1={PAD_X}
					x2={width - PAD_X}
					y1={yZero}
					y2={yZero}
					stroke={p.expandIconMuted}
					strokeWidth={1}
					strokeDasharray="3 3"
				/>
				<path d={area} fill={fillPos} clipPath={`url(#${clipId}-pos)`} />
				<path d={area} fill={fillNeg} clipPath={`url(#${clipId}-neg)`} />
				<path d={stroke} fill="none" stroke={p.name} strokeWidth={1.6} strokeLinejoin="round" />
				{xs.map((x, i) => {
					const selected = i === selectedIndex;
					const value = values[i];
					return (
						<circle
							key={points[i].nodeId}
							cx={x}
							cy={ys[i]}
							r={selected ? 4.2 : 2.4}
							fill={value >= 0 ? p.positive : p.negative}
							stroke={p.bodyBg}
							strokeWidth={selected ? 1.5 : 1}
						/>
					);
				})}
				{xs[selectedIndex] !== undefined && (
					<line
						x1={xs[selectedIndex]}
						x2={xs[selectedIndex]}
						y1={PAD_T}
						y2={CHART_HEIGHT - PAD_B}
						stroke={p.expandIconMuted}
						strokeWidth={1}
					/>
				)}
			</svg>
			) : null}
		</Box>
	);
}

function PnlBars({
	points,
	selectedIndex,
	onSelect,
}: {
	points: PlayerGameweekChartPoint[];
	selectedIndex: number;
	onSelect: (index: number) => void;
}): JSX.Element {
	const maxAbs = Math.max(...points.map((point) => Math.abs(point.balanceChange)), 0.01);

	return (
		<Box sx={playerChartBarRowSx}>
			{points.map((point, i) => {
				const selected = i === selectedIndex;
				const pct = Math.max((Math.abs(point.balanceChange) / maxAbs) * 100, point.balanceChange === 0 ? 0 : 6);
				return (
					<Box
						key={point.nodeId}
						sx={[playerChartBarColSx, { opacity: selected ? 1 : 0.72 }] as SxProps<Theme>}
						onClick={() => onSelect(i)}
					>
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								alignItems: 'flex-end',
								justifyContent: 'center',
								px: '0.5px',
							}}
						>
							{point.balanceChange > 0 ? (
								<Box sx={[playerChartBarFillSx(true), { height: `${pct}%` }] as SxProps<Theme>} />
							) : null}
						</Box>
						<Box
							sx={{
								flex: 1,
								display: 'flex',
								alignItems: 'flex-start',
								justifyContent: 'center',
								px: '0.5px',
							}}
						>
							{point.balanceChange < 0 ? (
								<Box sx={[playerChartBarFillSx(false), { height: `${pct}%` }] as SxProps<Theme>} />
							) : null}
							{point.balanceChange === 0 ? (
								<Box sx={[playerChartBarFillSx(true), { height: 2, opacity: 0.35 }] as SxProps<Theme>} />
							) : null}
						</Box>
					</Box>
				);
			})}
		</Box>
	);
}

export default function PlayerBalanceChart({
	points,
	loading,
	error,
	userId,
}: {
	points: PlayerGameweekChartPoint[];
	loading: boolean;
	error: string | undefined;
	userId: string;
}): JSX.Element {
	const [mode, setMode] = useState<ChartMode>('curve');
	const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

	const safeIndex = useMemo(() => {
		if (points.length === 0) {
			return 0;
		}
		if (selectedIndex === null) {
			return points.length - 1;
		}
		return Math.min(selectedIndex, points.length - 1);
	}, [points.length, selectedIndex]);

	const selected = points[safeIndex];

	if (loading) {
		return (
			<Box sx={playerChartEmptySx}>
				<CircularProgress size={28} />
			</Box>
		);
	}

	if (error) {
		return (
			<Typography sx={playerChartEmptySx} component="div">
				{t('statsChart.loadError')}
			</Typography>
		);
	}

	if (points.length === 0) {
		return (
			<Typography sx={playerChartEmptySx} component="div">
				{t('statsChart.noGameweekData')}
			</Typography>
		);
	}

	return (
		<Box>
			<Box sx={playerChartToggleRowSx} role="tablist" aria-label={t('statsChart.chartMode')}>
				<Button
					role="tab"
					aria-selected={mode === 'curve'}
					sx={playerChartToggleBtnSx(mode === 'curve')}
					onClick={() => setMode('curve')}
				>
					{t('statsChart.balanceCurve')}
				</Button>
				<Button
					role="tab"
					aria-selected={mode === 'bars'}
					sx={playerChartToggleBtnSx(mode === 'bars')}
					onClick={() => setMode('bars')}
				>
					{t('statsChart.gameweekPnl')}
				</Button>
			</Box>
			{mode === 'curve' ? (
				<BalanceCurve
					points={points}
					selectedIndex={safeIndex}
					onSelect={setSelectedIndex}
					clipId={`fb-bal-${userId}`}
				/>
			) : (
				<PnlBars points={points} selectedIndex={safeIndex} onSelect={setSelectedIndex} />
			)}
			<Typography sx={playerChartHintSx} component="div">
				{t('statsChart.gameweek', { n: selected.index })}
				{selected.startDate ? ` · ${formatGameweekDateRange(selected.startDate, selected.endDate)}` : ''}
				<br />
				{mode === 'curve'
					? `${t('balance')}: ${formatSignedBalance(selected.totalBalance)} · ${t('statsChart.position')}: ${selected.positionAfterGameweek}`
					: `${t('weekChange')}: ${formatSignedBalance(selected.balanceChange)} · ${t('statsChart.position')}: ${selected.positionAfterGameweek}`}
			</Typography>
		</Box>
	);
}
