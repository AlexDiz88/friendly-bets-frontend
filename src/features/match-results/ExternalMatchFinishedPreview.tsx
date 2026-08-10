import { Avatar, Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import type Team from '../admin/teams/types/Team';
import {
	externalMatchBetsDialogCountSx,
	externalMatchBetsDialogEmptySx,
	externalMatchBetsDialogHeaderSx,
	externalMatchBetsDialogOverlineSx,
	externalMatchBetsDialogOverlineTextSx,
	externalMatchBetsDialogPaperSx,
	externalMatchBetsDialogScoreSx,
	externalMatchBetsDialogTeamLogoSx,
	externalMatchBetsDialogTeamNameSx,
	externalMatchBetsDialogTeamSideAwaySx,
	externalMatchBetsDialogTeamSideHomeSx,
	externalMatchBetsDialogTeamsRowSx,
} from './externalMatchBetsDialogStyles';
import MatchEventsTimeline from './MatchEventsTimeline';
import type MatchGoalEvent from './types/MatchGoalEvent';

type Props = {
	homeTeam: Team;
	awayTeam: Team;
	scoreView: string;
	events?: MatchGoalEvent[] | null;
	addedTimeFirstHalf?: number | null;
	addedTimeSecondHalf?: number | null;
	/** Optional caption under score (e.g. bets count preview). */
	footerHint?: string;
};

/**
 * Production-like finished match card shell (header + events timeline).
 * Used in FULL_MATCH sandbox preview; bets list is intentionally omitted / hinted.
 */
export default function ExternalMatchFinishedPreview({
	homeTeam,
	awayTeam,
	scoreView,
	events,
	addedTimeFirstHalf,
	addedTimeSecondHalf,
	footerHint,
}: Props): JSX.Element {
	const { t, i18n } = useTranslation();

	const renderTeamSide = (side: 'home' | 'away'): JSX.Element => {
		const team = side === 'home' ? homeTeam : awayTeam;
		const name = resolveTeamDisplayName(team, t, i18n.language);
		const sideSx =
			side === 'home' ? externalMatchBetsDialogTeamSideHomeSx : externalMatchBetsDialogTeamSideAwaySx;

		return (
			<Box
				sx={
					[
						sideSx,
						{ gap: 0.45 },
						side === 'home' ? { pr: 0.25 } : { pl: 0.25 },
					] as SxProps<Theme>
				}
			>
				{side === 'home' ? (
					<>
						<Typography
							sx={
								[externalMatchBetsDialogTeamNameSx, { textAlign: 'right' }] as SxProps<Theme>
							}
						>
							{name}
						</Typography>
						<Avatar
							variant="square"
							src={resolveTeamLogoUrl(team)}
							alt=""
							sx={externalMatchBetsDialogTeamLogoSx}
						/>
					</>
				) : (
					<>
						<Avatar
							variant="square"
							src={resolveTeamLogoUrl(team)}
							alt=""
							sx={externalMatchBetsDialogTeamLogoSx}
						/>
						<Typography
							sx={
								[externalMatchBetsDialogTeamNameSx, { textAlign: 'left' }] as SxProps<Theme>
							}
						>
							{name}
						</Typography>
					</>
				)}
			</Box>
		);
	};

	return (
		<Box sx={externalMatchBetsDialogPaperSx}>
			<Box sx={externalMatchBetsDialogHeaderSx}>
				<Box sx={externalMatchBetsDialogOverlineSx}>
					<Typography component="span" sx={externalMatchBetsDialogOverlineTextSx}>
						{t('wc26.externalResults.matchBets.overline')}
					</Typography>
				</Box>
				<Box sx={externalMatchBetsDialogTeamsRowSx}>
					{renderTeamSide('home')}
					<Typography sx={externalMatchBetsDialogScoreSx}>{scoreView}</Typography>
					{renderTeamSide('away')}
				</Box>
				{footerHint ? (
					<Typography sx={externalMatchBetsDialogCountSx}>{footerHint}</Typography>
				) : null}
			</Box>

			<Box sx={{ px: 1.25, pt: 0.85, pb: 0.5 }}>
				<MatchEventsTimeline
					events={events}
					addedTimeFirstHalf={addedTimeFirstHalf}
					addedTimeSecondHalf={addedTimeSecondHalf}
					hideWhenEmpty
				/>
			</Box>

			<Box sx={{ px: 1.25, pb: 1.25 }}>
				<Typography sx={externalMatchBetsDialogEmptySx}>
					{t('apiSandbox.fullMatchCardPreviewBetsHint')}
				</Typography>
			</Box>
		</Box>
	);
}
