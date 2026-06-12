/** Разбор «72'», «90+2'» → число минут для экстраполяции. */
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

export function formatLiveMinuteLabel(totalMinutes: number): string {
	if (totalMinutes >= 90) {
		return "90+'";
	}
	if (totalMinutes > 45 && totalMinutes <= 48) {
		return "45+'";
	}
	return `${totalMinutes}'`;
}

/** Минута на UI: якорь с последнего sync + прошедшие целые минуты. */
export function extrapolateLiveMinuteLabel(
	liveMinuteLabel: string,
	fetchedAtMs: number | null | undefined,
	nowMs: number
): string {
	const base = parseLiveMinuteBase(liveMinuteLabel);
	if (base == null) {
		return liveMinuteLabel;
	}
	const elapsedSinceSync =
		fetchedAtMs != null ? Math.max(0, Math.floor((nowMs - fetchedAtMs) / 60_000)) : 0;
	return formatLiveMinuteLabel(base + elapsedSinceSync);
}
