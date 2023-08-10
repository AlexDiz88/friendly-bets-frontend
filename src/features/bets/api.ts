import Bet, { BetId } from './types/Bet';

export async function getUserBets(): Promise<{ bets: Bet[] }> {
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

export async function getAllBets(): Promise<{ bets: Bet[] }> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/bets`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/bets';
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function deleteBet(id: BetId): Promise<Bet> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/bets/${id}`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = `/api/bets/${id}`;
  }
  const result = await fetch(`${url}`, {
    method: 'DELETE',
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}
