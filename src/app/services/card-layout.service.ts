import { inject, Injectable } from '@angular/core';
import { CardLayout, CardLayoutModel } from '../types/card-layout';
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
  addDoc,
  getDoc,
} from '@angular/fire/firestore';
import { UserService } from './user-service.service';
import { CardLayoutField } from '../types/card-layout-field';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class CardLayoutService {
  private firestore = inject(Firestore);

  cardLayoutpath = FirestoreTablesEnum.CARD_LAYOUT;
  userpath = FirestoreTablesEnum.USER;

  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
  ) {}

  /**
   * Pega os cardLayouts do usuário logado.
   */
  async getCardLayouts() {
    const user = this.userService.currentUser()

    if (user === undefined) return []

    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userID;

    const refCollection = collection(this.firestore, this.cardLayoutpath);
    const queryRef = query(refCollection, where('userId', '==', userId));

    const snapshot = await getDocs(queryRef);
    const cardLayouts: CardLayoutModel[] = [];

    snapshot.forEach((item) => {
      cardLayouts.push(item.data() as CardLayoutModel);
    });

    return cardLayouts;
  }

  async getCardLayoutById(id: string) {
    const user = this.userService.currentUser()

    if (user === undefined) return null

    if (user === null) throw new Error('Usuário não está logado');

    const docRef = doc(this.firestore, this.cardLayoutpath, id)
    const docSnapshot = await getDoc(docRef);
    const cardLayoutModel: CardLayoutModel = docSnapshot.data() as CardLayoutModel;

    return cardLayoutModel;
  }

  /**
   * Salva um cardLayout com id gerado pelo firebase
   */

  async saveCardLayout(id: string, cardLayout: CardLayout) {
    const user = this.userService.currentUser()

    if (user === undefined) return null

    if (user === null) throw new Error('Usuário não está logado');

    const docRef = doc(this.firestore, this.cardLayoutpath, id)
    await setDoc(docRef, cardLayout, { merge: true });

    const idUser = user.userID;
    await this.addCardLayoutToUser(docRef.id, idUser);

    const docSnapshot = await getDoc(docRef);
    const cardLayoutModel: CardLayoutModel = docSnapshot.data() as CardLayoutModel;

    return cardLayoutModel;
  }

  async createCardLayout(cardLayoutName: string) {
    const user = this.userService.currentUser()

    if (!user) throw new Error('Usuário não está logado');

    const userId = user.userID;

    const cardLayoutsRef = collection(this.firestore, this.cardLayoutpath);

    const id = await this.utilsService.generateKey()


    const data: CardLayoutModel = {
      id,
      cardFields: [],
      name: cardLayoutName,
      userId,
    }

    await addDoc(cardLayoutsRef, data)

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
