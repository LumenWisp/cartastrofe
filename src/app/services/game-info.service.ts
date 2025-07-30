import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, Observable, retry, switchMap, take } from 'rxjs';
import { GameInfo } from '../types/game-info';
import { UserService } from './user-service.service';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { collection, doc, Firestore, getCountFromServer, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';


@Injectable({
  providedIn: 'root',
})
export class GameInfoService {
  private firestore = inject(Firestore);
  pathGameInfo = FirestoreTablesEnum.GAME_INFO

  constructor(
    private userService: UserService,
    private utilsService: UtilsService
  ) {}

  /**
   * Pega os gameInfos do usuário logado.
   */
  getGameInfos() {
    return this.userService.currentUser$.pipe(
      switchMap(async (user) => {
        if (!user) return [];

        const userId = user.userID;

        const refCollection = collection(this.firestore, this.pathGameInfo);
        const queryRef = query(refCollection, where('userId', '==', userId));

        const snapshot = await getDocs(queryRef)
        const results: GameInfo[] = []

        snapshot.forEach((item) => {
          results.push(item.data() as GameInfo)
        })

        return results;
      })
    );
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
  getTotalGameInfos(): number {
    return 0;
  }

  /**
   * Adiciona um gameInfo aos gameInfos do usuário logado.
   * @param gameInfoData informações do jogo
   */
  async addGameInfo(gameInfo: GameInfo) {

    const id = await this.utilsService.generateKey()

    const gameInfoObject = {
        id: id,
        name: gameInfo.name,
        description: gameInfo.description,
        title: gameInfo.title,
        countPlayersMin: gameInfo.countPlayersMin,
        countPlayersMax: gameInfo.countPlayersMax,
        countCards: gameInfo.countCards,
        userId: gameInfo.userId
        }

    await setDoc(doc(this.firestore, this.pathGameInfo, id), gameInfoObject);
  }
}
