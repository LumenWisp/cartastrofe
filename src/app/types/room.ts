import { User } from "@angular/fire/auth"
import { CardGame } from "./card";
import { PileModel } from "./pile";

export interface Room {
    id: string;
    available: boolean;
    name: string;
    roomLink: string; // link da sala no momento atual, sempre muda ao criar uma nova sala

    // atributo para controlar o estado atual da sala
    // TODO adicionar todos os campos necessários para controlar o estado da sala
    state?: RoomState;
}

export interface RoomState{
    isGameOcurring: boolean; //Verificar se está acontecendo um jogo no momento
    gameId: string; // Id do jogo que está vinculado a sala no momento

    //Em relação ao momento do jogo
    currentPlayerToPlay?: string; // Id do jogador que vai jogar agora
    currentphase?: string;
    cards?: CardGame[];
    piles?: PileModel[];
}