import { CardFieldModel } from "../types/card-field";
export interface CardModel {
    id?: number,
    templateId: string,
    gameID: number,
    name: string,
    fieldContents: CardFieldModel[],
}