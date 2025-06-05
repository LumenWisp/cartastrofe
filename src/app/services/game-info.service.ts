import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameInfo } from '../types/game-info'; 

@Injectable({
  providedIn: 'root'
})
export class GameInfoService {
  private gameInfosSubject = new BehaviorSubject<GameInfo[]>([]);
  gameInfos$: Observable<GameInfo[]> = this.gameInfosSubject.asObservable();
  private gameInfoIDGenerator = 1;

  constructor() {}

  // Retorna a lista atual
  getGameInfos(): GameInfo[] {
    return this.gameInfosSubject.value;
  }

  getGameInfoNextID(){
    return this.gameInfoIDGenerator++;
  }

  // Adiciona um novo GameInfo
  addGameInfo(gameInfo: GameInfo): void {
    const current = this.gameInfosSubject.value;
    this.gameInfosSubject.next([...current, gameInfo]);
  }

  // Remove GameInfo por ID
  removeGameInfo(id: number): void {
    const current = [...this.gameInfosSubject.value];
    const index = current.findIndex(game => game.id === id);

    if (index !== -1) {
        current.splice(index, 1);
        this.gameInfosSubject.next(current);
      }
  }

  // Busca todos os GameInfo com base no userID
  getGameInfosByUserID(userID: number): GameInfo[] {
    return this.gameInfosSubject.value.filter(game => game.userID === userID);
  }
}