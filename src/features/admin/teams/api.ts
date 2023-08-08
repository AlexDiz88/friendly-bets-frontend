import Team from './types/Team';

export async function createTeam(
  fullTitleRu: string,
  fullTitleEn: string,
  country: string
): Promise<Team> {
  const result = await fetch(`${process.env.REACT_APP_PRODUCT_SERVER}/api/teams`, {
    method: 'POST',
    body: JSON.stringify({ fullTitleRu, fullTitleEn, country }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getAllTeams(): Promise<{ teams: Team[] }> {
  const result = await fetch(`${process.env.REACT_APP_PRODUCT_SERVER}/api/teams`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}
