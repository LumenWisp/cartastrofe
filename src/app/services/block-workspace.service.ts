import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BlockWorkspaceService {

  constructor() {}

  //valores padrões para triggers
  public readonly onGameStartDefault: any = {
    blocks: {
      blocks: [
        {
          id: 'default_block_onGameStart',
          type: 'onGameStart',
          x: 220,
          y: 39,
        },
      ],
      languageVersion: 0,
    },
  };

  public readonly onMoveCardFromToDefault: any = {
    blocks: {
      blocks: [
        {
          id: 'default_block_onMoveCardFromTo',
          type: 'onMoveCardFromTo',
          x: 220,
          y: 39,
        },
      ],
      languageVersion: 0,
    },
  };

  public readonly cardOnMoveCardFromToDefault: any = {
    blocks: {
      blocks: [
        {
          id: 'default_block_cardOnMoveCardFromTo',
          type: 'cardOnMoveCardFromTo',
          x: 220,
          y: 39,
        },
      ],
      languageVersion: 0,
    },
  };

  public readonly onPhaseStartDefault: any = {
    blocks: {
      blocks: [
        {
          id: 'default_block_onPhaseStartDefault',
          type: 'onPhaseStart',
          x: 220,
          y: 39,
        },
      ],
      languageVersion: 0,
    },
  };

  public readonly onPhaseEndDefault: any = {
    blocks: {
      blocks: [
        {
          id: 'default_block_onPhaseEndDefault',
          type: 'onPhaseEnded',
          x: 220,
          y: 39,
        },
      ],
      languageVersion: 0,
    },
  };

  public readonly winConditionDefault: any = {
    blocks: {
      blocks: [
        {
          id: 'default_block_winCondition',
          type: 'winCondition',
          x: 220,
          y: 39,
        },
      ],
      languageVersion: 0,
    },
  };

}
