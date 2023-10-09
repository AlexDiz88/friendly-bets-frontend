import Team from './types/Team';

export async function createTeam(
	fullTitleRu: string,
	fullTitleEn: string,
	country: string
): Promise<Team> {
	let url = `${process.env.REACT_APP_PRODUCT_SERVER || ''}/api/teams`;
	if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
		url = '/api/teams';
	}
	const result = await fetch(`${url}`, {
		method: 'POST',
		body: JSON.stringify({ fullTitleRu, fullTitleEn, country }),
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

export async function getAllTeams(): Promise<{ teams: Team[] }> {
	let url = `${process.env.REACT_APP_PRODUCT_SERVER || ''}/api/teams`;
	if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
		url = '/api/teams';
	}
	const result = await fetch(`${url}`);
	if (result.status >= 400) {
		const { message }: { message: string } = await result.json();
		throw new Error(message);
	}
	return result.json();
}
