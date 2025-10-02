import { RoomRolesEnum } from "../enum/room-roles.enum";

export interface PlayerEntity {
    playerId: string; // ID do usuário naquela sala, para ser fácil fazer operações no documento dele na subcoleção de players da sala
    userId: string; // ID do usuário, igual ao userID do mesmo usuário
    name: string; // nome do jogador, igual ao name do mesmo usuário
    role: RoomRolesEnum; // Papel do usuário na sala (admin, espectador, etc)
}
