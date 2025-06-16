import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameInfo } from '../types/game-info';
import { LocalStorageService } from './local-storage.service';
import { UserService } from './user-service.service';

/**
 * Serviço para gerenciar os jogos do usuário logado
 *
 * Esta implementação usa o localstorage como armazenamento para:
 * - jogos
 * - gerador do próximo id de jogo
 *
 * Futuramente será trocado para um banco de dados.
 *
 * OBS.: Não utiliza dados em memória, uma vez que são voláteis e resetam quando o serviço
 * é reutilizado (por exemplo, tentar acessar uma rota manualmente faz resetar os dados).
 */
@Injectable({
  providedIn: 'root',
})
export class GameInfoService {
  // chaves para acessar o localstorage (futuramente serão removidas quando o sistema estiver usando um banco de dados)
  static readonly GAMES = 'gamesInfo_games';
  static readonly GAMES_ID = 'gamesInfo_id';

  private gameInfosSubject = new BehaviorSubject<GameInfo[]>([]);
  readonly gameInfos$: Observable<GameInfo[]> = this.gameInfosSubject.asObservable();

  constructor(
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  /**
   * Pega os gameInfos do usuário logado.
   */
  fetchGameInfos(): void {
    const userLogged = this.userService.getUserLogged();
    if (!userLogged) return;

    const gameInfosValue = this.localStorageService.get(GameInfoService.GAMES)
    if (gameInfosValue === undefined) return;

    const gameInfos = (gameInfosValue as GameInfo[]).filter((gameInfo) => gameInfo.userId === userLogged.id)
    this.gameInfosSubject.next(gameInfos);
  }

  /**
   * Retorna o total de gameInfos do usuário logado.
   */
  get totalGameInfos(): number {
    return this.gameInfosSubject.value.length;
  }

  /**
   * Adiciona um gameInfo aos gameInfos do usuário logado.
   * @param gameInfoData informações do jogo
   */
  addGameInfo(gameInfoData: Omit<GameInfo, 'id' | 'userId'>): void {
    const userLogged = this.userService.getUserLogged();

    if (!userLogged) return;

    const gameInfo: GameInfo = {
      ...gameInfoData,
      id: this.localStorageService.autoIncrement(GameInfoService.GAMES_ID),
      userId: userLogged.id,
    };

    this.gameInfosSubject.next([...this.gameInfosSubject.value, gameInfo]);
    this.localStorageService.set(GameInfoService.GAMES, this.gameInfosSubject.value);
  }
}
