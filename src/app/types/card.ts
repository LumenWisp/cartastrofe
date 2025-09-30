import { CardFieldModel } from "../types/card-field";
import { CardLayout } from "./card-layout";


// DEIXEI ALGUNS CAMPOS COMO OPCIONAL PARA TESTES NO MODO LIVRE, REMOVER DEPOIS!!
/** @deprecated criar um novo modelo */
export interface CardGame {
  id: string,
  cardLayoutId: string,
  name: string,
  data: { [property: string]: string; }

  // Modo livre
  label?: string,
  flipped?: boolean,
  pileId: string | null,
  zIndex: number,
  freeDragPos: {x: number, y: number},
}

export interface CardModel {
  id: string,
  layoutId: string,
  userId: string,
  name: string,
  data: { [property: string]: string; }
}
