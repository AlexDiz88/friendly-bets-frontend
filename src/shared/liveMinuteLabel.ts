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
	return `${totalMinutes}'`;
}

/** Минута на UI: якорь с последнего sync + прошедшие целые минуты. */
export function extrapolateLiveMinuteLabel(
	liveMinuteLabel: string,
	fetchedAtMs: number | null | undefined,
	nowMs: number
): string {
	const trimmed = liveMinuteLabel.trim();
	const base = parseLiveMinuteBase(trimmed);
	if (base == null) {
		return trimmed;
	}
	const elapsedSinceSync =
		fetchedAtMs != null ? Math.max(0, Math.floor((nowMs - fetchedAtMs) / 60_000)) : 0;
	if (elapsedSinceSync === 0) {
		return trimmed;
	}
	const total = base + elapsedSinceSync;
	// Только экстраполяция от ровно 45' в добавленное время 1-го тайма (не 46'–48' второго).
	if (base === 45 && total <= 48) {
		return "45+'";
	}
	return formatLiveMinuteLabel(total);
}

/** Берём более позднюю минуту: sync может отставать, оценка по пуску — подстраховка. */
export function pickDisplayedLiveMinute(
	syncMinute: string | null | undefined,
	estimatedMinute: string | null | undefined
): string | null {
	if (!syncMinute) {
		return estimatedMinute ?? null;
	}
	if (!estimatedMinute) {
		return syncMinute;
	}
	const syncNum = parseLiveMinuteBase(syncMinute);
	const estNum = parseLiveMinuteBase(estimatedMinute);
	if (syncNum != null && estNum != null && estNum > syncNum) {
		return estimatedMinute;
	}
	return syncMinute;
}
