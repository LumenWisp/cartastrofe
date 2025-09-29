import { inject, Injectable } from '@angular/core';
import { CardModel } from '../types/card';
import { CardGameLayout, CardLayoutModel } from '../types/card-layout';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { addDoc, collection, doc, Firestore, getDocs, query, where } from '@angular/fire/firestore';
import { UserService } from './user-service.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private firestore = inject(Firestore);
  private path = FirestoreTablesEnum.CARD;

  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
  ) {}

  async getCardById(id: string): Promise<CardModel | null> {
    const collectionRef = collection(this.firestore, this.path);
    const q = query(collectionRef, where('id', '==', id));
    const snapshot = await getDocs(q);
    const cards = snapshot.docs.map(doc => doc.data() as CardModel) || [];
    return cards.length > 0 ? cards[0] : null;
  }

  async getCardsByLayoutId(cardLayoutId: string): Promise<CardModel[]> {
    const collectionRef = collection(this.firestore, this.path);
    const q = query(collectionRef, where('layoutId', '==', cardLayoutId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as CardModel) || [];
  }

  async saveCard(cardName: string, card: CardGameLayout, cardLayout: CardLayoutModel) {
    const user = await this.userService.currentUser()

    if (user === undefined) return
    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userId;

    const collectionRef = collection(this.firestore, this.path)

    const id = await this.utilsService.generateKey()

    const data: CardModel = {
      id,
      userId,
      layoutId: cardLayout.id,
      name: cardName,
      data: card.cardFields.reduce((acc, field) => {
        acc[field.property] = field.value;
        return acc;
      }, {} as { [property: string]: string })
    }

    await addDoc(collectionRef, data)
  }
}
