import { CardFieldTypesEnum } from "../enum/card-field-types.enum";

export interface CardLayoutFieldModel {
  id?: string;
  idCardTemplate?: string;
  //idName: string;
  type: CardFieldTypesEnum;
  x: number;
  y: number;
  width: number;
  height: number;
}
