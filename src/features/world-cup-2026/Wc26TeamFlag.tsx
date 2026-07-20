import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { flagImageUrl } from './wc26FlagAssets';
import { WC26_TEAMS, type Wc26TeamId } from './wc26Teams';

export type Wc26TeamSide = 'home' | 'away';

interface Wc26TeamFlagProps {
	teamId: Wc26TeamId;
	side: Wc26TeamSide;
	/** Уменьшенные флаг и подпись (страница результатов ЧМ, плотная сетка слота). */
	compact?: boolean;
	/** Обрезать длинное название многоточием (по умолчанию да). */
	truncate?: boolean;
}

/** Сторона матча: слева «название + флаг», справа «флаг + название». */
export default function Wc26TeamFlag({
	teamId,
	side,
	compact = false,
	truncate = true,
}: Wc26TeamFlagProps): JSX.Element {
	const { t } = useTranslation();
	const team = WC26_TEAMS[teamId];
	const [imgFailed, setImgFailed] = useState(false);
	const name = (
		<Typography
			variant="body2"
			noWrap
			sx={{
				fontWeight: 400,
				fontSize: compact
					? { xs: '0.85rem', sm: '0.9rem' }
					: { xs: '0.9rem', sm: '0.95rem' },
				lineHeight: compact ? 1.2 : undefined,
				minWidth: 0,
				flexShrink: truncate ? 1 : 0,
				overflow: truncate ? 'hidden' : 'visible',
				textOverflow: truncate ? 'ellipsis' : 'clip',
			}}
		>
			{t(team.nameKey)}
		</Typography>
	);
	const flag = (
		<Box
			sx={{
				width: compact ? 26 : 28,
				height: compact ? 18 : 20,
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
			sx={{
				display: 'flex',
				alignItems: 'center',
				gap: compact ? 0.6 : 0.75,
				minWidth: 0,
				flexShrink: truncate ? 1 : 0,
				flexWrap: 'nowrap',
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
