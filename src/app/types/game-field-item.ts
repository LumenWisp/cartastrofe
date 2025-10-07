import { GameFieldItemEnum } from "../enum/game-field-item.enum";
import { CardGame } from "../types/card"
export interface GameFieldItem {
    type: GameFieldItemEnum,
    position: {x: number, y: number},
    nameIdentifier: string,
    
    // Se type for = a pile
    cardIds?: string[] // ids apenas
}