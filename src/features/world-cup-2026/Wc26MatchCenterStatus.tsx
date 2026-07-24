import { Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { wc26KickoffTimeSx, wc26MatchScoreSx } from './wc26PageStyles';

function hasDisplayableScore(scoreView?: string | null): boolean {
	return Boolean(scoreView && scoreView !== '—');
}

interface Wc26MatchCenterStatusProps {
	kickoffTime: string;
	scoreView?: string | null;
	kickoffSx?: SxProps<Theme>;
	scoreSx?: SxProps<Theme>;
}

export default function Wc26MatchCenterStatus({
	kickoffTime,
	scoreView,
	kickoffSx = wc26KickoffTimeSx,
	scoreSx = wc26MatchScoreSx,
}: Wc26MatchCenterStatusProps): JSX.Element {
	if (hasDisplayableScore(scoreView)) {
		return (
			<Typography component="span" sx={scoreSx}>
				{scoreView}
			</Typography>
		);
	}

	return (
		<Typography component="span" sx={kickoffSx}>
			{kickoffTime}
		</Typography>
	);
}
