import PlayerStats from './types/PlayerStats';

export async function getPlayersStatsBySeason(
  seasonId: string
): Promise<{ playersStats: PlayerStats[] }> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/season/${seasonId}/stats`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/users/season/${seasonId}/stats`;
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

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
