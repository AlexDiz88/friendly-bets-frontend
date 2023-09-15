import LeagueStats from './types/LeagueStats';
import PlayerStats from './types/PlayerStats';

export async function getAllPlayersStatsBySeason(
  seasonId: string
): Promise<{ playersStats: PlayerStats[] }> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/stats/season/${seasonId}`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/stats/season/${seasonId}`;
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getAllPlayersStatsByLeagues(
  seasonId: string
): Promise<{ playersStatsByLeagues: LeagueStats[] }> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/stats/season/${seasonId}/leagues`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/stats/season/${seasonId}/leagues`;
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function playersStatsFullRecalculation(
  seasonId: string
): Promise<{ playersStats: PlayerStats[] }> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/stats/season/${seasonId}/recalculation`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/stats/season/${seasonId}/recalculation`;
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

// TODO: сделать позже - статистика игрока за все сезоны
export async function getAllPlayersStats(): Promise<{
  playersStats: PlayerStats[];
}> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/my/bets`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/my/bets';
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}
