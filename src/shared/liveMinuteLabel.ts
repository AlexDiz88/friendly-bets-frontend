/** Разбор «72'», «90+2'» → число минут матча. */
export function parseLiveMinuteBase(label: string): number | null {
	const trimmed = label.trim();
	const match = /^(\d+)(?:\+(\d+))?'?$/.exec(trimmed);
	if (!match) {
		return null;
	}
	const base = Number.parseInt(match[1], 10);
	const added = match[2] ? Number.parseInt(match[2], 10) : 0;
	return base + added;
}

export function isStoppageMinuteLabel(label: string): boolean {
	return label.includes('+');
}

export function formatLiveMinuteLabel(totalMinutes: number): string {
	if (totalMinutes > 90) {
		return "90+'";
	}
	return `${totalMinutes}'`;
}
