import type { SxProps, Theme } from '@mui/material';
import { Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useEstimatedMatchMinute } from '../../shared/useEstimatedMatchMinute';
import { wc26KickoffTimeSx, wc26MatchScoreSx } from './wc26PageStyles';

function hasDisplayableScore(scoreView?: string | null): boolean {
	return Boolean(scoreView && scoreView !== '—');
}

interface Wc26MatchCenterStatusProps {
	kickoffTime: string;
	kickoffUtcMs: number;
	scoreView?: string | null;
	kickoffSx?: SxProps<Theme>;
	scoreSx?: SxProps<Theme>;
}

export default function Wc26MatchCenterStatus({
	kickoffTime,
	kickoffUtcMs,
	scoreView,
	kickoffSx = wc26KickoffTimeSx,
	scoreSx = wc26MatchScoreSx,
}: Wc26MatchCenterStatusProps): JSX.Element {
	const { t } = useTranslation();
	const estimated = useEstimatedMatchMinute(
		hasDisplayableScore(scoreView) ? null : kickoffUtcMs
	);

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
			<Typography component="span" sx={kickoffSx}>
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
