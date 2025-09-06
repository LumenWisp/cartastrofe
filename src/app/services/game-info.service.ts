import { inject, Injectable } from '@angular/core';
import { GameInfo, GameInfoData } from '../types/game-info';
import { UserService } from './user-service.service';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { collection, doc, Firestore, getCountFromServer, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class GameInfoService {
  private firestore = inject(Firestore);
  private pathGameInfo = FirestoreTablesEnum.GAME_INFO

  constructor(
    private userService: UserService,
    private utilsService: UtilsService
  ) {}

  /**
   * Pega os gameInfos do usuário logado.
   */
  async getGameInfos() {
    const user = this.userService.currentUser()

    if (user === undefined) return []

    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userID;
    const refCollection = collection(this.firestore, this.pathGameInfo);
    const queryRef = query(refCollection, where('userId', '==', userId));
    const snapshot = await getDocs(queryRef)
    const results: GameInfo[] = [];
    snapshot.forEach((item) => {
      results.push(item.data() as GameInfo)
    })


    return results;
  }

  /**
   * Adiciona um gameInfo aos gameInfos do usuário logado.
   * @param gameInfoData informações do jogo
   */
  async addGameInfo(gameInfo: GameInfoData) {
    const user = this.userService.currentUser()

    if (!user) throw new Error('Usuário não está logado');

    const userId = user.userID;

    const id = await this.utilsService.generateKey()

    const gameInfoObject: GameInfo = {
      ...gameInfo,
      id,
      userId,
      countCards: 0,
    }

    await setDoc(doc(this.firestore, this.pathGameInfo, id), gameInfoObject);

    return gameInfoObject;
  }

  /**
   * Atualiza o gameInfo especificado pelo id.
   * @param id id do gameInfo
   * @param item informações do gameInfo que serão atualizadas
   */
  async updateGameInfo(id: string, item: Partial<GameInfo>): Promise<void> {
    if (!id) {
      throw new Error('ID do jogo é obrigatório.');
    }

    const ref = doc(this.firestore, this.pathGameInfo, id);

    const updatedData = {
      ...item,
    };

    await setDoc(ref, updatedData, { merge: true });
  }
}
