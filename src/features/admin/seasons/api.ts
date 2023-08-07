import NewBet from '../../bets/types/NewBet';
import NewEmptyBet from '../../bets/types/NewEmptyBet';
import NewGameResult from '../../bets/types/NewGameResult';
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
  const result = await fetch(`${process.env.PRODUCT_SERVER}/api/seasons/active`);

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

// export async function getLeaguesBySeason(seasonId: string): Promise<Season> {
//   const result = await fetch(`/api/seasons/${seasonId}/leagues`);
//   if (result.status >= 400) {
//     const { message } = await result.json();
//     throw new Error(message);
//   }
//   return result.json();
// }

export async function addLeagueToSeason(
  seasonId: string,
  displayNameRu: string,
  displayNameEn: string,
  shortNameRu: string,
  shortNameEn: string
): Promise<Season> {
  const result = await fetch(`/api/seasons/${seasonId}/leagues`, {
    method: 'POST',
    body: JSON.stringify({ displayNameRu, displayNameEn, shortNameRu, shortNameEn }),
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

export async function addTeamToLeagueInSeason(
  seasonId: string,
  leagueId: string,
  teamId: string
): Promise<Season> {
  const result = await fetch(
    `/api/seasons/${seasonId}/leagues/${leagueId}/teams/${teamId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function addBetToLeagueInSeason(
  seasonId: string,
  leagueId: string,
  newBet: NewBet
): Promise<Season> {
  const result = await fetch(`/api/seasons/${seasonId}/leagues/${leagueId}/bets`, {
    method: 'POST',
    body: JSON.stringify(newBet),
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

export async function addEmptyBetToLeagueInSeason(
  seasonId: string,
  leagueId: string,
  newEmptyBet: NewEmptyBet
): Promise<Season> {
  const result = await fetch(
    `/api/seasons/${seasonId}/leagues/${leagueId}/bets/empty`,
    {
      method: 'POST',
      body: JSON.stringify(newEmptyBet),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function addBetResult(
  seasonId: string,
  betId: string,
  newGameResult: NewGameResult
): Promise<Season> {
  const result = await fetch(`/api/seasons/${seasonId}/bets/${betId}`, {
    method: 'POST',
    body: JSON.stringify(newGameResult),
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
