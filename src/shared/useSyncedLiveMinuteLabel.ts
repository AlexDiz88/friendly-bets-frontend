import { useEffect, useRef, useState } from 'react';
import { normalizeMatchStatus } from '../features/match-results/matchStatusI18n';
import { formatLiveMinuteLabel, parseLiveMinuteBase } from './liveMinuteLabel';

const CLIENT_MINUTE_TICK_MS = 60_000;

/**
 * Минута live: якорь с последнего sync (liveMinuteLabel + fetchedAt из БД),
 * между sync — +1 мин на клиенте каждые 60 с. Новый sync перезаписывает якорь.
 */
export function useSyncedLiveMinuteLabel(
	liveMinuteLabel: string | null | undefined,
	fetchedAt: string | null | undefined,
	matchStatus: string
): string | null {
	const apiLabel = liveMinuteLabel?.trim() ? liveMinuteLabel.trim() : null;
	const isInPlay = normalizeMatchStatus(matchStatus) === 'IN_PLAY';
	const [displayMinute, setDisplayMinute] = useState<string | null>(apiLabel);
	const anchorRef = useRef<{ label: string; fetchedAt: string | null | undefined } | null>(
		null
	);

	useEffect(() => {
		if (!apiLabel) {
			anchorRef.current = null;
			setDisplayMinute(null);
			return;
		}
		const prev = anchorRef.current;
		const anchorChanged =
			prev == null || prev.label !== apiLabel || prev.fetchedAt !== fetchedAt;
		if (anchorChanged) {
			anchorRef.current = { label: apiLabel, fetchedAt };
			setDisplayMinute(apiLabel);
		}
	}, [apiLabel, fetchedAt]);

	useEffect(() => {
		if (!apiLabel || !isInPlay) {
			return;
		}
		const intervalId = window.setInterval(() => {
			setDisplayMinute((current) => {
				if (!current) {
					return current;
				}
				const base = parseLiveMinuteBase(current);
				if (base == null) {
					return current;
				}
				return formatLiveMinuteLabel(base + 1);
			});
		}, CLIENT_MINUTE_TICK_MS);
		return () => window.clearInterval(intervalId);
	}, [apiLabel, fetchedAt, isInPlay]);

	if (!apiLabel) {
		return null;
	}
	if (!isInPlay) {
		return apiLabel;
	}
	return displayMinute ?? apiLabel;
}
