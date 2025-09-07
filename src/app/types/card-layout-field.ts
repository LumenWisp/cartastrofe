import { CardFieldTypesEnum } from "../enum/card-field-types.enum";

export type CardFieldDimensions = {
  minWidth: number;
  maxWidth: number;
  minHeight: number;
  maxHeight: number;
}

export interface CardFieldBase {
  type: CardFieldTypesEnum;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CardLayoutField extends CardFieldBase {
  property: string;
}

export interface CardGameField extends CardFieldBase {
  value: string;
}
