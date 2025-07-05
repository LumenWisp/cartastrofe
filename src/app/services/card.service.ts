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
  getCards(): Card[] {
    return this.cardsSubject.value;
  }

  getCardNextID(): number {
    return this.cardIDGenerator++;
  }

  // Adiciona um novo Card
  addCard(card: Card): void {
    const current = this.cardsSubject.value;
    this.cardsSubject.next([...current, card]);
  }

  // Remove Card por ID
  removeCard(id: number): void {
    const current = [...this.cardsSubject.value];
    const index = current.findIndex(card => card.id === id);

    if (index !== -1) {
        current.splice(index, 1);
        this.cardsSubject.next(current);
      }
  }

  // Atualiza Card por ID
  updateCardByID(id: number, updated: Card): void {
    const current = [...this.cardsSubject.value];
    const index = current.findIndex(card => card.id === id);

    if (index !== -1) {
      current[index] = updated;
      this.cardsSubject.next(current);
    }
  }

  // Busca todos os Cards com base no gameID
  getCardsByGameID(gameID: number): Card[] {
    return this.cardsSubject.value.filter(card => card.gameID === gameID);
  }
}
