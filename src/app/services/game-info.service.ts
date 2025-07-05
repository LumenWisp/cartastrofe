import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameInfo } from '../types/game-info';
import { UserService } from './user-service.service';


@Injectable({
  providedIn: 'root',
})
export class GameInfoService {
  private gameInfosSubject = new BehaviorSubject<GameInfo[]>([]);
  readonly gameInfos$: Observable<GameInfo[]> = this.gameInfosSubject.asObservable();

  constructor() {}

  /**
   * Pega os gameInfos do usuário logado.
   */
  getGameInfos() {

  }

  /**
   * Pega o gameInfo cujo `id === gameId`.
   * @param gameId id do gameInfo
   */
  getGameInfoById(gameId: number) {

  }

  /**
   * Retorna o total de gameInfos do usuário logado.
   */
  get totalGameInfos(): number {
    return 10; // para manter algumas funcionalidades operando normalmente, mas deve ser removida posteriormente
  }

  /**
   * Adiciona um gameInfo aos gameInfos do usuário logado.
   * @param gameInfoData informações do jogo
   */
  addGameInfo(gameInfoData: Omit<GameInfo, 'id' | 'userId'>) {

  }
}
