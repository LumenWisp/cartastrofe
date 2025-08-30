import { User } from "@angular/fire/auth"

export interface Room {
    id: string;
    avaiable: boolean;
    name: string;
    roomLink: string; // link da sala no momento atual, sempre muda ao criar uma nova sala

    // usuários
    users: User[];
    userAdmin: User; // Também deve estar incluso no atributo users

    // atributo para controlar o estado atual da sala
    // TODO adicionar todos os campos necessários para controlar o estado da sala
    state?: RoomState;
}

export interface RoomState{
    isGameOcurring: boolean; //Verificar se está acontecendo um jogo no momento
    gameId: string; // Id do jogo que está vinculado a sala no momento

    //Em relação ao momento do jogo
    playerTurn?: string; // Id do jogador que vai jogar agora
}