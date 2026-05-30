import {
	Box,
	Chip,
	Container,
	Stack,
	Typography,
} from '@mui/material';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Wc26PageHero from './Wc26PageHero';
import Wc26MatchCard from './Wc26MatchCard';
import type { Wc26Match } from './wc26Schedule';
import {
	WC26_VIEW_FILTER_ORDER,
	filterWc26Matches,
	type Wc26ViewFilter,
} from './wc26ViewFilters';
import { kickoffToGerman, wc26DateLocale } from './wc26Time';
import {
	wc26DividerSx,
	wc26MatchCountSx,
	wc26SectionHeaderSx,
	wc26StageChipSx,
	wc26StickyFilterBarSx,
} from './wc26PageStyles';

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
	const [viewFilter, setViewFilter] = useState<Wc26ViewFilter>('all');

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
				<Box sx={wc26StickyFilterBarSx}>
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
								sx={wc26StageChipSx(viewFilter === value)}
							/>
						))}
					</Stack>
				</Box>

				<Typography variant="caption" sx={wc26MatchCountSx}>
					{t('wc26.matchCount', { count: filtered.length })}
				</Typography>

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
								<Typography variant="caption" sx={wc26SectionHeaderSx}>
									{headerDate}
								</Typography>
								<Stack
									spacing={0}
									divider={<Box sx={wc26DividerSx} />}
								>
									{dayMatches.map((match) => (
										<Wc26MatchCard key={match.id} match={match} />
									))}
								</Stack>
							</Box>
						);
					})}
				</Stack>
			</Container>
			</Box>
		</>
	);
}
