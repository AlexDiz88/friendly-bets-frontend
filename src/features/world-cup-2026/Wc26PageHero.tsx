import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const titleShineKeyframes = {
	'@keyframes wc26TitleShine': {
		'0%, 100%': { backgroundPosition: '0% 50%' },
		'50%': { backgroundPosition: '100% 50%' },
	},
};

export default function Wc26PageHero(): JSX.Element {
	const { t } = useTranslation();

	return (
		<Box
			sx={(theme) => ({
				...titleShineKeyframes,
				px: 2,
				pt: 1,
				pb: 1.5,
				textAlign: 'center',
				position: 'relative',
				overflow: 'hidden',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: '55%',
					left: '50%',
					width: 'min(320px, 90vw)',
					height: 80,
					transform: 'translate(-50%, -50%)',
					background:
						theme.palette.mode === 'dark'
							? 'radial-gradient(ellipse, rgba(0, 200, 120, 0.2) 0%, transparent 70%)'
							: 'radial-gradient(ellipse, rgba(0, 130, 75, 0.14) 0%, transparent 70%)',
					pointerEvents: 'none',
				},
			})}
		>
			<Box
				sx={{
					position: 'absolute',
					inset: 0,
					opacity: 0.12,
					background:
						'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,215,0,0.06) 10px, rgba(255,215,0,0.06) 20px)',
					pointerEvents: 'none',
				}}
			/>
			<Box
				sx={{
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 1.25,
					mb: 0.75,
				}}
			>
				<Box
					sx={(theme) => ({
						flex: 1,
						maxWidth: 56,
						height: 2,
						borderRadius: 1,
						background:
							theme.palette.mode === 'dark'
								? 'linear-gradient(90deg, transparent, rgba(255, 214, 0, 0.55))'
								: 'linear-gradient(90deg, transparent, #b8860b)',
					})}
				/>
				<Typography
					variant="overline"
					sx={(theme) => ({
						flexShrink: 0,
						fontWeight: 800,
						letterSpacing: 2.5,
						fontSize: '0.65rem',
						background:
							theme.palette.mode === 'dark'
								? 'linear-gradient(90deg, #7dcea0, #ffd700, #7dcea0)'
								: 'linear-gradient(90deg, #0a5c38, #a67c00, #0a5c38)',
						backgroundClip: 'text',
						WebkitBackgroundClip: 'text',
						color: 'transparent',
					})}
				>
					FIFA World Cup 26™
				</Typography>
				<Box
					sx={(theme) => ({
						flex: 1,
						maxWidth: 56,
						height: 2,
						borderRadius: 1,
						background:
							theme.palette.mode === 'dark'
								? 'linear-gradient(270deg, transparent, rgba(255, 214, 0, 0.55))'
								: 'linear-gradient(270deg, transparent, #b8860b)',
					})}
				/>
			</Box>
			<Box
				sx={{
					position: 'relative',
					display: 'inline-flex',
					alignItems: 'center',
					justifyContent: 'center',
					gap: 0.125,
					maxWidth: '100%',
				}}
			>
				<Typography
					component="h1"
					sx={(theme) => ({
						fontWeight: 900,
						fontSize: { xs: '1.35rem', sm: '1.65rem' },
						lineHeight: 1.15,
						letterSpacing: '-0.02em',
						backgroundSize: '200% auto',
						animation: 'wc26TitleShine 7s ease-in-out infinite',
						filter:
							theme.palette.mode === 'light'
								? 'drop-shadow(0 1px 0 rgba(255,255,255,0.9)) drop-shadow(0 2px 6px rgba(4, 90, 55, 0.2))'
								: 'drop-shadow(0 0 12px rgba(0, 210, 130, 0.35))',
						...(theme.palette.mode === 'dark'
							? {
									backgroundImage:
										'linear-gradient(120deg, #00e08a 0%, #fff4a3 38%, #ffd700 50%, #fff4a3 62%, #00c97a 100%)',
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									color: 'transparent',
								}
							: {
									backgroundImage:
										'linear-gradient(120deg, #034d2e 0%, #8b6914 35%, #c9a227 50%, #8b6914 65%, #034d2e 100%)',
									backgroundClip: 'text',
									WebkitBackgroundClip: 'text',
									color: 'transparent',
								}),
					})}
				>
					{t('wc26.title')}
				</Typography>
				<Tooltip
					title={
						<Typography
							component="div"
							variant="caption"
							sx={{ whiteSpace: 'pre-line', lineHeight: 1.45, display: 'block' }}
						>
							{t('wc26.infoTooltip')}
						</Typography>
					}
					arrow
					placement="bottom"
					enterTouchDelay={0}
					leaveTouchDelay={30000}
					componentsProps={{
						tooltip: {
							sx: { maxWidth: 300, p: 1.25 },
						},
					}}
				>
					<span>
						<IconButton
							size="small"
							aria-label={t('wc26.infoAria')}
							sx={{
								p: 0.25,
								color: 'text.secondary',
								flexShrink: 0,
								opacity: 0.75,
								'&:hover': { opacity: 1 },
							}}
						>
							<InfoOutlinedIcon sx={{ fontSize: 16 }} />
						</IconButton>
					</span>
				</Tooltip>
			</Box>
		</Box>
	);
}
