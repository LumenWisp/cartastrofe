import { GameModes } from '../enum/game-mode';

export interface GameInfoData {
  name: string;
  description: string;
  gameMode: GameModes;
  countPlayersMin: number;
  countPlayersMax: number;
}

export interface GameInfo extends GameInfoData {
  id: string;
  title: string;
  countCards: number;
  userId: string;
}
