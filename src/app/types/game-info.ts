import { GameModesEnum } from '../enum/game-modes.enum';
import { GameFieldItem } from './game-field-item';
export interface GameInfoData {
  name: string;
  description: string;
  gameMode: GameModesEnum;
  countPlayersMin: number;
  countPlayersMax: number;
}

export interface GameInfoModel extends GameInfoData {
  id: string;
  countCards: number;
  userId: string;
  cardLayoutIds?: string[];
  cardIds?: string[];
  fieldItems?: GameFieldItem[];

  // ===============================================================
  // Campos que representam o estado do workSpace das regras do jogo
  // ===============================================================

  // Triggers
  onGameStart?: any;
  onMoveCardFromTo?: any;
  onPhaseStart?: any;
  onPhaseEnd?: any;
  winCondition?: any;

  // ===============================================================
  // Campos que representam o código em string das regras do jogo
  // ===============================================================

  // Triggers
  onGameStartCode?: string;
  onMoveCardFromToCode?: string;
  onPhaseStartCode?: string;
  onPhaseEndCode?: string;
  winConditionCode?: string;
}
