import { Injectable } from '@angular/core';
import { CardLayout } from '../types/card-layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserService } from './user-service.service';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CardLayoutService {
  // chaves para acessar o localstorage (futuramente serão removidas quando o sistema estiver usando um banco de dados)
  static readonly CARD_LAYOUT = 'cardLayout_games';
  static readonly CARD_LAYOUT_ID = 'cardLayout_id';

  private cardLayoutsSubject = new BehaviorSubject<CardLayout[]>([]);
  readonly cardLayouts$: Observable<CardLayout[]> = this.cardLayoutsSubject.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  /**
   * Pega os cardLayouts do usuário logado.
   */
  fetchCardLayouts() {
    const userLogged = this.userService.getUserLogged();
    if (!userLogged) return;

    const cardLayoutsValue = this.localStorageService.get(CardLayoutService.CARD_LAYOUT)
    if (cardLayoutsValue === undefined) return;

    const cardLayouts = (cardLayoutsValue as CardLayout[]).filter((gameInfo) => gameInfo.userId === userLogged.id)
    this.cardLayoutsSubject.next(cardLayouts);
  }

  /**
   * Retorna o total de cardLayouts do usuário logado.
   */
  get totalCardLayouts() {
    return this.cardLayoutsSubject.value.length;
  }
}
