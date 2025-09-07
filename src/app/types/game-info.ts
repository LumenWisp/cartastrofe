import { GameModesEnum } from '../enum/game-modes.enum';

export interface GameInfoData {
  name: string;
  description: string;
  gameMode: GameModesEnum;
  countPlayersMin: number;
  countPlayersMax: number;
}

export interface GameInfo extends GameInfoData {
  id: string;
  countCards: number;
  userId: string;
}
