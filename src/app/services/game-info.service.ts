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
import { CardModel } from '../types/card';
import { GameFieldItem } from '../types/game-field-item';

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
    results.push(data);
  });

  return results;
}

  async getGameInfoById(id: string) {
    const user = await this.userService.currentUser()

    if (user === undefined) return null
    if (user === null) throw new Error('Usuário não está logado');

    const refCollection = collection(this.firestore, this.pathGameInfo);
    const queryRef = query(refCollection, where('id', '==', id));
    const snapshot = await getDocs(queryRef);
    const gameInfo = snapshot.docs[0]?.data() as GameInfoModel;

    return gameInfo;
  }

  async getCardLayouts(id: string) {
    const gameInfo = await this.getGameInfoById(id);

    if (!gameInfo) throw new Error('GameInfo não encontrado');
    if (!gameInfo.cardLayoutIds || gameInfo.cardLayoutIds.length === 0) return [];

    const cardLayouts = await Promise.all(gameInfo.cardLayoutIds.map(async cl => await this.cardLayoutService.getCardLayoutById(cl)));

    if (!cardLayouts || cardLayouts.length === 0) return [];

    return cardLayouts;
  }

  async getCards(id: string) {
    const cardLayouts = await this.getCardLayouts(id);
    if (!cardLayouts) throw new Error('CardLayouts não encontrados');
    const cards: { [key: string]: CardModel[] } = {};

    for (const cardLayout of cardLayouts) {
      if (cardLayout && cardLayout.id) {
        cards[cardLayout.id] = await this.cardService.getCardsByLayoutId(cardLayout.id);
      }
    }

    return cards;
  }

  // pega apenas field items que sejam pilhas a partir de um gameinfo
  async getRuledPiles(id: string) {
    const gameInfo = await this.getGameInfoById(id);
    const onlyRuledPiles: GameFieldItem[] = [];
    const fieldItems = gameInfo?.fieldItems;

    if (fieldItems) {
      for (const fieldItem of fieldItems) {
        if (fieldItem.type === 'pile') {
            onlyRuledPiles.push(fieldItem);
        }
      }
    }
    return onlyRuledPiles;
  }

  async getCardsInGame(id: string) {
    const gameInfo = await this.getGameInfoById(id);

    const cardIds = gameInfo?.cardIds || [];

    const cardModels = [];

    for (const cardId of cardIds) {
      const card = await this.cardService.getCardById(cardId);
      if (card) {
        cardModels.push(card);
      }
    }

    return cardModels;
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
      const gameRef = doc(refCollection, id);
      await deleteDoc(gameRef);
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }
}
