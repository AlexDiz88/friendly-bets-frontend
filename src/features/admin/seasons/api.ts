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
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getSeasonStatusList(): Promise<string[]> {
  const result = await fetch('/api/seasons/statuses');
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function changeSeasonStatus(
  id: string,
  status: string
): Promise<Season> {
  const result = await fetch(`/api/seasons/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(status),
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

export async function getActiveSeason(): Promise<Season> {
  const result = await fetch('/api/seasons/active');

  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getScheduledSeason(): Promise<Season> {
  const result = await fetch('/api/seasons/scheduled');

  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function registrationInSeason(seasonId: string): Promise<Season> {
  const result = await fetch(`/api/seasons/registration/${seasonId}`, {
    method: 'PUT',
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
