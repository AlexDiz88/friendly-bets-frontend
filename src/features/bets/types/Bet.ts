export default interface Bet {
  id: number;
  name: string;
  description: string;
  // другие поля
}

export type BetId = Bet['id'];
