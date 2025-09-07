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
  
  // ===============================================================
  // Campos que representam o estado do workSpace das regras do jogo
  // ===============================================================

  // Triggers
  onGameStart?: any;
  onMoveCardFromTo?: any;
  onPhaseStart?: any;
  onPhaseEnd?: any;
  winCondition?: any;
}
