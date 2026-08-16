import { RootState } from '../../../app/store';
import Calendar from './types/Calendar';

export const selectAllCalendarNodes = (state: RootState): Calendar[] => state.calendars.allCalendarNodes;

export const selectCalendarNodesHasBets = (state: RootState): Calendar[] =>
	state.calendars.calendarNodesHasBets;

export const selectBetsByCalendarNodeId =
	(nodeId: string | undefined) =>
	(state: RootState) =>
		nodeId ? state.calendars.betsByCalendarNodeId[nodeId] : undefined;

export const selectGameweeksOverviewSeasonId = (state: RootState): string | undefined =>
	state.calendars.gameweeksOverviewSeasonId;

export const selectGameweeksBetsLoadingForNode =
	(nodeId: string | undefined) =>
	(state: RootState): boolean =>
		Boolean(nodeId && state.calendars.betsLoadingByCalendarNodeId?.[nodeId]);
