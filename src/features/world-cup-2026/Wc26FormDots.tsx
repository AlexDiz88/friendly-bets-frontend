import { Box } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

const FORM_COLORS: Record<string, string> = {
	W: '#00a86b',
	D: '#9aa0a6',
	L: '#e53935',
};

interface Wc26FormDotsProps {
	form: string[];
	sx?: SxProps<Theme>;
}

export default function Wc26FormDots({ form, sx }: Wc26FormDotsProps): JSX.Element | null {
	if (!form.length) {
		return null;
	}
	return (
		<Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.35, ...sx }}>
			{form.map((result, index) => (
				<Box
					key={`${result}-${index}`}
					component="span"
					sx={{
						width: 7,
						height: 7,
						borderRadius: '50%',
						bgcolor: FORM_COLORS[result] ?? '#9aa0a6',
						flexShrink: 0,
					}}
				/>
			))}
		</Box>
	);
}
