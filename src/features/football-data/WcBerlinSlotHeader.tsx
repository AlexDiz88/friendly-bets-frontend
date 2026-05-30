import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
	wc26SectionHeaderSx,
	wc26SlotRangeSx,
	wc26SlotRuleSx,
	wc26SlotTitleSx,
} from '../world-cup-2026/wc26PageStyles';
import { getBerlinSlotMeta } from '../world-cup-2026/wc26BetSlots';

interface WcBerlinSlotHeaderProps {
	slotId: string;
}

export default function WcBerlinSlotHeader({ slotId }: WcBerlinSlotHeaderProps): JSX.Element | null {
	const { t, i18n } = useTranslation();
	const meta = getBerlinSlotMeta(slotId, i18n.language);

	if (!meta) {
		return null;
	}

	return (
		<Box sx={{ mb: 1, px: 0.5 }}>
			<Typography variant="caption" sx={wc26SectionHeaderSx}>
				{t('wc26.betSlots.round', { round: meta.round })}
			</Typography>
			<Typography variant="caption" sx={{ ...wc26SlotTitleSx, mt: 0.75, mb: 0.25 }}>
				{t('wc26.betSlots.slotTitle', { index: meta.index })}
			</Typography>
			{meta.rangeFrom && meta.rangeTo ? (
				<Typography variant="caption" sx={wc26SlotRangeSx}>
					{t('wc26.betSlots.range', { from: meta.rangeFrom, to: meta.rangeTo })}
				</Typography>
			) : null}
			<Typography variant="caption" sx={{ ...wc26SlotRuleSx, mt: 0.25 }}>
				{t('wc26.betSlots.betsRule', {
					bets: meta.betsRequired,
					matches: meta.matchCount,
				})}
			</Typography>
		</Box>
	);
}
