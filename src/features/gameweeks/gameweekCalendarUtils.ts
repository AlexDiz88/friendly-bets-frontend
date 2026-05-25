import dayjs, { Dayjs } from 'dayjs';
import Calendar from '../admin/calendars/types/Calendar';

const LAST_NODE_STORAGE_PREFIX = 'gameweek:lastNode:';

export function lastGameweekNodeStorageKey(seasonId: string): string {
	return `${LAST_NODE_STORAGE_PREFIX}${seasonId}`;
}

export function readLastGameweekNodeId(seasonId: string): string | null {
	try {
		return localStorage.getItem(lastGameweekNodeStorageKey(seasonId));
	} catch {
		return null;
	}
}

export function writeLastGameweekNodeId(seasonId: string, nodeId: string): void {
	try {
		localStorage.setItem(lastGameweekNodeStorageKey(seasonId), nodeId);
	} catch {
		// ignore quota / private mode
	}
}

export function pickDefaultCalendarNode(
	calendarNodes: Calendar[],
	preferredNodeId?: string | null
): Calendar | undefined {
	if (calendarNodes.length === 0) {
		return undefined;
	}

	if (preferredNodeId) {
		const preferred = calendarNodes.find((n) => n.id === preferredNodeId);
		if (preferred) {
			return preferred;
		}
	}

	const now: Dayjs = dayjs().add(-1, 'day');

	const activeNode = calendarNodes.find(
		(node) =>
			node.startDate &&
			node.endDate &&
			now.isAfter(node.startDate) &&
			now.isBefore(node.endDate)
	);
	if (activeNode) {
		return activeNode;
	}

	return calendarNodes.reduce((prev, curr) => {
		const prevDiff = prev.startDate ? Math.abs(now.diff(prev.startDate)) : Infinity;
		const currDiff = curr.startDate ? Math.abs(now.diff(curr.startDate)) : Infinity;
		return currDiff < prevDiff ? curr : prev;
	});
}
