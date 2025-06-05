import { Injectable } from '@angular/core';
import { CardLayout } from '../types/card-layout';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardLayoutService {
  private cardLayoutsSubject = new BehaviorSubject<CardLayout[]>([]);
  cardLayouts$: Observable<CardLayout[]> = this.cardLayoutsSubject.asObservable();
  private cardLayoutIDGenerator = 1;

  constructor() {}

  // Retorna a lista atual
  getCardLayouts(): CardLayout[] {
    return this.cardLayoutsSubject.value;
  }

  getCardLayoutNextID(): number {
    return this.cardLayoutIDGenerator++;
  }

  // Adiciona um novo CardLayout
  addCardLayout(cardLayout: CardLayout): void {
    const current = this.cardLayoutsSubject.value;
    this.cardLayoutsSubject.next([...current, cardLayout]);
  }

  // Remove CardLayout por ID
  removeCardLayout(id: number): void {
    const current = [...this.cardLayoutsSubject.value];
    const index = current.findIndex(layout => layout.id === id);

    if (index !== -1) {
      current.splice(index, 1);
      this.cardLayoutsSubject.next(current);
    }
  }

  // Atualiza CardLayout por ID
  updateCardLayoutByID(id: number, updated: CardLayout): void {
    const current = [...this.cardLayoutsSubject.value];
    const index = current.findIndex(layout => layout.id === id);

    if (index !== -1) {
      current[index] = updated;
      this.cardLayoutsSubject.next(current);
    }
  }
}
