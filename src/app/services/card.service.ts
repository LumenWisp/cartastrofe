import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Card } from '../types/card';
import { Firestore, collection, query, where, getDocs } from '@angular/fire/firestore';
import { UserService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  cards$: Observable<Card[]> = this.cardsSubject.asObservable();
  private cardIDGenerator = 1;
  private firestore = inject(Firestore);
  private userService = inject(UserService);

  constructor() {}

  // Retorna a lista atual
  async getCards() {
    const user = this.userService.currentUser();
    if (!user) {
      this.cardsSubject.next([]);
      return;
    }
    const cardsRef = collection(this.firestore, 'card');
    const q = query(cardsRef, where('userId', '==', user.userID));
    const querySnapshot = await getDocs(q);
    const cards: Card[] = [];
    querySnapshot.forEach((doc) => {
      cards.push(doc.data() as Card);
    });
    this.cardsSubject.next(cards);
  }

  getCardNextID() {

  }

  // Adiciona um novo Card
  addCard(card: Card): void {

  }

  // Remove Card por ID
  removeCard(id: number) {

  }

  // Atualiza Card por ID
  updateCardByID(id: number, updated: Card) {

  }

  // Busca todos os Cards com base no gameID
  getCardsByGameID(gameID: number) {

  }
}
