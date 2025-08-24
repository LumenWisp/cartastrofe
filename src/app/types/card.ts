import { CardFieldModel } from "../types/card-field";
import { CardLayoutFieldValue } from "./card-layout-field";

// DEIXEI ALGUNS CAMPOS COMO OPCIONAL PARA TESTES NO MODO LIVRE, REMOVER DEPOIS!!
export interface CardGame {
    id?: string,
    templateId?: string,
    gameID?: number,
    name?: string,
    fieldContents?: CardFieldModel[],

    // Modo livre
    label?: string,
    flipped?: boolean,
    pileId?: string
}

export interface CardModel {
  id: string,
  layoutId: string,
  name: string,
  fields: CardField[],
}

export interface CardField {
  property: string,
  value: string,
}

export interface Card {
  name: string,
  fields: CardLayoutFieldValue[],
}
