import { RootState } from '../../../app/store';
import Calendar from './types/Calendar';

export const selectAllCalendarNodes = (state: RootState): Calendar[] => state.calendars.allCalendarNodes;

export const selectCalendarNodesHasBets = (state: RootState): Calendar[] =>
	state.calendars.calendarNodesHasBets;

export const selectBetsByCalendarNodeId =
	(nodeId: string | undefined) =>
	(state: RootState) =>
		nodeId ? state.calendars.betsByCalendarNodeId[nodeId] : undefined;

export const selectGameweeksBetsLoading = (state: RootState): boolean =>
	state.calendars.gameweeksBetsLoading ?? false;
