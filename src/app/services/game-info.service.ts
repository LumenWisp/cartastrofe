import { inject, Injectable } from '@angular/core';
import { GameInfoModel, GameInfoData } from '../types/game-info';
import { UserService } from './user-service.service';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getCountFromServer,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { Auth, getAuth, user } from '@angular/fire/auth';
import { CardLayoutService } from './card-layout.service';
import { CardService } from './card.service';
import { BlockWorkspaceService } from './block-workspace.service';
import { GameModesEnum } from '../enum/game-modes.enum';

@Injectable({
  providedIn: 'root',
})
export class GameInfoService {
  private firestore = inject(Firestore);
  private pathGameInfo = FirestoreTablesEnum.GAME_INFO;

  constructor(
    private userService: UserService,
    private utilsService: UtilsService,
    private cardLayoutService: CardLayoutService,
    private cardService: CardService,
    private blockWorkspaceService: BlockWorkspaceService
  ) {}


  /**
   * Pega os gameInfos do usuário logado.
   */
  async getGameInfos() {
    const user = await this.userService.currentUser();

    if (user === undefined) return []
    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userId;
    const refCollection = collection(this.firestore, this.pathGameInfo);
    const queryRef = query(refCollection, where('userId', '==', userId));
    const snapshot = await getDocs(queryRef);
    const results: GameInfoModel[] = [];
    snapshot.forEach((item) => {
      results.push(item.data() as GameInfoModel);
    });

    return results;
  }

async getGameInfosPlayable() {
  const user = await this.userService.currentUser();

  if (user === undefined) return [];
  if (user === null) throw new Error('Usuário não está logado');

  const userId = user.userId;
  const refCollection = collection(this.firestore, this.pathGameInfo);
  const queryRef = query(refCollection, where('userId', '==', userId));
  const snapshot = await getDocs(queryRef);
  const results: GameInfoModel[] = [];

  snapshot.forEach((item) => {
    // Access the data and check for the property
    const data = item.data() as GameInfoModel;
    if (data.cardLayoutId !== undefined) {
      results.push(data);
    }
  });

  return results;
}

  async getGameInfoById(id: string) {
    const user = await this.userService.currentUser()

    if (user === undefined) return null
    if (user === null) throw new Error('Usuário não está logado');

    const userId = user.userId;
    const refCollection = collection(this.firestore, this.pathGameInfo);
    const queryRef = query(refCollection, where('userId', '==', userId), where('id', '==', id));
    const snapshot = await getDocs(queryRef);
    const gameInfo = snapshot.docs[0]?.data() as GameInfoModel;

    return gameInfo;
  }

  async getCardLayout(id: string) {
    const gameInfo = await this.getGameInfoById(id);

    if (!gameInfo) throw new Error('GameInfo não encontrado');
    if (!gameInfo.cardLayoutId) throw new Error('GameInfo não possui cardLayoutId');

    const cardLayout = await this.cardLayoutService.getCardLayoutById(gameInfo.cardLayoutId);
    if (!cardLayout) throw new Error('CardLayout não encontrado');

    return cardLayout;
  }

  async getCards(id: string) {
    const cardLayout = await this.getCardLayout(id);
    if (!cardLayout) throw new Error('CardLayout não encontrado');
    const cards = await this.cardService.getCardsByLayoutId(cardLayout.id);
    return cards;
  }

  /**
   * Adiciona um gameInfo aos gameInfos do usuário logado.
   * @param gameInfoData informações do jogo
   */
  async addGameInfo(gameInfo: GameInfoData) {
    const user = await this.userService.currentUser();

    if (!user) throw new Error('Usuário não está logado');

    const userId = user.userId;

    const id = await this.utilsService.generateKey();

    let gameInfoObject: GameInfoModel = {
      ...gameInfo,
      id,
      userId,
      countCards: 0,
    };

    // Verificar se é um jogo estruturado para adicionar o workspace das regras
    if (gameInfo.gameMode === GameModesEnum.STRUCTURED) {
      gameInfoObject = {
        ...gameInfoObject,
        onGameStart: this.blockWorkspaceService.onGameStartDefault,
        onMoveCardFromTo: this.blockWorkspaceService.onMoveCardFromToDefault,
        onPhaseStart: this.blockWorkspaceService.onPhaseStartDefault,
        onPhaseEnd: this.blockWorkspaceService.onPhaseEndDefault,
        winCondition: this.blockWorkspaceService.winConditionDefault,
      };
    }

    await setDoc(doc(this.firestore, this.pathGameInfo, id), gameInfoObject);

    return gameInfoObject;
  }

  /**
   * Atualiza um gameInfo existente.
   * @param id ID do gameInfo
   * @param data Dados para atualizar
   */
  async updateGameInfo(id: string, data: Partial<GameInfoModel>) {
    const user = this.userService.currentUser();
    if (!user) throw new Error('Usuário não está logado');
    const docRef = doc(this.firestore, this.pathGameInfo, id);
    await setDoc(docRef, data, { merge: true });
  }

  async deleteGameInfo(id: string): Promise<void> {
    const refCollection = collection(
      this.firestore,
      this.pathGameInfo
    );

    try {
      console.log(`Retirando jogo com ID ${id} da sala`);
      const gameRef = doc(refCollection, id);
      await deleteDoc(gameRef);
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }
}
