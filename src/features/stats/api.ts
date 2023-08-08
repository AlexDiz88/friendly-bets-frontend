import PlayerStats from './types/PlayerStats';

export async function getPlayersStatsBySeason(
  seasonId: string
): Promise<{ playersStats: PlayerStats[] }> {
  const result = await fetch(
    `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/season/${seasonId}/stats`
  );
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getAllPlayersStats(): Promise<{
  playersStats: PlayerStats[];
}> {
  const result = await fetch(`${process.env.REACT_APP_PRODUCT_SERVER}/api/my/bets`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}
