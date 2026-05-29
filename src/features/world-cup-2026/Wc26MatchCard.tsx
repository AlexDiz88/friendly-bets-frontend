import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26TeamFlag from './Wc26TeamFlag';
import { kickoffToGerman } from './wc26Time';
import type { Wc26Match } from './wc26Schedule';

interface Wc26MatchCardProps {
	match: Wc26Match;
}

export default function Wc26MatchCard({ match }: Wc26MatchCardProps): JSX.Element {
	const { t } = useTranslation();
	const german = useMemo(
		() => kickoffToGerman(match.date, match.timeLocal, match.venueKey),
		[match.date, match.timeLocal, match.venueKey]
	);
	const hasTeams = Boolean(match.home && match.away);

	return (
		<Box sx={{ py: 0.75, px: 0.5 }}>
			{(match.group || match.id) && (
				<Typography
					variant="caption"
					color="text.secondary"
					sx={{ display: 'block', mb: 0.25, pl: 0.25, fontSize: '0.65rem' }}
				>
					#{match.id}
					{match.group ? ` · ${t('wc26.group', { letter: match.group })}` : ''}
				</Typography>
			)}

			{hasTeams ? (
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: { xs: 0.75, sm: 1.25 },
						width: '100%',
					}}
				>
					<Box
						sx={{
							flex: 1,
							display: 'flex',
							justifyContent: 'flex-end',
							minWidth: 0,
						}}
					>
						<Wc26TeamFlag teamId={match.home!} side="home" />
					</Box>

					<Typography
						component="span"
						sx={{
							flexShrink: 0,
							fontWeight: 500,
							fontSize: { xs: '1.05rem', sm: '1.15rem' },
							fontVariantNumeric: 'tabular-nums',
							lineHeight: 1,
							px: 0.25,
						}}
					>
						{german.time}
					</Typography>

					<Box
						sx={{
							flex: 1,
							display: 'flex',
							justifyContent: 'flex-start',
							minWidth: 0,
						}}
					>
						<Wc26TeamFlag teamId={match.away!} side="away" />
					</Box>
				</Box>
			) : (
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<Typography
						component="span"
						sx={{
							flexShrink: 0,
							fontWeight: 500,
							fontSize: { xs: '1.05rem', sm: '1.15rem' },
							fontVariantNumeric: 'tabular-nums',
						}}
					>
						{german.time}
					</Typography>
					<Typography variant="body2" sx={{ fontSize: '0.8rem', lineHeight: 1.3 }}>
						{t(match.labelKey ?? '')}
					</Typography>
				</Box>
			)}
		</Box>
	);
}
