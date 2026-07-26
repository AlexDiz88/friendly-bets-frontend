import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Avatar, Box, CircularProgress, Typography, type SxProps, type Theme } from '@mui/material';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { leagueLogoAvatarSx } from '../../components/custom/avatar/LeagueAvatar';
import { pathToLogoImage } from '../../components/utils/imgBase64Converter';
import {
	nearestGameweekBetsPlateCheckSx,
	nearestGameweekBetsPlateCountSx,
	nearestGameweekBetsPlateDateSx,
	nearestGameweekBetsPlateLabelSx,
	nearestGameweekBetsPlateLeagueBtnSx,
	nearestGameweekBetsPlateLeaguesSx,
	nearestGameweekBetsPlateLoadingSx,
	nearestGameweekBetsPlateSx,
} from './nearestGameweekBetsPlateStyles';
import type { NearestGameweekBetProgressItem } from './useNearestGameweekBetProgress';
import { useNearestGameweekBetProgress } from './useNearestGameweekBetProgress';

export type NearestGameweekLeagueClick = {
	leagueCode: string;
	leagueId: string;
	matchDay: string;
};

type Props = {
	enabled: boolean;
	seasonId: string | undefined;
	compact?: boolean;
	refreshKey?: unknown;
	onLeagueClick: (target: NearestGameweekLeagueClick) => void;
};

export default function NearestGameweekBetsPlate({
	enabled,
	seasonId,
	compact = false,
	refreshKey,
	onLeagueClick,
}: Props): JSX.Element | null {
	const { t } = useTranslation();
	const { node, items, complete, loading, calendarsReady } = useNearestGameweekBetProgress({
		enabled,
		seasonId,
		refreshKey,
	});

	if (!enabled) {
		return null;
	}

	if (loading && items.length === 0) {
		return (
			<Box
				sx={nearestGameweekBetsPlateLoadingSx}
				aria-busy
				aria-label={t('nearestGameweekBetsLoading')}
			>
				<CircularProgress size={18} />
			</Box>
		);
	}

	if (!calendarsReady || !node || items.length === 0) {
		return null;
	}

	const dateLabel =
		node.startDate && node.endDate
			? `${dayjs(node.startDate).format('DD.MM')} – ${dayjs(node.endDate).format('DD.MM')}`
			: null;

	return (
		<Box
			sx={nearestGameweekBetsPlateSx(complete, compact)}
			role="region"
			aria-label={t('nearestGameweekBetsPlateAria')}
		>
			<Typography component="span" sx={nearestGameweekBetsPlateLabelSx}>
				{t('nearestGameweekBetsLabel')}
			</Typography>

			{dateLabel ? (
				<Typography component="span" sx={nearestGameweekBetsPlateDateSx}>
					{dateLabel}
				</Typography>
			) : null}

			<Box sx={nearestGameweekBetsPlateLeaguesSx}>
				{items.map((item: NearestGameweekBetProgressItem) => {
					const leagueComplete = item.limit > 0 && item.used >= item.limit;
					return (
						<Box
							key={`${item.leagueId}-${item.matchDay}`}
							component="button"
							type="button"
							onClick={() =>
								onLeagueClick({
									leagueCode: item.leagueCode,
									leagueId: item.leagueId,
									matchDay: item.matchDay,
								})
							}
							sx={nearestGameweekBetsPlateLeagueBtnSx}
							aria-label={t('nearestGameweekBetsLeagueAria', {
								league: item.leagueCode,
								used: item.used,
								limit: item.limit,
							})}
						>
							<Avatar
								variant="square"
								sx={[{ width: 18, height: 18 }, leagueLogoAvatarSx] as SxProps<Theme>}
								alt={item.leagueCode}
								src={pathToLogoImage(item.leagueCode)}
							/>
							<Typography component="span" sx={nearestGameweekBetsPlateCountSx(leagueComplete)}>
								{item.used}/{item.limit}
							</Typography>
						</Box>
					);
				})}
			</Box>

			{complete ? (
				<CheckCircleIcon
					sx={nearestGameweekBetsPlateCheckSx(true)}
					aria-label={t('nearestGameweekBetsComplete')}
				/>
			) : null}
		</Box>
	);
}

/** URL для перехода на «Результаты» с нужной лигой и туром. */
export function matchResultsPathForLeagueMatchday(leagueCode: string, matchDay: string): string {
	const params = new URLSearchParams({
		league: leagueCode,
		matchDay,
	});
	return `/match-results/matchday?${params.toString()}`;
}
