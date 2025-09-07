import { CardGameField, CardLayoutField } from './card-layout-field';

export interface CardLayoutModel extends CardLayout {
  id: string;
  userId: string;
}

export interface CardLayout {
  name: string;
  cardFields: CardLayoutField[];
}

export interface CardGameLayout {
  name: string;
  cardFields: CardGameField[];
}
