import { CardFieldModel } from "../types/card-field";
import { CardLayout } from "./card-layout";


// DEIXEI ALGUNS CAMPOS COMO OPCIONAL PARA TESTES NO MODO LIVRE, REMOVER DEPOIS!!
/** @deprecated criar um novo modelo */
export interface CardGame {
    id?: string,
    templateId?: string,
    gameID?: number,
    name?: string,
    fieldContents?: CardFieldModel[],

    // Modo livre
    label?: string,
    flipped?: boolean,
    pileId?: string,
    zIndex: number,
    freeDragPos: {x: number, y: number},
}

/** @deprecated criar um novo modelo */
export interface CardModel {
  id: string,
  layoutId: string,
  name: string,
  fields: CardField[],
}

/** @deprecated criar um novo modelo */
export interface CardField {
  property: string,
  value: string,
}



export interface Card {
  layout: CardLayout;
  data: { [property: string]: string; }
}
