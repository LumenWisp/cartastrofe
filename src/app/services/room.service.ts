import { Injectable, inject } from '@angular/core';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
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

  async updateRoom(item: Partial<Room>) {
    if (!item.id) {
      throw new Error('ID da sala é obrigatório.');
    }

    const ref = doc(this.firestore, this.path, item.id);

    const updatedData = {
      ...item,
    };

    await updateDoc(ref, updatedData);
  }

  async createRoom(gameId: string): Promise<Room | null> {
    if (!this.userService.getUserLogged()) {
      throw new Error('Usuário não encontrado.');
    }

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

      await this.updateRoom(updatedRoom);
      return updatedRoom;
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }

  async getRoomByRoomLink(roomLink: string): Promise<Room | null> {
    const refCollection = collection(this.firestore, this.path);

    let queryRef = query(refCollection, where('roomLink', '==', roomLink));

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

    let queryRef = query(refCollection, where('avaiable', '==', true));

    //Adicionado limite pois só precisa de 1 sala disponivel
    queryRef = query(queryRef, limit(1));

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

  //==================== MÉTODOS PARA JOGADORES

  async getPlayers(roomId: string): Promise<PlayerEntity[] | null> {
    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'players'
    );

    try {
      const snapshot = await getDocs(refCollection);
      const users: PlayerEntity[] = snapshot.docs.map((doc) => ({
        ...doc.data(),
      })) as PlayerEntity[];
      return users;
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
    if (!this.userService.getUserLogged()) {
      throw new Error('Usuário não encontrado.');
    }

    const refCollection = collection(
      this.firestore,
      this.path,
      roomId,
      'players'
    );

    try {
      const playerID: string = await this.utilsService.generateKey(15);

      const player: PlayerEntity = {
        playerID: playerID,
        userID: user.userID,
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
      'players',
      playerId
    );

    try {
      const playerRef = doc(refCollection);
      await deleteDoc(playerRef);
    } catch (error) {
      console.error(' Firestore Error:', error);
      throw error;
    }
  }
}
