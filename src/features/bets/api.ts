import Bet, { BetId } from './types/Bet';

export async function getUserBets(): Promise<{ bets: Bet[] }> {
  const result = await fetch('/api/my/bets');
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function getAllBets(): Promise<{ bets: Bet[] }> {
  const result = await fetch('/api/bets');
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function deleteBet(id: BetId): Promise<Bet> {
  const result = await fetch(`/api/bets/${id}`, {
    method: 'DELETE',
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}
