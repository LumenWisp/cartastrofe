import { Injectable, inject } from '@angular/core';
import { FirestoreTablesEnum } from '../enum/firestore-tables.enum';
import { Auth } from '@angular/fire/auth';
import {
  collection,
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
    if(!this.userService.getUserLogged()){
      throw new Error('Usuário não encontrado.');
    }

    try{
      const avaiableRoom = await this.getAvaiableRoom();

      //Verificar se não encontrou salas disponiveis
      if(!avaiableRoom){
        return null;
      }

      //Gera o novo link de entrada para a sala
      const linkCode: string = await this.generateLinkCode();

      //Gera o novo estado da sala
      const roomState: RoomState = {
        isGameOcurring: false,
        gameId: gameId,
        roomLink: linkCode,
      }

      const updatedRoom: Room = {
        ...avaiableRoom,
        state: roomState
      }

      await this.updateRoom(updatedRoom);
      return updatedRoom;

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

  private async generateLinkCode(): Promise<string> {
    const linkCode = await this.utilsService.generateKey(20);
    return linkCode;
  }
}
