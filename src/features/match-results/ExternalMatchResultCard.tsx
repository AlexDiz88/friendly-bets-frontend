import { Avatar, Box, Chip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { resolveTeamDisplayName, resolveTeamLogoUrl } from '../../components/utils/teamDisplay';
import { useDisplayLiveMinuteLabel } from '../../shared/useDisplayLiveMinuteLabel';
import { formatLiveMinuteForDisplay } from '../../shared/liveMinuteResolver';
import Team from '../admin/teams/types/Team';
import { getMatchStatusChipColor, translateMatchStatus } from './matchStatusI18n';

const MATCH_ROW_AVATAR = 26;

export type ExternalMatchResultCardProps = {
	homeTeam: Team;
	awayTeam: Team;
	scoreView: string;
	status: string;
	finalized?: boolean;
	liveMinuteLabel?: string | null;
	fetchedAt?: string | null;
	kickoffUtcMs?: number;
	leagueCode?: string | null;
	slotId?: string | null;
	matchDateLabel?: string;
	headerActions?: React.ReactNode;
	onClick?: () => void;
	interactive?: boolean;
};

function CompactMatchRow({
	homeTeam,
	awayTeam,
	scoreView,
}: {
	homeTeam: Team;
	awayTeam: Team;
	scoreView: string;
}): JSX.Element {
	const { t, i18n } = useTranslation();

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 0.5,
				minHeight: MATCH_ROW_AVATAR,
			}}
		>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
					gap: 0.4,
					minWidth: 0,
				}}
			>
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.78rem',
						fontWeight: 600,
						lineHeight: 1.2,
						textAlign: 'right',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{resolveTeamDisplayName(homeTeam, t, i18n.language)}
				</Typography>
				<Avatar
					variant="square"
					src={resolveTeamLogoUrl(homeTeam)}
					alt=""
					sx={{ width: MATCH_ROW_AVATAR, height: MATCH_ROW_AVATAR, flexShrink: 0 }}
				/>
			</Box>

			<Typography
				sx={{
					flex: '0 0 auto',
					px: 0.5,
					fontWeight: 700,
					fontSize: '0.85rem',
					lineHeight: 1.2,
					textAlign: 'center',
					whiteSpace: 'pre-line',
				}}
			>
				{scoreView}
			</Typography>

			<Box
				sx={{
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-start',
					gap: 0.4,
					minWidth: 0,
				}}
			>
				<Avatar
					variant="square"
					src={resolveTeamLogoUrl(awayTeam)}
					alt=""
					sx={{ width: MATCH_ROW_AVATAR, height: MATCH_ROW_AVATAR, flexShrink: 0 }}
				/>
				<Typography
					variant="body2"
					sx={{
						fontSize: '0.78rem',
						fontWeight: 600,
						lineHeight: 1.2,
						textAlign: 'left',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						whiteSpace: 'nowrap',
					}}
				>
					{resolveTeamDisplayName(awayTeam, t, i18n.language)}
				</Typography>
			</Box>
		</Box>
	);
}

export default function ExternalMatchResultCard({
	homeTeam,
	awayTeam,
	scoreView,
	status,
	finalized = false,
	liveMinuteLabel,
	fetchedAt,
	kickoffUtcMs = 0,
	leagueCode,
	slotId,
	matchDateLabel,
	headerActions,
	onClick,
	interactive = false,
}: ExternalMatchResultCardProps): JSX.Element {
	const { t } = useTranslation();
	const displayMinute = useDisplayLiveMinuteLabel({
		liveMinuteLabel,
		fetchedAt,
		matchStatus: status,
		kickoffUtcMs,
		finalized,
		leagueCode,
		slotId,
	});
	const minuteChipLabel = formatLiveMinuteForDisplay(displayMinute);
	const statusLabel = finalized ? t('gameResultFinalized') : translateMatchStatus(status, t);
	const statusColor = finalized ? 'success' : getMatchStatusChipColor(status);

	return (
		<Box
			onClick={onClick}
			sx={{
				px: 1,
				py: 0.45,
				cursor: interactive ? 'pointer' : 'default',
				'&:hover': interactive ? { bgcolor: 'action.hover' } : undefined,
			}}
		>
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					mb: 0.25,
					gap: 0.5,
				}}
			>
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ fontSize: '0.68rem', lineHeight: 1.2, minHeight: '0.82rem' }}
				>
					{matchDateLabel ?? ''}
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
					{minuteChipLabel ? (
						<Chip
							size="small"
							label={minuteChipLabel}
							color="warning"
							variant="outlined"
							sx={{
								height: 18,
								fontSize: '0.58rem',
								fontWeight: 700,
								'& .MuiChip-label': { px: 0.5, py: 0 },
							}}
						/>
					) : null}
					<Chip
						size="small"
						label={statusLabel}
						color={statusColor}
						sx={{
							height: 18,
							fontSize: '0.58rem',
							'& .MuiChip-label': { px: 0.5, py: 0 },
						}}
					/>
					{headerActions}
				</Box>
			</Box>
			<CompactMatchRow homeTeam={homeTeam} awayTeam={awayTeam} scoreView={scoreView} />
		</Box>
	);
}
