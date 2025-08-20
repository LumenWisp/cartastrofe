import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CardModel } from '../types/card';
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

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject = new BehaviorSubject<CardModel[]>([]);
  cards$: Observable<CardModel[]> = this.cardsSubject.asObservable();
  private firestore = inject(Firestore);
  private cardIDGenerator = 1;

  cardpath = FirestoreTablesEnum.CARD;
  userpath = FirestoreTablesEnum.USER;

  // Retorna a lista atual
  async getCards(userId: string) {
    const refCollection = collection(this.firestore, this.cardpath);
    const queryRef = query(refCollection, where('userId', '==', userId));
    
    const snapshot = await getDocs(queryRef);
    const cards: CardModel[] = [];

    snapshot.forEach((item) => {
      cards.push(item.data() as CardModel);
    });

    return cards;
  }

  getCardNextID() {

  }

  // Adiciona um novo Card
  addCard(card: CardModel): void {
    
  }

  // Remove Card por ID
  removeCard(id: number) {

  }

  // Atualiza Card por ID
  updateCardByID(id: number, updated: CardModel) {

  }

  // Busca todos os Cards com base no gameID
  getCardsByGameID(gameID: number) {

  }
}
