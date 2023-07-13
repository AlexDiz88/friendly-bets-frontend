import Season from './types/Season';

export async function addSeason(
  title: string,
  betCountPerMatchDay: number
): Promise<Season> {
  const result = await fetch('/api/seasons', {
    method: 'POST',
    body: JSON.stringify({ title, betCountPerMatchDay }),
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

export async function getSeasons(): Promise<{ seasons: Season[] }> {
  const result = await fetch('/api/seasons');
  return result.json();
}
