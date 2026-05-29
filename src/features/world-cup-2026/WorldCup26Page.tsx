import {
	Box,
	Chip,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26BetSlotsView from './Wc26BetSlotsView';
import Wc26PageHero from './Wc26PageHero';
import Wc26MatchCard from './Wc26MatchCard';
import type { Wc26Match } from './wc26Schedule';
import {
	WC26_VIEW_FILTER_ORDER,
	filterWc26Matches,
	isBetSlotsView,
	type Wc26ViewFilter,
} from './wc26ViewFilters';
import { kickoffToGerman, wc26DateLocale } from './wc26Time';

function groupMatchesByGermanDate(matches: Wc26Match[]): Map<string, Wc26Match[]> {
	const map = new Map<string, Wc26Match[]>();
	for (const m of matches) {
		const { date } = kickoffToGerman(m.date, m.timeLocal, m.venueKey);
		const list = map.get(date) ?? [];
		list.push(m);
		map.set(date, list);
	}
	for (const list of map.values()) {
		list.sort((a, b) => {
			const ta = kickoffToGerman(a.date, a.timeLocal, a.venueKey).time;
			const tb = kickoffToGerman(b.date, b.timeLocal, b.venueKey).time;
			return ta.localeCompare(tb);
		});
	}
	return map;
}

export default function WorldCup26Page(): JSX.Element {
	const { t, i18n } = useTranslation();
	const dateLocale = wc26DateLocale(i18n.language);
	const [viewFilter, setViewFilter] = useState<Wc26ViewFilter>('bet_slots');

	const filtered = useMemo(() => filterWc26Matches(viewFilter), [viewFilter]);
	const byDate = useMemo(() => groupMatchesByGermanDate(filtered), [filtered]);
	const sortedDates = useMemo(() => [...byDate.keys()].sort(), [byDate]);

	const stageChips = useMemo(
		() =>
			WC26_VIEW_FILTER_ORDER.map((value) => ({
				value,
				label: t(`wc26.stages.${value}`),
			})),
		[t]
	);

	return (
		<>
			<Wc26PageHero />
			<Box
				sx={{
					minHeight: '100%',
					pb: 4,
					background: (theme) =>
						theme.palette.mode === 'dark'
							? 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 120, 80, 0.22) 0%, transparent 55%), linear-gradient(180deg, #0b1424 0%, #0d1117 100%)'
							: 'radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0, 168, 107, 0.12) 0%, transparent 55%), linear-gradient(180deg, #e8f4ef 0%, #f5f7fa 40%)',
				}}
			>
			<Container maxWidth="sm" disableGutters sx={{ px: { xs: 1.5, sm: 2 } }}>
				<Box
					sx={{
						position: 'sticky',
						top: { xs: 56, sm: 64 },
						zIndex: 10,
						py: 1,
						mb: 1,
						mx: -0.5,
						px: 0.5,
						backdropFilter: 'blur(12px)',
						bgcolor: (theme) =>
							theme.palette.mode === 'dark'
								? 'rgba(13, 17, 23, 0.85)'
								: 'rgba(245, 247, 250, 0.9)',
					}}
				>
					<Stack
						direction="row"
						spacing={0.75}
						sx={{
							overflowX: 'auto',
							pb: 0.5,
							'&::-webkit-scrollbar': { display: 'none' },
							scrollbarWidth: 'none',
						}}
					>
						{stageChips.map(({ value, label }) => (
							<Chip
								key={value}
								label={label}
								onClick={() => setViewFilter(value)}
								color={viewFilter === value ? 'primary' : 'default'}
								variant={viewFilter === value ? 'filled' : 'outlined'}
								sx={{
									flexShrink: 0,
									fontWeight: 600,
									fontSize: '0.75rem',
									height: 36,
									borderRadius: 2,
								}}
							/>
						))}
					</Stack>
				</Box>

				{!isBetSlotsView(viewFilter) && (
					<Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1, px: 0.5 }}>
						{t('wc26.matchCount', { count: filtered.length })}
					</Typography>
				)}

				{isBetSlotsView(viewFilter) ? (
					<Wc26BetSlotsView />
				) : (
					<Stack spacing={1.5}>
						{sortedDates.map((date) => {
							const dayMatches = byDate.get(date) ?? [];
							const headerDate = new Date(`${date}T12:00:00`).toLocaleDateString(dateLocale, {
								weekday: 'long',
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							});

							return (
								<Box key={date}>
									<Typography
										variant="caption"
										fontWeight={800}
										sx={{
											mb: 0.5,
											px: 1,
											py: 0.5,
											borderRadius: 1,
											bgcolor: 'primary.main',
											color: 'primary.contrastText',
											textTransform: 'capitalize',
											display: 'block',
										}}
									>
										{headerDate}
									</Typography>
									<Stack
										spacing={0}
										divider={
											<Box
												sx={{ borderBottom: '1px solid', borderColor: 'divider', mx: 0.5 }}
											/>
										}
									>
										{dayMatches.map((match) => (
											<Wc26MatchCard key={match.id} match={match} />
										))}
									</Stack>
								</Box>
							);
						})}
					</Stack>
				)}
			</Container>
			</Box>
		</>
	);
}
