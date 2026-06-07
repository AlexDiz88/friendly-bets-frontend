import { Box, CircularProgress, useTheme } from '@mui/material';
import type { Theme } from '@mui/material';
import { t } from 'i18next';

const LOADING_GRADIENT_ID = 'fb-loading-spinner-gradient';

const loadingTextSx = (theme: Theme) => ({
	textAlign: 'center' as const,
	fontWeight: 600,
	pt: 10,
	fontSize: 18,
	color: theme.palette.mode === 'dark' ? 'rgba(232, 238, 248, 0.72)' : '#475569',
});

function LoadingGradientDefs({ mode }: { mode: 'light' | 'dark' }): JSX.Element {
	const stops =
		mode === 'dark'
			? [
					{ offset: '0%', color: '#bfdbfe' },
					{ offset: '45%', color: '#60a5fa' },
					{ offset: '100%', color: '#3b82f6' },
				]
			: [
					{ offset: '0%', color: '#93c5fd' },
					{ offset: '45%', color: '#446bc4' },
					{ offset: '100%', color: '#2563eb' },
				];

	return (
		<svg width={0} height={0} aria-hidden>
			<defs>
				<linearGradient id={LOADING_GRADIENT_ID} x1="0%" y1="0%" x2="100%" y2="100%">
					{stops.map((stop) => (
						<stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
					))}
				</linearGradient>
			</defs>
		</svg>
	);
}

const CustomLoading = ({ text, size = 100 }: { text?: string; size?: number }): JSX.Element => {
	const theme = useTheme();
	const isDark = theme.palette.mode === 'dark';

	return (
		<Box
			sx={{
				height: '70vh',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<Box sx={loadingTextSx(theme)}>{text ? text : t('loading')}</Box>
			<Box
				sx={{
					mt: 5,
					position: 'relative',
					display: 'inline-flex',
					filter: isDark ? 'drop-shadow(0 0 10px rgba(96, 165, 250, 0.35))' : 'none',
				}}
			>
				<LoadingGradientDefs mode={theme.palette.mode} />
				<CircularProgress
					size={size}
					thickness={4}
					sx={{
						color: 'transparent',
						'& .MuiCircularProgress-circle': {
							strokeLinecap: 'round',
							stroke: `url(#${LOADING_GRADIENT_ID})`,
						},
					}}
				/>
			</Box>
		</Box>
	);
};

export default CustomLoading;
