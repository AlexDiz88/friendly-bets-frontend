import Bet from '../../bets/types/Bet';
import NewBet from '../../bets/types/NewBet';
import NewEmptyBet from '../../bets/types/NewEmptyBet';
import NewGameResult from '../../bets/types/NewGameResult';
import League from '../leagues/types/League';
import Season from './types/Season';

export async function addSeason(
  title: string,
  betCountPerMatchDay: number
): Promise<Season> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/seasons';
  }
  const result = await fetch(`${url}`, {
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
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/seasons';
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getSeasonStatusList(): Promise<string[]> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/statuses`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/seasons/statuses';
  }
  const result = await fetch(`${url}`);
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
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/${id}`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/seasons/${id}`;
  }
  const result = await fetch(`${url}`, {
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
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/active`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/seasons/active';
  }
  const result = await fetch(`${url}`);

  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getActiveSeasonId(): Promise<{ value: string }> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/active/id`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/seasons/active/id';
  }
  const result = await fetch(`${url}`);

  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getScheduledSeason(): Promise<Season> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/scheduled`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/seasons/scheduled';
  }
  const result = await fetch(`${url}`);

  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function registrationInSeason(seasonId: string): Promise<Season> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/registration/${seasonId}`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/seasons/registration/${seasonId}`;
  }
  const result = await fetch(`${url}`, {
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
//   let url = `${process.env.REACT_APP_PRODUCT_SERVER}/login`;
//   if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
//     url = '/login';
//   }
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
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/${seasonId}/leagues`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/seasons/${seasonId}/leagues`;
  }
  const result = await fetch(`${url}`, {
    method: 'POST',
    body: JSON.stringify({
      displayNameRu,
      displayNameEn,
      shortNameRu,
      shortNameEn,
    }),
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
): Promise<League> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/${seasonId}/leagues/${leagueId}/teams/${teamId}`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/seasons/${seasonId}/leagues/${leagueId}/teams/${teamId}`;
  }
  const result = await fetch(`${url}`, {
    method: 'POST',
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

export async function addBetToLeagueInSeason(
  seasonId: string,
  leagueId: string,
  newBet: NewBet
): Promise<Bet> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/${seasonId}/leagues/${leagueId}/bets`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/seasons/${seasonId}/leagues/${leagueId}/bets`;
  }
  const result = await fetch(`${url}`, {
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
): Promise<Bet> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/${seasonId}/leagues/${leagueId}/bets/empty`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/seasons/${seasonId}/leagues/${leagueId}/bets/empty`;
  }
  const result = await fetch(`${url}`, {
    method: 'POST',
    body: JSON.stringify(newEmptyBet),
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

export async function addBetResult(
  seasonId: string,
  betId: string,
  newGameResult: NewGameResult
): Promise<Bet> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/seasons/${seasonId}/bets/${betId}`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/seasons/${seasonId}/bets/${betId}`;
  }
  const result = await fetch(`${url}`, {
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
