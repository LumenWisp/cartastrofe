import { CardLayoutModel } from "./card-layout"

export interface UserEntity {
    userID: string,
    name: string,
    email: string,
    password: string,
    cardLayoutsIds: string[];
}
