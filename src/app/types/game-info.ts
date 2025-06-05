export interface GameInfo {
  id: number,
  name: string;
  countPlayersMin: number;
  countPlayersMax?: number;
  countCards: number;
  userID: number
}
