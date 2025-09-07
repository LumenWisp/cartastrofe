import { Injectable } from '@angular/core';
import { FreeModeService } from './free-mode.service';
import { CardGame } from '../types/card';

@Injectable({
  providedIn: 'root'
})
export class BlockCodeGeneratorsService {

  constructor(private freeModeService: FreeModeService) { }

  // Criar as funcoes usadas nos retornos dos blocos lógicos. exexmplo: getCard, getPile, moveCardTo
  moveCardTo(cardId: string, pileId: string): void {
    const card =  this.freeModeService.getCardById(cardId);
    if(card){
      this.freeModeService.removeCardFromPile(pileId, card);
      card['pileId'] = pileId;
      this.freeModeService.updateCard(card);
    }
  }

  ChangeAttributeFromCardTo(attribute: keyof CardGame, cardId: string, attributeNewValue: string){

    const card =  this.freeModeService.getCardById(cardId);
    const newValue = parseInt(attributeNewValue)

    if(card){
      // TODO: fazer isso não parecer uma gambiarra
      card[attribute] = attributeNewValue as never;
      this.freeModeService.updateCard(card);
    }

  }
}
