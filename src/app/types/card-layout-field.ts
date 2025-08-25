import { CardFieldTypesEnum } from "../enum/card-field-types.enum";

export interface CardLayoutFieldModel {
  //idName: string;
  type: CardFieldTypesEnum;
  x: number; // Distância do lado esquerdo do campo até o lado esquerdo do layout
  y: number; // Distância do topo do campo até o topo do layout
  width: number;
  height: number;
  property: string;
}

export interface CardLayoutFieldValue extends CardLayoutFieldModel {
  value: string;
}

export type CardLayoutFieldDimensions = {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}
