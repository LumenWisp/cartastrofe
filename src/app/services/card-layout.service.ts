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
  deleteDoc,
} from '@angular/fire/firestore';
import { UserService } from './user-service.service';
import { CardLayoutField } from '../types/card-layout-field';
import { UtilsService } from './utils.service';
import { GameInfoModel } from '../types/game-info';
import { CardService } from './card.service';

@Injectable({
  providedIn: 'root',
})
export class CardLayoutService {
  private firestore = inject(Firestore);

  cardLayoutpath = FirestoreTablesEnum.CARD_LAYOUT;
  userpath = FirestoreTablesEnum.USER;
  private pathGameInfo = FirestoreTablesEnum.GAME_INFO;

  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
    private cardService: CardService
  ) {}

  /**
   * Pega os cardLayouts do usuário logado.
   */
  async getCardLayouts() {
    const user = await this.userService.currentUser()

    if (user === undefined) return []

    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userId;

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
    const refCollection = collection(this.firestore, this.cardLayoutpath);
    const queryRef = query(refCollection, where('id', '==', id));
    const docSnapshot = await getDocs(queryRef);
    const cardLayoutModel: CardLayoutModel = docSnapshot.docs[0].data() as CardLayoutModel;

    return cardLayoutModel;
  }

  /**
   * Salva um cardLayout com id gerado pelo firebase
   */

  async saveCardLayout(id: string, cardLayout: CardLayout) {
    const user = await this.userService.currentUser()

    if (user === undefined) return null

    if (user === null) throw new Error('Usuário não está logado');

    const refCollection = collection(this.firestore, this.cardLayoutpath);
    const queryRef = query(refCollection, where('userId', '==', user.userId), where('id', '==', id));
    const docSnapshot = await getDocs(queryRef);

    const docSnap = docSnapshot.docs[0];
    const docRef = docSnap.ref;

    await setDoc(docRef, cardLayout, { merge: true });

    const idUser = user.userId;
    await this.addCardLayoutToUser(docRef.id, idUser);

    const cardLayoutModel: CardLayoutModel = docSnap.data() as CardLayoutModel;

    return cardLayoutModel;
  }

  async createCardLayout(cardLayoutName: string) {
    const user = await this.userService.currentUser()

    if (!user) throw new Error('Usuário não está logado');

    const userId = user.userId;

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

  async deleteCardLayout(id: string) {
    const gameInfos = await this.getGameInfos()

    if (gameInfos.some(game => game.cardLayoutIds?.includes(id))) throw new Error('Este layout pertence a um jogo')

    const cards = await this.cardService.getCardsByLayoutId(id)

    if (cards.length) throw new Error('Este layout tem cartas associadas')

    const collectionRef = collection(this.firestore, this.cardLayoutpath);
    const q = query(collectionRef, where('id', '==', id));

    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('CardLayout não encontrado');

    const cardLayoutDoc = snapshot.docs[0];
    const ref = doc(this.firestore, this.cardLayoutpath, cardLayoutDoc.id);
    await deleteDoc(ref);
  }

  // copiado do gameInfo, pq dava dependência circular
    async getGameInfos() {
      const user = await this.userService.currentUser();

      if (user === undefined) return []
      if (user === null) throw new Error('Usuário não está logado');

      const userId = user.userId;
      const refCollection = collection(this.firestore, this.pathGameInfo);
      const queryRef = query(refCollection, where('userId', '==', userId));
      const snapshot = await getDocs(queryRef);
      const results: GameInfoModel[] = [];
      snapshot.forEach((item) => {
        results.push(item.data() as GameInfoModel);
      });

      return results;
    }
}
