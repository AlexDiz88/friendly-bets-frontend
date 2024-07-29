import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Box, Container, Fab, Link, Typography } from '@mui/material';
import { t } from 'i18next';

export default function Rules(): JSX.Element {
	const handleScrollToTop = (): void => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<Container>
			<Box sx={{ mx: 0.5, my: 3, textAlign: 'left' }}>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.1a')}</b> - {t('tournamentRules:rule.1b')}
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.1c')}</b> - {t('tournamentRules:rule.1d')}
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.2a')}</b> {t('tournamentRules:rule.2b')}
					<br /> {t('tournamentRules:rule.2c')}
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.3a')}</b> {t('tournamentRules:rule.3b')}
					<span style={{ color: 'brown', fontWeight: 600 }}>
						<br />
						{t('tournamentRules:rule.3c')}
					</span>
					: {t('tournamentRules:rule.3d')}
				</Typography>
				<Box sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.4a')}</b> {t('tournamentRules:rule.4b')}
					<ul>
						<span style={{ color: 'green', fontWeight: 600 }}>{t('tournamentRules:rule.4c')}</span>
						<li>{t('tournamentRules:rule.4d')}</li>
						<li>{t('tournamentRules:rule.4e')}</li>
						<li>{t('tournamentRules:rule.4f')}</li>
						<li>{t('tournamentRules:rule.4g')}</li>
						<li>{t('tournamentRules:rule.4h')}</li>
						<li>{t('tournamentRules:rule.4i')}</li>
					</ul>
					{t('tournamentRules:rule.4j')}
				</Box>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.5a')}</b> {t('tournamentRules:rule.5b')}
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.6a')}</b> {t('tournamentRules:rule.6b')}
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.7a')}</b> {t('tournamentRules:rule.7b')}{' '}
					<Link>https://www.marathonbet.com</Link> {t('tournamentRules:rule.7c')}{' '}
					<Link>https://1xbet.com/</Link> {t('tournamentRules:rule.7d')}
				</Typography>
				<Typography sx={{ my: 1 }}>
					<b>{t('tournamentRules:rule.8a')}</b> {t('tournamentRules:rule.8b')}
				</Typography>
				<Box sx={{ textAlign: 'center' }}>
					<Fab color="primary" onClick={handleScrollToTop}>
						<KeyboardArrowUpIcon />
					</Fab>
				</Box>
			</Box>
		</Container>
	);
}
