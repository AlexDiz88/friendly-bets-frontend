import { Box } from '@mui/material';

export const wc26LiveScoreChipSx = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	boxSizing: 'border-box',
	height: 18,
	minWidth: 28,
	px: 0.25,
	borderRadius: '8px',
	fontSize: '0.6rem',
	fontWeight: 800,
	fontVariantNumeric: 'tabular-nums',
	bgcolor: '#e53935',
	color: '#fff',
	flexShrink: 0,
} as const;

interface Wc26LiveScoreChipProps {
	score: string;
}

export default function Wc26LiveScoreChip({ score }: Wc26LiveScoreChipProps): JSX.Element {
	return (
		<Box component="span" sx={wc26LiveScoreChipSx}>
			{score}
		</Box>
	);
}
