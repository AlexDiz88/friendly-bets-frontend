import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isBerlinGroupSlot } from '../world-cup-2026/wc26BetSlots';
import {
	externalMatchWcBetsQuotaLabelSx,
	externalMatchWcBetsQuotaSubSx,
	externalMatchWcBetsQuotaSx,
	externalMatchWcSlotHeaderWrapSx,
} from './externalMatchWcPageStyles';
import WcBerlinSlotHeader from './WcBerlinSlotHeader';

interface WcExternalSlotPanelProps {
	slotId: string;
	slotLabel?: string;
	betsUsed: number;
	betsLimit: number;
	matchCount: number;
	betsLoading?: boolean;
}

export default function WcExternalSlotPanel({
	slotId,
	slotLabel,
	betsUsed,
	betsLimit,
	matchCount,
	betsLoading = false,
}: WcExternalSlotPanelProps): JSX.Element {
	const { t } = useTranslation();
	const berlin = isBerlinGroupSlot(slotId);
	const safeLimit = Math.max(betsLimit, 1);

	return (
		<Box sx={externalMatchWcSlotHeaderWrapSx}>
			{berlin ? (
				<WcBerlinSlotHeader slotId={slotId} compact />
			) : slotLabel ? (
				<Typography
					variant="caption"
					sx={(theme) => ({
						display: 'block',
						textAlign: 'center',
						fontWeight: 800,
						fontSize: '0.7rem',
						mb: 0.35,
						color: theme.palette.mode === 'dark' ? '#9de8c4' : '#034d2e',
					})}
				>
					{slotLabel}
				</Typography>
			) : null}

			<Box sx={externalMatchWcBetsQuotaSx}>
				<Box sx={{ minWidth: 0 }}>
					<Typography sx={externalMatchWcBetsQuotaLabelSx}>
						{t('wc26.externalResults.betsQuota', { used: betsUsed, limit: safeLimit })}
					</Typography>
					<Typography sx={externalMatchWcBetsQuotaSubSx}>
						{betsLoading
							? t('wc26.externalResults.betsLoading')
							: t('wc26.betSlots.betsRule', { bets: safeLimit, matches: matchCount })}
					</Typography>
				</Box>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, flexShrink: 0, py: 0.15 }}>
					{Array.from({ length: safeLimit }, (_, i) => (
						<Box
							key={i}
							className={`wc-quota-dot ${i < betsUsed ? 'wc-quota-dot--filled' : 'wc-quota-dot--empty'}`}
						/>
					))}
				</Box>
			</Box>
		</Box>
	);
}
