/* eslint-disable @typescript-eslint/restrict-template-expressions */
import BetsPage from '../../bets/types/BetsPage';
import Calendar from './types/Calendar';
import NewCalendar from './types/NewCalendar';

export async function getAllSeasonCalendarNodes(
	seasonId: string
): Promise<{ calendarNodes: Calendar[] }> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/calendars/seasons/${seasonId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/calendars/seasons/${seasonId}`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function createCalendarNode(newCalendarNode: NewCalendar): Promise<Calendar> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/calendars`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = '/api/calendars';
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify(newCalendarNode),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function addBetToCalendarNode(
	betId: string,
	calendarNodeId: string
): Promise<Calendar> {
	let url = `${
		import.meta.env.VITE_PRODUCT_SERVER || ''
	}/api/calendars/${calendarNodeId}/bets/${betId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/calendars/${calendarNodeId}/bets/${betId}`;
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify({ betId, calendarNodeId }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function getBetsByCalendarNode(calendarNodeId: string): Promise<BetsPage> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/calendars/${calendarNodeId}/bets`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/calendars/${calendarNodeId}/bets`;
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}

export async function deleteCalendarNode(calendarNodeId: string): Promise<Calendar> {
	let url = `${import.meta.env.VITE_PRODUCT_SERVER || ''}/api/calendars/${calendarNodeId}`;
	if (import.meta.env.VITE_PRODUCT_SERVER === 'localhost') {
		url = `/api/calendars/${calendarNodeId}`;
	}
	const result = await fetch(url, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
