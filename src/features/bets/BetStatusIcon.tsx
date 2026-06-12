import { GppBad, GppGood, RestorePage } from '@mui/icons-material';
import { Tooltip, type SxProps, type Theme } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
	BET_STATUS_RETURNED,
	BET_STATUS_WON,
	COMPLETED_BET_STATUSES,
} from '../../constants';
import { betsStatusIconSx } from './betsPageStyles';

interface BetStatusIconProps {
	betStatus: string;
	size?: 'default' | 'compact';
	/** Явная высота иконки в px (например, как у чипа ставки на «Результатах»). */
	heightPx?: number;
	withTooltip?: boolean;
}

function resolveStatusKind(betStatus: string): 'won' | 'returned' | 'lost' {
	return betStatus === BET_STATUS_WON ? 'won' : betStatus === BET_STATUS_RETURNED ? 'returned' : 'lost';
}

export default function BetStatusIcon({
	betStatus,
	size = 'default',
	heightPx,
	withTooltip = false,
}: BetStatusIconProps): JSX.Element | null {
	const { t } = useTranslation();

	if (!COMPLETED_BET_STATUSES.includes(betStatus)) {
		return null;
	}

	const kind = resolveStatusKind(betStatus);
	const iconSizePx = heightPx ?? (size === 'compact' ? 14 : 18);
	const iconSx = [
		betsStatusIconSx(kind),
		{ fontSize: iconSizePx, width: iconSizePx, height: iconSizePx, display: 'block' },
	] as SxProps<Theme>;

	const icon =
		betStatus === BET_STATUS_WON ? (
			<GppGood sx={iconSx} />
		) : betStatus === BET_STATUS_RETURNED ? (
			<RestorePage sx={iconSx} />
		) : (
			<GppBad sx={iconSx} />
		);

	const tooltipTitle =
		betStatus === BET_STATUS_WON
			? t('betWon')
			: betStatus === BET_STATUS_RETURNED
				? t('betReturned')
				: t('betLost');

	const content = (
		<span
			style={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexShrink: 0,
				width: iconSizePx,
				height: iconSizePx,
				lineHeight: 0,
			}}
		>
			{icon}
		</span>
	);

	if (withTooltip) {
		return <Tooltip title={tooltipTitle}>{content}</Tooltip>;
	}

	return content;
}
