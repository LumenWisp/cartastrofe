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

  // Substitui a lista inteira
  setGameInfos(gameInfos: GameInfo[]): void {
    this.gameInfosSubject.next(gameInfos);
  }

  // Adiciona um novo GameInfo
  addGameInfo(gameInfo: GameInfo): void {
    const current = this.gameInfosSubject.value;
    this.gameInfosSubject.next([...current, gameInfo]);
  }

  // Remove GameInfo por índice
  removeGameInfo(index: number): void {
    const current = [...this.gameInfosSubject.value];
    if (index >= 0 && index < current.length) {
      current.splice(index, 1);
      this.gameInfosSubject.next(current);
    }
  }

  // Atualiza GameInfo por índice
  updateGameInfo(index: number, updated: GameInfo): void {
    const current = [...this.gameInfosSubject.value];
    if (index >= 0 && index < current.length) {
      current[index] = updated;
      this.gameInfosSubject.next(current);
    }
  }

  // Busca todos os GameInfo com base no userID
  getGameInfosByUserID(userID: number): GameInfo[] {
    return this.gameInfosSubject.value.filter(game => game.userID === userID);
  }
}