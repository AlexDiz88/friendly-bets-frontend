import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEstimatedMatchMinute } from '../../shared/useEstimatedMatchMinute';
import { useExtrapolatedLiveMinuteLabel } from '../../shared/useExtrapolatedLiveMinuteLabel';
import { isLiveMatchStatus } from '../football-data/externalMatchScoreView';
import { normalizeMatchStatus } from '../football-data/matchStatusI18n';
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
	liveMinuteLabel?: string | null;
	liveDataFetchedAt?: string | null;
	matchStatus?: string;
	scoresReady?: boolean;
	/** Live-раскладка: минута над пульсирующим счётом. */
	liveStacked?: boolean;
	kickoffSx?: SxProps<Theme>;
	liveMinuteSx?: SxProps<Theme>;
	liveScoreSx?: SxProps<Theme>;
	scoreSx?: SxProps<Theme>;
}

export default function Wc26MatchCenterStatus({
	kickoffTime,
	kickoffUtcMs,
	scoreView,
	liveMinuteLabel,
	liveDataFetchedAt,
	matchStatus = 'SCHEDULED',
	scoresReady = true,
	liveStacked = false,
	kickoffSx = wc26KickoffTimeSx,
	liveMinuteSx = wc26MatchLiveMinuteSx,
	liveScoreSx,
	scoreSx = wc26MatchScoreSx,
}: Wc26MatchCenterStatusProps): JSX.Element {
	const { t } = useTranslation();
	const normalizedStatus = normalizeMatchStatus(matchStatus);
	const isPaused = normalizedStatus === 'PAUSED';
	const extrapolatedMinute = useExtrapolatedLiveMinuteLabel(
		liveMinuteLabel,
		liveDataFetchedAt,
		matchStatus
	);
	const canEstimateMinute =
		scoresReady &&
		(!hasDisplayableScore(scoreView) || liveStacked) &&
		!extrapolatedMinute &&
		!isPaused;
	const estimated = useEstimatedMatchMinute(canEstimateMinute ? kickoffUtcMs : null);

	const minuteLabel = ((): string | null => {
		if (isPaused) {
			return t('matchCenter.halftime');
		}
		if (extrapolatedMinute) {
			return extrapolatedMinute;
		}
		if (estimated && estimated.kind !== 'not_started') {
			return estimated.kind === 'halftime' ? t('matchCenter.halftime') : estimated.label;
		}
		return null;
	})();

	if (hasDisplayableScore(scoreView) && liveStacked) {
		return (
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0.12,
				}}
			>
				{minuteLabel ? (
					<Typography component="span" sx={liveMinuteSx}>
						{minuteLabel}
					</Typography>
				) : null}
				<Typography component="span" sx={liveScoreSx ?? scoreSx}>
					{scoreView}
				</Typography>
			</Box>
		);
	}

	if (hasDisplayableScore(scoreView)) {
		return (
			<Typography component="span" sx={scoreSx}>
				{scoreView}
			</Typography>
		);
	}

	if (minuteLabel) {
		return (
			<Typography component="span" sx={liveMinuteSx}>
				{minuteLabel}
			</Typography>
		);
	}

	return (
		<Typography component="span" sx={kickoffSx}>
			{kickoffTime}
		</Typography>
	);
}

export function isWc26LiveStackedDisplay(matchStatus: string, finalized: boolean): boolean {
	return isLiveMatchStatus(matchStatus) && !finalized;
}
