export interface MatchdaySlot {
	value: number;
	slotId?: string;
	label: string;
	kind: 'REGULAR' | 'GROUP' | 'KNOCKOUT';
}

/** Колонок в сетке тура — меньше колонок = крупнее ячейки для тач-экранов. */
export function getGridColumnsForMatchdayCount(count: number): number {
	if (count <= 12) return 4;
	if (count <= 24) return 5;
	return 6;
}
