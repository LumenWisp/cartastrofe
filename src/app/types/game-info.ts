export interface GameInfo {
  id: number;
  name: string;
  description: string;
  title: string;
  countPlayersMin: number;
  countPlayersMax?: number;
  countCards: number;
  userId: number;
}
