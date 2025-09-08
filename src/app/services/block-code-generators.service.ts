import { Injectable } from '@angular/core';
import { FreeModeService } from './free-mode.service';
import { CardGame } from '../types/card';

@Injectable({
  providedIn: 'root'
})
export class BlockCodeGeneratorsService {

  constructor(private freeModeService: FreeModeService) { }

  //===============================
  //          TRIGGERS
  //===============================

  onPhase(phaseId: string, currentPhase: string): boolean{
    return phaseId === currentPhase;
  }

  //===============================
  //          ACTIONS
  //===============================
  moveCardTo(cardId: string, pileId: string): void {
    const card =  this.freeModeService.getCardById(cardId);
    if(card){
      this.freeModeService.removeCardFromPile(pileId, card);
      card['pileId'] = pileId;
      this.freeModeService.updateCard(card);
    }
  }

  changeAttributeFromCardTo(attribute: keyof CardGame, cardId: string, attributeNewValue: string){

    const card =  this.freeModeService.getCardById(cardId);
    const newValue = parseInt(attributeNewValue)

    if(card){
      // TODO: fazer isso não parecer uma gambiarra
      card[attribute] = attributeNewValue as never;
      this.freeModeService.updateCard(card);
    }

  }
}
