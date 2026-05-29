import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

/** Компактный баннер-ссылка на расписание ЧМ-2026 (главная и др.). */
export default function Wc26QuickLink(): JSX.Element {
	const { t } = useTranslation();

	return (
		<Box
			component={Link}
			to="/world-cup-2026"
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 1.25,
				mx: 'auto',
				mb: 2,
				maxWidth: '25rem',
				px: 1.5,
				py: 1.25,
				borderRadius: 2.5,
				textDecoration: 'none',
				color: 'inherit',
				background: (theme) =>
					theme.palette.mode === 'dark'
						? 'linear-gradient(135deg, rgba(0,168,107,0.35) 0%, rgba(255,215,0,0.15) 100%)'
						: 'linear-gradient(135deg, rgba(0,168,107,0.18) 0%, rgba(255,215,0,0.25) 100%)',
				border: '1px solid',
				borderColor: 'primary.main',
				boxShadow: '0 4px 14px rgba(0, 120, 80, 0.2)',
				transition: 'transform 0.15s ease, box-shadow 0.15s ease',
				'&:hover': {
					transform: 'translateY(-1px)',
					boxShadow: '0 6px 20px rgba(0, 120, 80, 0.28)',
				},
				'&:active': {
					transform: 'translateY(0)',
				},
			}}
		>
			<Box
				sx={{
					width: 40,
					height: 40,
					borderRadius: '50%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					bgcolor: 'primary.main',
					color: 'primary.contrastText',
					flexShrink: 0,
				}}
			>
				<EmojiEventsIcon />
			</Box>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Typography variant="subtitle2" fontWeight={800} lineHeight={1.2}>
					{t('wc26.quickLinkTitle')}
				</Typography>
				<Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.25 }}>
					{t('wc26.quickLinkHint')}
				</Typography>
			</Box>
			<ChevronRightIcon color="primary" sx={{ flexShrink: 0 }} />
		</Box>
	);
}
