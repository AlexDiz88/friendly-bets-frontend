import { Alert, Box, Chip, CircularProgress, Container, Stack, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import Wc26BracketView from './Wc26BracketView';
import Wc26PageHero from './Wc26PageHero';
import Wc26PageViewTabs from './Wc26PageViewTabs';
import Wc26MatchCard from './Wc26MatchCard';
import Wc26StandingsView, { type Wc26StandingsGroupFilter } from './Wc26StandingsView';
import type { Wc26Match } from './wc26Schedule';
import {
	WC26_VIEW_FILTER_MOBILE_ROW1,
	WC26_VIEW_FILTER_MOBILE_ROW2,
	WC26_VIEW_FILTER_ORDER,
	filterWc26Matches,
	type Wc26ViewFilter,
} from './wc26ViewFilters';
import { kickoffToGerman, wc26DateLocale } from './wc26Time';
import {
	wc26DividerSx,
	wc26MatchCountSx,
	wc26PageNoSelectSx,
	wc26SectionHeaderSx,
	wc26StageChipSx,
	wc26StageChipBarMobileSx,
	wc26StageChipBarRowSx,
	wc26StageChipBarSx,
	wc26StickyFilterBarSx,
} from './wc26PageStyles';
import { useWc26SchedulePage } from './useWc26SchedulePage';
import type { Wc26MatchWithResult } from './wc26ScheduleApi';
import {
	WC26_BRACKET_STAGE_ORDER,
	WC26_GROUP_LETTERS,
	type Wc26BracketStageFilter,
	type Wc26PageView,
} from './wc26PageViews';

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

function parsePageView(raw: string | null): Wc26PageView {
	if (raw === 'standings' || raw === 'bracket') {
		return raw;
	}
	return 'schedule';
}

function parseGroupFilter(raw: string | null): Wc26StandingsGroupFilter {
	if (!raw || raw === 'all') {
		return 'all';
	}
	if (raw === 'best_third') {
		return 'best_third';
	}
	const upper = raw.toUpperCase();
	return WC26_GROUP_LETTERS.includes(upper as (typeof WC26_GROUP_LETTERS)[number])
		? (upper as Wc26StandingsGroupFilter)
		: 'all';
}

function parseBracketStage(raw: string | null): Wc26BracketStageFilter {
	if (!raw) {
		return 'round_of_32';
	}
	return WC26_BRACKET_STAGE_ORDER.includes(raw as (typeof WC26_BRACKET_STAGE_ORDER)[number])
		? (raw as Wc26BracketStageFilter)
		: 'round_of_32';
}

export default function WorldCup26Page(): JSX.Element {
	const { t, i18n } = useTranslation();
	const [searchParams, setSearchParams] = useSearchParams();
	const dateLocale = wc26DateLocale(i18n.language);
	const pageView = parsePageView(searchParams.get('view'));
	const groupFilter = parseGroupFilter(searchParams.get('group'));
	const bracketStage = parseBracketStage(searchParams.get('stage'));
	const [viewFilter, setViewFilter] = useState<Wc26ViewFilter>('all');
	const { matches: scheduleMatches, loading, error } = useWc26SchedulePage();

	const updateSearch = useCallback(
		(patch: Record<string, string | null>): void => {
			setSearchParams(
				(prev) => {
					const next = new URLSearchParams(prev);
					for (const [key, value] of Object.entries(patch)) {
						if (value == null || value === '') {
							next.delete(key);
						} else {
							next.set(key, value);
						}
					}
					return next;
				},
				{ replace: true }
			);
		},
		[setSearchParams]
	);

	const handlePageViewChange = useCallback(
		(view: Wc26PageView): void => {
			if (view === 'schedule') {
				updateSearch({ view: null });
				return;
			}
			updateSearch({ view });
		},
		[updateSearch]
	);

	const handleGroupFilterChange = useCallback(
		(group: Wc26StandingsGroupFilter): void => {
			updateSearch({ view: 'standings', group: group === 'all' ? null : group });
		},
		[updateSearch]
	);

	const handleBracketStageChange = useCallback(
		(stage: Wc26BracketStageFilter): void => {
			updateSearch({ view: 'bracket', stage: stage === 'round_of_32' ? null : stage });
		},
		[updateSearch]
	);

	const filtered = useMemo(
		() => filterWc26Matches(scheduleMatches, viewFilter),
		[scheduleMatches, viewFilter]
	);
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

	const chipsByValue = useMemo(
		() => new Map(stageChips.map((chip) => [chip.value, chip])),
		[stageChips]
	);

	const renderStageChip = (value: Wc26ViewFilter): JSX.Element | null => {
		const chip = chipsByValue.get(value);
		if (!chip) {
			return null;
		}
		return (
			<Chip
				key={value}
				label={chip.label}
				onClick={() => setViewFilter(value)}
				sx={wc26StageChipSx(viewFilter === value)}
			/>
		);
	};

	const renderChipRow = (filters: Wc26ViewFilter[]): JSX.Element => (
		<Box sx={wc26StageChipBarRowSx}>
			{filters.map((value) => renderStageChip(value))}
		</Box>
	);

	return (
		<Box sx={wc26PageNoSelectSx}>
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
					<Wc26PageViewTabs value={pageView} onChange={handlePageViewChange} />

					{pageView === 'schedule' ? (
						<Box sx={wc26StickyFilterBarSx}>
							<Box sx={{ ...wc26StageChipBarMobileSx, display: { xs: 'flex', sm: 'none' } }}>
								{renderChipRow(WC26_VIEW_FILTER_MOBILE_ROW1)}
								{renderChipRow(WC26_VIEW_FILTER_MOBILE_ROW2)}
							</Box>
							<Box sx={{ ...wc26StageChipBarSx, display: { xs: 'none', sm: 'flex' } }}>
								{stageChips.map(({ value }) => renderStageChip(value))}
							</Box>
						</Box>
					) : null}

					{pageView === 'schedule' ? (
						<>
							{error ? (
								<Alert severity="error" sx={{ mb: 1 }}>
									{t(`error.${error}`, { defaultValue: error })}
								</Alert>
							) : null}

							{loading ? (
								<Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
									<CircularProgress size={28} />
								</Box>
							) : null}

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
											<Stack spacing={0} divider={<Box sx={wc26DividerSx} />}>
												{dayMatches.map((match) => {
													const withResult = match as Wc26MatchWithResult;
													return (
														<Wc26MatchCard
															key={match.id}
															match={match}
															scoreView={withResult.scoreView}
															status={withResult.status}
															finalized={withResult.finalized}
															liveMinuteLabel={withResult.liveMinuteLabel}
															fetchedAt={withResult.fetchedAt}
															scoresReady={!loading}
														/>
													);
												})}
											</Stack>
										</Box>
									);
								})}
							</Stack>
						</>
					) : null}

					{pageView === 'standings' ? (
						<Wc26StandingsView
							groupFilter={groupFilter}
							onGroupFilterChange={handleGroupFilterChange}
						/>
					) : null}

					{pageView === 'bracket' ? (
						<Wc26BracketView
							stageFilter={bracketStage}
							onStageFilterChange={handleBracketStageChange}
						/>
					) : null}
				</Container>
			</Box>
		</Box>
	);
}
