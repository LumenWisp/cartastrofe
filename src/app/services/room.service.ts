import { Injectable, inject } from '@angular/core';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { Observable } from 'rxjs';
import { Auth, User } from '@angular/fire/auth';
import {
  collection,
  deleteDoc,
  doc,
  Firestore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  setDoc,
  startAfter,
  updateDoc,
  where,
  collectionData,
  deleteField,
  docData,
} from '@angular/fire/firestore';
import { Room, RoomState } from '../types/room';
import { UtilsService } from './utils.service';
import { UserService } from './user-service.service';
import { PlayerEntity } from '../types/player';
import { UserEntity } from '../types/user';
import { RoomRolesEnum } from '../enum/room-roles.enum';
import { FreeModeService } from './free-mode.service';
import { CardGame } from '../types/card';
import { GameFieldItem } from '../types/game-field-item';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private firestore = inject(Firestore);
  private path = FirestoreTablesEnum.ROOM;

  constructor(
    private utilsService: UtilsService,
    private userService: UserService,
    private freeModeService: FreeModeService
  ) {}

  // =================================
  // ======= MÉTODOS PARA ROOM =======
  // =================================

  async updateRoom(id: string, item: Partial<Room>): Promise<void> {
    if (!id) {
      throw new Error('ID da sala é obrigatório.');
    }

    const ref = doc(this.firestore, this.path, id);

    const updatedData = {
      ...item,
    };

    await setDoc(ref, updatedData, { merge: true });
  }

  async createRoom(gameId: string): Promise<Room | null> {
    const user = await this.userService.currentUser();

    if (!user) throw new Error('Usuário não está logado')

    try {
      const avaiableRoom = await this.getAvaiableRoom();

      //Verificar se não encontrou salas disponiveis
      if (!avaiableRoom) {
        return null;
      }

      //Gera o novo link de entrada para a sala
      const roomLink: string = await this.utilsService.generateLinkCode(20);

      //Gera o novo estado da sala
      const roomState: RoomState = {
        isGameOcurring: false,
        gameId: gameId,
        //cards: this.freeModeService.cards() //DADOS MOCKADOS.
      };

      const updatedRoom: Room = {
        ...avaiableRoom,
        available: false,
        roomLink: roomLink,
        state: roomState,
      };

      await this.updateRoom(updatedRoom.id, updatedRoom);

      //Adicionando o usuário que criou a sala como administrador
      await this.createPlayer(updatedRoom.id, user!, RoomRolesEnum.ADMIN);

      return updatedRoom;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async getRoomByRoomLink(roomLink: string): Promise<Room | null> {
    const refCollection = collection(this.firestore, this.path);

    let queryRef = query(
      refCollection,
      where('roomLink', '==', roomLink),
      where('available', '==', false)
    );

    try {
      const snapshot = await getDocs(queryRef);
      const rooms: Room[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as Room[];
      return rooms[0];
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async getRoomById(id: string): Promise<Room | null> {
    const refCollection = collection(this.firestore, this.path);

    let queryRef = query(refCollection, where('id', '==', id));

    try {
      const snapshot = await getDocs(queryRef);
      const rooms: Room[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as Room[];
      return rooms[0];
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  private async getAvaiableRoom(): Promise<Room | null> {
    const refCollection = collection(this.firestore, this.path);

    try {
      let queryRef = query(refCollection, where('available', '==', true));

      //Adicionado limite pois só precisa de 1 sala disponivel
      queryRef = query(queryRef, limit(1));

      const snapshot = await getDocs(queryRef);
      const rooms: Room[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as Room[];
      return rooms[0];
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  // Reseta a sala para o estado em que fica quando está disponivel
  async resetRoom(id: string): Promise<void> {
    if (!id) {
      throw new Error('ID da sala é obrigatório.');
    }

    const ref = doc(this.firestore, this.path, id);

    const updatedData = {
      available: true,
      name: '',
      roomLink: '',
      state: deleteField(),
    };

    await updateDoc(ref, updatedData);
  }

  // Observa o documento da sala esperando uma mudança para atualizar para todos
  listenRoom(roomId: string): Observable<Room> {
    const refDoc = doc(
      this.firestore,
      this.path,
      roomId
    );

    try {
      return docData(refDoc) as Observable<Room>;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  // ==================================
  // ===== MÉTODOS PARA JOGADORES =====
  // ==================================

  // Observa a subcoleção de jogadores esperando uma mudança para atualizar para todos
  listenPlayers(roomId: string): Observable<PlayerEntity[]> {
    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'players'
    );

    try {
      return collectionData(refCollection) as Observable<PlayerEntity[]>;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async createPlayer(
    roomId: string,
    user: UserEntity,
    role: RoomRolesEnum
  ): Promise<PlayerEntity> {
    const currentUser = this.userService.currentUser();

    if (!currentUser) throw new Error('Usuário não está logado')

    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'players'
    );

    try {
      const playerID: string = await this.utilsService.generateKey(15);

      const player: PlayerEntity = {
        playerId: playerID,
        userId: user.userId,
        name: user.name,
        role: role,
      };

      await setDoc(doc(refCollection, playerID), player);

      return player;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async updatePlayer(
    roomId: string,
    playerId: string,
    player: Partial<PlayerEntity>
  ): Promise<void> {
    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'players',
      playerId
    );

    try {
      const playerRef = doc(refCollection);
      await setDoc(playerRef, player, { merge: true });
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async removePlayer(roomId: string, playerId: string): Promise<void> {
    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'players'
    );

    try {
      
      const playerRef = doc(refCollection, playerId);
      await deleteDoc(playerRef);
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async getCurrentPlayer(roomId: string): Promise<PlayerEntity> {
    const currentUser = await this.userService.currentUser();

    if (!currentUser) throw new Error('Usuário não está logado')

    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'players'
    );

    try {
      let queryRef = query(refCollection, where('userId', '==', currentUser.userId));

      const snapshot = await getDocs(queryRef);
      const result: PlayerEntity[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as PlayerEntity[];

      // Verificando se é um convidado que veio da página de login
      if(!result[0]){
        const player: PlayerEntity = await this.createPlayer(roomId, currentUser, RoomRolesEnum.NORMAL);
        return player;
      }

      return result[0];
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }


  // ======================================
  // == MÉTODOS PARA DEMAIS SUB COLEÇÕES ==
  // ======================================

  //==================== MÉTODOS PARA CARDS

  // Observa a subcoleção de cartas esperando uma mudança para atualizar para todos
  listenCards(roomId: string): Observable<CardGame[]> {
    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'cards'
    );

    try {
      return collectionData(refCollection) as Observable<CardGame[]>;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async createCard(
    roomId: string,
    card: CardGame
  ): Promise<CardGame> {
    const currentUser = this.userService.currentUser();

    if (!currentUser) throw new Error('Usuário não está logado')

    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'cards'
    );

    try {
      const cardId: string = card.id;

      await setDoc(doc(refCollection, cardId), card);

      return card;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async updateCard(
    roomId: string,
    cardId: string,
    card: Partial<CardGame>
  ): Promise<void> {
    const cardRef = doc(
      this.firestore,
      this.path,
      roomId,
      'cards',
      cardId
    );

    try {
      await setDoc(cardRef, card, { merge: true });
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async removeAllCards(roomId: string): Promise<void> {
    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'cards'
    );

    const cardsIds = this.freeModeService.cards().map((card) => card.id);

    try {

      cardsIds.forEach(async (cardId) => {
        const cardRef = doc(refCollection, cardId);
        await deleteDoc(cardRef);
      });

    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  //==================== MÉTODOS PARA RULEDPILES

  // Observa a subcoleção de ruledPiles esperando uma mudança para atualizar para todos
  listenRuledPiles(roomId: string): Observable<GameFieldItem[]> {
    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'ruledPiles'
    );

    try {
      return collectionData(refCollection) as Observable<GameFieldItem[]>;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async createRuledPile(
    roomId: string,
    ruledPile: GameFieldItem
  ): Promise<GameFieldItem> {
    const currentUser = this.userService.currentUser();

    if (!currentUser) throw new Error('Usuário não está logado')

    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'ruledPiles'
    );

    try {
      const ruledPileId: string = ruledPile.nameIdentifier;

      await setDoc(doc(refCollection, ruledPileId), ruledPile);

      return ruledPile;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async updateRuledPile(
    roomId: string,
    ruledPileId: string,
    ruledPile: Partial<GameFieldItem>
  ): Promise<void> {
    const ruledPileRef = doc(
      this.firestore,
      this.path,
      roomId,
      'ruledPiles',
      ruledPileId
    );

    try {
      await setDoc(ruledPileRef, ruledPile, { merge: true });
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }
}
