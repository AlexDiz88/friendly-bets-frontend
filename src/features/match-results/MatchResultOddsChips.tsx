import { Box, Typography } from '@mui/material';
import type { MatchResultOdds } from './types/ExternalMatch';
import { matchResultOddsChipColors, parseOddsValue } from './matchResultOddsRiskColor';

/** Fixed chip width so 1X2 columns align across match cards. */
export const MATCH_RESULT_ODDS_CHIP_WIDTH = '2.35rem';
export const MATCH_RESULT_ODDS_CHIP_GAP = 0.35;

export type MatchResultOddsChipsProps = {
	odds: MatchResultOdds;
};

export default function MatchResultOddsChips({ odds }: MatchResultOddsChipsProps): JSX.Element | null {
	const values = [odds.home, odds.draw, odds.away];
	const parsed = values.map((value) => ({
		value,
		numeric: parseOddsValue(value),
	}));
	if (parsed.some((chip) => chip.numeric == null)) {
		return null;
	}

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				gap: MATCH_RESULT_ODDS_CHIP_GAP,
				flexShrink: 0,
			}}
		>
			{parsed.map((chip, index) => {
				const colors = matchResultOddsChipColors(chip.numeric!);
				return (
					<Box
						key={index}
						sx={{
							display: 'inline-flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: MATCH_RESULT_ODDS_CHIP_WIDTH,
							flex: '0 0 auto',
							px: 0,
							py: 0,
							borderRadius: 0.75,
							border: '1px solid',
							borderColor: colors.border,
							bgcolor: colors.background,
							color: colors.color,
							lineHeight: 1,
							boxShadow: (theme) =>
								theme.palette.mode === 'dark'
									? '0 0 0 1px rgba(0,0,0,0.25)'
									: '0 1px 1px rgba(15, 23, 42, 0.12)',
						}}
					>
						<Typography
							component="span"
							sx={{
								fontSize: '0.68rem',
								fontWeight: 800,
								fontVariantNumeric: 'tabular-nums',
								lineHeight: 1,
								display: 'block',
							}}
						>
							{chip.numeric!.toFixed(2)}
						</Typography>
					</Box>
				);
			})}
		</Box>
	);
}
