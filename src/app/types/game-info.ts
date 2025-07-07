export interface GameInfo {
  id: string;
  name: string;
  description: string;
  title: string;
  countPlayersMin: number;
  countPlayersMax?: number;
  countCards: number;
  userId: string;
}
