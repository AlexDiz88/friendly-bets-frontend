import dayjs from 'dayjs';
import Calendar from '../admin/calendars/types/Calendar';

export interface PlayerGameweekChartPoint {
	nodeId: string;
	startDate: string;
	endDate: string;
	index: number;
	totalBalance: number;
	balanceChange: number;
	positionAfterGameweek: number;
	positionChange: number;
}

export function buildPlayerGameweekChartPoints(
	nodes: Calendar[],
	userId: string
): PlayerGameweekChartPoint[] {
	const chronological = [...nodes]
		.filter((node) => node.isFinished)
		.sort((a, b) => {
			const aTime = a.startDate ? dayjs(a.startDate).valueOf() : 0;
			const bTime = b.startDate ? dayjs(b.startDate).valueOf() : 0;
			return aTime - bTime;
		});

	const points: PlayerGameweekChartPoint[] = [];
	chronological.forEach((node) => {
		const stats = node.gameweekStats?.find((entry) => entry.userId === userId);
		if (!stats) {
			return;
		}
		points.push({
			nodeId: node.id,
			startDate: node.startDate ? String(node.startDate) : '',
			endDate: node.endDate ? String(node.endDate) : '',
			index: points.length + 1,
			totalBalance: stats.totalBalance,
			balanceChange: stats.balanceChange,
			positionAfterGameweek: stats.positionAfterGameweek,
			positionChange: stats.positionChange,
		});
	});
	return points;
}

export function formatGameweekDateRange(startDate: string, endDate: string): string {
	const start = startDate ? dayjs(startDate).format('DD.MM') : '';
	const end = endDate ? dayjs(endDate).format('DD.MM') : '';
	if (start && end) {
		return `${start} – ${end}`;
	}
	return start || end;
}

export function formatSignedBalance(value: number): string {
	const sign = value > 0 ? '+' : '';
	return `${sign}${value.toFixed(2)}€`;
}
