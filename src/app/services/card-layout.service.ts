import { Injectable } from '@angular/core';
import { CardLayout } from '../types/card-layout';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CardLayoutService {

  private cardLayoutsSubject = new BehaviorSubject<CardLayout[]>([]);
  readonly cardLayouts$: Observable<CardLayout[]> = this.cardLayoutsSubject.asObservable();

  /**
   * Pega os cardLayouts do usuário logado.
   */
  fetchCardLayouts() {
  }

  /**
   * Retorna o total de cardLayouts do usuário logado.
   */
  get totalCardLayouts() {
    return 10; // para manter algumas funcionalidades operando normalmente, mas deve ser removida posteriormente
  }
}
