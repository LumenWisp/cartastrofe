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
} from '@angular/fire/firestore';
import { Room, RoomState } from '../types/room';
import { UtilsService } from './utils.service';
import { UserService } from './user-service.service';
import { PlayerEntity } from '../types/player';
import { UserEntity } from '../types/user';
import { RoomRolesEnum } from '../enum/room-roles.enum';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private firestore = inject(Firestore);
  private path = FirestoreTablesEnum.ROOM;

  constructor(
    private utilsService: UtilsService,
    private userService: UserService
  ) {}

  //==================== MÉTODOS PARA ROOM

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
      };

      const updatedRoom: Room = {
        ...avaiableRoom,
        avaiable: false,
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
      where('avaiable', '==', false)
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
      let queryRef = query(refCollection, where('avaiable', '==', true));

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
      avaiable: true,
      name: '',
      roomLink: '',
      state: deleteField(),
    };

    await updateDoc(ref, updatedData);
  }

  //==================== MÉTODOS PARA JOGADORES

  // Observa a colleção de jogadores esperando uma mudança para atualizar para todos
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
      console.log(`Retirando jogador com ID ${playerId} da sala`);
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
      let queryRef = query(refCollection, where('userID', '==', currentUser.userId));

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
}
