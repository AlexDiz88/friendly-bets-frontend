import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { flagImageUrl, fifaTeamPageUrl } from './fifaAssets';
import { WC26_TEAMS, type Wc26TeamId } from './wc26Teams';

export type Wc26TeamSide = 'home' | 'away';

interface Wc26TeamFlagProps {
	teamId: Wc26TeamId;
	side: Wc26TeamSide;
}

/** Сторона матча: слева «название + флаг», справа «флаг + название» (как на FIFA). */
export default function Wc26TeamFlag({ teamId, side }: Wc26TeamFlagProps): JSX.Element {
	const { t } = useTranslation();
	const team = WC26_TEAMS[teamId];
	const [imgFailed, setImgFailed] = useState(false);
	const name = (
		<Typography
			variant="body2"
			noWrap
			sx={{
				fontWeight: 400,
				fontSize: { xs: '0.8rem', sm: '0.875rem' },
				minWidth: 0,
			}}
		>
			{t(team.nameKey)}
		</Typography>
	);
	const flag = (
		<Box
			sx={{
				width: 24,
				height: 16,
				flexShrink: 0,
				borderRadius: 0.25,
				overflow: 'hidden',
				border: '1px solid',
				borderColor: 'divider',
				bgcolor: 'action.hover',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{!imgFailed ? (
				<Box
					component="img"
					src={flagImageUrl(team.isoFlag)}
					alt=""
					loading="lazy"
					referrerPolicy="no-referrer"
					onError={() => setImgFailed(true)}
					sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
				/>
			) : (
				<Typography sx={{ fontSize: '0.5rem', fontWeight: 700 }}>{team.fifaCode}</Typography>
			)}
		</Box>
	);

	return (
		<Box
			component="a"
			href={fifaTeamPageUrl(team.fifaSlug)}
			target="_blank"
			rel="noopener noreferrer"
			aria-label={t(team.nameKey)}
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: 0.75,
				textDecoration: 'none',
				color: 'inherit',
				minWidth: 0,
			}}
		>
			{side === 'home' ? (
				<>
					{name}
					{flag}
				</>
			) : (
				<>
					{flag}
					{name}
				</>
			)}
		</Box>
	);
}
