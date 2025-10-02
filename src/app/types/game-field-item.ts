import { GameFieldItemEnum } from "../enum/game-field-item.enum";
export interface GameFieldItem {
    type: GameFieldItemEnum,
    position: {x: number, y: number},
    nameIdentifier: string,
}