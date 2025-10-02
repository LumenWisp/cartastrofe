import { CardLayoutModel } from "./card-layout"

export interface UserEntity {
    userId: string,
    name: string,
    email: string,
    password: string,
    cardLayoutsIds: string[];
}
