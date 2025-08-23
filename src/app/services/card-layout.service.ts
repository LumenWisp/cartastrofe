import { inject, Injectable } from '@angular/core';
import { CardLayoutModel } from '../types/card-layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';

import {
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
  arrayUnion,
} from '@angular/fire/firestore';
import { CardLayoutFieldModel } from '../types/card-layout-field';

@Injectable({
  providedIn: 'root',
})
export class CardLayoutService {

  private cardLayoutsSubject = new BehaviorSubject<CardLayoutModel[]>([]);
  readonly cardLayouts$: Observable<CardLayoutModel[]> =
    this.cardLayoutsSubject.asObservable();
  private firestore = inject(Firestore);

  cardLayoutpath = FirestoreTablesEnum.CARD_LAYOUT;
  userpath = FirestoreTablesEnum.USER;

  /**
   * Pega os cardLayouts do usuário logado.
   */
  async fetchCardLayouts(userId: string) {
    const refCollection = collection(this.firestore, this.cardLayoutpath);
    const queryRef = query(refCollection, where('userId', '==', userId));

    const snapshot = await getDocs(queryRef);
    const cardLayouts: CardLayoutModel[] = [];

    snapshot.forEach((item) => {
      cardLayouts.push(item.data() as CardLayoutModel);
    });

    return cardLayouts;
  }

  /**
   * Salva um cardLayout com id gerado pelo firebase
   */

  async saveCardLayout(cardFields: CardLayoutFieldModel[]) {
    const cardLayoutsRef = collection(this.firestore, this.cardLayoutpath);

    const cardLayout: CardLayoutModel = {
      cardFields,
      name: '21',
      userId: 'NEkPe1V5PDccYzJFyNWSrrUKukS2',
    }

    const newCardLayoutRef = doc(cardLayoutsRef);

    const CardLayoutObject: CardLayoutModel = {
      ...cardLayout,
      id: newCardLayoutRef.id,
    };

    await setDoc(newCardLayoutRef, CardLayoutObject);


    const idUser = cardLayout.userId;
    await this.addCardLayoutToUser(newCardLayoutRef.id, idUser);

  }

  /**
   * Adiciona cardLayout à lista de cardLayouts do usuário
   */
  async addCardLayoutToUser(cardLayoutId: string, idUser: string) {
    const userRef = doc(this.firestore, this.userpath, idUser);

    await updateDoc(userRef, {
    cardLayouts: arrayUnion(cardLayoutId)
  });
  }

  /**
   * Retorna o total de cardLayouts do usuário logado.
   */
  get totalCardLayouts() {
    return 10; // para manter algumas funcionalidades operando normalmente, mas deve ser removida posteriormente
  }
}
