import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Card } from '../types/card';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private cardsSubject = new BehaviorSubject<Card[]>([]);
  cards$: Observable<Card[]> = this.cardsSubject.asObservable();
  private cardIDGenerator = 1;

  constructor() {}

  // Retorna a lista atual
  getCards() {

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
