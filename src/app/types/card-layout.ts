import { CardLayoutFieldModel } from './card-layout-field';

export interface CardLayoutModel {
  id?: string;
  userId: string;
  name: string;
  //createdAt: Date;
  cardFields: CardLayoutFieldModel[];
}
