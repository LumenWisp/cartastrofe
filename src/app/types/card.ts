import { CardFieldModel } from "../types/card-field";

// DEIXEI ALGUNS CAMPOS COMO OPCIONAL PARA TESTES NO MODO LIVRE, REMOVER DEPOIS!!
export interface CardModel {
    id?: string,
    templateId?: string,
    gameID?: number,
    name?: string,
    fieldContents?: CardFieldModel[],

    // Modo livre
    label?: string,
    flipped?: boolean,
}