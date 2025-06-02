export interface GameInfo {
  gameInfoID: number,
  name: string;
  countPlayersMin: number;
  countPlayersMax?: number;
  countCards: number;
  userID: number
}
