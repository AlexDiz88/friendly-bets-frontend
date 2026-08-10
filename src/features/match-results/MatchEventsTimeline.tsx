import { Box, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
	buildMatchEventsPeriods,
	formatMatchEventMinute,
	type MatchEventsPeriod,
} from './matchEventsTimelineModel';
import {
	matchEventsAddedChipSx,
	matchEventsAddedRowSx,
	matchEventsBadgeSx,
	matchEventsBallIconSx,
	matchEventsEmptySx,
	matchEventsFramedIconSx,
	matchEventsGoalMarkSx,
	matchEventsGoalScoreSx,
	matchEventsMinuteCellSx,
	matchEventsMinuteSx,
	matchEventsPeriodHeaderSx,
	matchEventsPeriodLabelSx,
	matchEventsPlayerSx,
	matchEventsRowSx,
	matchEventsSideSx,
	matchEventsTimelineRootSx,
} from './matchEventsTimelineStyles';
import type MatchGoalEvent from './types/MatchGoalEvent';

/** Icons from football24.ua `/assets/icons/fixture/*`. */
const GOAL_BALL_SRC = '/upload/match-events/goal-ball.png';
const PENALTY_GOAL_SRC = '/upload/match-events/penalty-goal.png';
const PENALTY_MISS_SRC = '/upload/match-events/penalty-miss.svg';
const OWN_GOAL_SRC = '/upload/match-events/own-goal.svg';

type Props = {
	events?: MatchGoalEvent[] | null;
	addedTimeFirstHalf?: number | null;
	addedTimeSecondHalf?: number | null;
	/** When true, render nothing if there are no periods (caller can skip section). */
	hideWhenEmpty?: boolean;
};

function periodLabelKey(period: MatchEventsPeriod): string {
	switch (period) {
		case 'H1':
			return 'matchEvents.period.h1';
		case 'H2':
			return 'matchEvents.period.h2';
		case 'OT':
			return 'matchEvents.period.ot';
		case 'PEN':
			return 'matchEvents.period.pen';
		default:
			return 'matchEvents.period.h1';
	}
}

function EventIcon({
	src,
	framed,
}: {
	src: string;
	framed?: boolean;
}): JSX.Element {
	return (
		<Box
			component="img"
			src={src}
			alt=""
			aria-hidden
			sx={framed ? [matchEventsBallIconSx, matchEventsFramedIconSx] : matchEventsBallIconSx}
		/>
	);
}

function EventMarks({
	event,
	scoreAfter,
}: {
	event: MatchGoalEvent;
	scoreAfter?: string;
}): JSX.Element | null {
	const { t } = useTranslation();
	if (event.redCard) {
		return (
			<Box
				component="span"
				sx={matchEventsBadgeSx(event.secondYellow ? 'secondYellow' : 'red')}
				title={
					event.secondYellow
						? t('matchEvents.badge.secondYellow')
						: t('matchEvents.badge.red')
				}
				aria-label={
					event.secondYellow
						? t('matchEvents.badge.secondYellow')
						: t('matchEvents.badge.red')
				}
			/>
		);
	}
	if (event.missed) {
		return (
			<Box
				component="span"
				sx={matchEventsGoalMarkSx}
				title={t('matchEvents.badge.miss')}
				aria-label={t('matchEvents.badge.miss')}
			>
				<EventIcon src={PENALTY_MISS_SRC} framed />
			</Box>
		);
	}

	const isOwn = Boolean(event.ownGoal);
	const isPen = Boolean(event.penalty) || Boolean(event.penaltyShootout);
	const iconSrc = isOwn ? OWN_GOAL_SRC : isPen ? PENALTY_GOAL_SRC : GOAL_BALL_SRC;
	const title = isOwn
		? t('matchEvents.badge.own')
		: isPen
			? t('matchEvents.badge.pen')
			: t('matchEvents.badge.goal');

	return (
		<Box component="span" sx={matchEventsGoalMarkSx} title={title} aria-label={title}>
			<EventIcon src={iconSrc} framed={isOwn || isPen} />
			{scoreAfter ? (
				<Typography component="span" sx={matchEventsGoalScoreSx}>
					{scoreAfter}
				</Typography>
			) : null}
		</Box>
	);
}

function EventSideContent({
	event,
	side,
	scoreAfter,
}: {
	event: MatchGoalEvent;
	side: 'home' | 'away';
	scoreAfter?: string;
}): JSX.Element {
	const isHome = side === 'home';
	const marks = <EventMarks event={event} scoreAfter={scoreAfter} />;
	const name = (
		<Typography sx={matchEventsPlayerSx} title={event.playerName || undefined}>
			{event.playerName || '—'}
		</Typography>
	);
	return (
		<>
			{isHome ? (
				<>
					{name}
					{marks}
				</>
			) : (
				<>
					{marks}
					{name}
				</>
			)}
		</>
	);
}

export default function MatchEventsTimeline({
	events,
	addedTimeFirstHalf,
	addedTimeSecondHalf,
	hideWhenEmpty = true,
}: Props): JSX.Element | null {
	const { t } = useTranslation();
	const periods = useMemo(
		() => buildMatchEventsPeriods(events, addedTimeFirstHalf, addedTimeSecondHalf),
		[events, addedTimeFirstHalf, addedTimeSecondHalf]
	);

	if (periods.length === 0) {
		if (hideWhenEmpty) {
			return null;
		}
		return (
			<Box sx={matchEventsTimelineRootSx}>
				<Typography sx={matchEventsEmptySx}>{t('matchEvents.empty')}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={matchEventsTimelineRootSx} aria-label={t('matchEvents.title')}>
			{periods.map((block) => (
				<Box key={block.period} sx={{ display: 'flex', flexDirection: 'column', gap: 0.35 }}>
					<Box sx={matchEventsPeriodHeaderSx}>
						<Typography component="span" sx={matchEventsPeriodLabelSx}>
							{t(periodLabelKey(block.period))}
						</Typography>
					</Box>
					{block.items.map((item, idx) => {
						if (item.kind === 'addedTime') {
							return (
								<Box key={`added-${block.period}-${idx}`} sx={matchEventsAddedRowSx}>
									<Typography component="span" sx={matchEventsAddedChipSx}>
										{t('matchEvents.addedTime', { minutes: item.minutes })}
									</Typography>
								</Box>
							);
						}
						const side =
							item.event.teamSide?.toUpperCase() === 'AWAY' ? 'away' : 'home';
						const isHome = side === 'home';
						return (
							<Box key={`ev-${block.period}-${idx}`} sx={matchEventsRowSx}>
								<Box sx={matchEventsSideSx('home', isHome)}>
									{isHome ? (
										<EventSideContent
											event={item.event}
											side="home"
											scoreAfter={item.scoreAfter}
										/>
									) : null}
								</Box>
								<Box sx={matchEventsMinuteCellSx}>
									<Typography component="span" sx={matchEventsMinuteSx}>
										{item.event.penaltyShootout
											? t('matchEvents.penMark')
											: formatMatchEventMinute(item.event)}
									</Typography>
								</Box>
								<Box sx={matchEventsSideSx('away', !isHome)}>
									{!isHome ? (
										<EventSideContent
											event={item.event}
											side="away"
											scoreAfter={item.scoreAfter}
										/>
									) : null}
								</Box>
							</Box>
						);
					})}
				</Box>
			))}
		</Box>
	);
}
