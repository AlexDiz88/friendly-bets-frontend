import Bet, { BetId } from './types/Bet';

export async function addBet(bet: Bet): Promise<Bet> {
  const result = await fetch('/api/bets', {
    method: 'POST',
    body: JSON.stringify(bet),
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

export async function getUserBets(): Promise<{ bets: Bet[] }> {
  const result = await fetch('/api/my/bets');
  return result.json();
}

export async function getAllBets(): Promise<{ bets: Bet[] }> {
  const result = await fetch('/api/bets');
  return result.json();
}

export async function deleteBet(id: BetId): Promise<void> {
  await fetch(`/api/bets/${id}`, {
    method: 'DELETE',
  });
}
