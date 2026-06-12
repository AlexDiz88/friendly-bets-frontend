import type { SxProps, Theme } from '@mui/material';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEstimatedMatchMinute } from '../../shared/useEstimatedMatchMinute';
import {
	wc26KickoffTimeSx,
	wc26MatchLiveMinuteSx,
	wc26MatchScoreSx,
} from './wc26PageStyles';

function hasDisplayableScore(scoreView?: string | null): boolean {
	return Boolean(scoreView && scoreView !== '—');
}

interface Wc26MatchCenterStatusProps {
	kickoffTime: string;
	kickoffUtcMs: number;
	scoreView?: string | null;
	/** Пока false — не показывать примерную минуту (ждём счёт из API). */
	scoresReady?: boolean;
	kickoffSx?: SxProps<Theme>;
	liveMinuteSx?: SxProps<Theme>;
	scoreSx?: SxProps<Theme>;
}

export default function Wc26MatchCenterStatus({
	kickoffTime,
	kickoffUtcMs,
	scoreView,
	scoresReady = true,
	kickoffSx = wc26KickoffTimeSx,
	liveMinuteSx = wc26MatchLiveMinuteSx,
	scoreSx = wc26MatchScoreSx,
}: Wc26MatchCenterStatusProps): JSX.Element {
	const { t } = useTranslation();
	const canEstimateMinute = scoresReady && !hasDisplayableScore(scoreView);
	const estimated = useEstimatedMatchMinute(canEstimateMinute ? kickoffUtcMs : null);

	if (hasDisplayableScore(scoreView)) {
		return (
			<Typography component="span" sx={scoreSx}>
				{scoreView}
			</Typography>
		);
	}

	if (estimated && estimated.kind !== 'not_started') {
		const label =
			estimated.kind === 'halftime' ? t('matchCenter.halftime') : estimated.label;
		return (
			<Typography component="span" sx={liveMinuteSx}>
				{label}
			</Typography>
		);
	}

	return (
		<Typography component="span" sx={kickoffSx}>
			{kickoffTime}
		</Typography>
	);
}
